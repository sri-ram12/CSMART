import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// Validate cart, verify stock, calculate coupon discount & shipping
router.post('/validate', async (req: Request, res: Response, next) => {
  try {
    const { items = [], couponCode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
      return;
    }

    // Load store settings
    const settings = await prisma.storeSettings.findFirst() || {
      freeShippingThreshold: 999,
      standardShippingFee: 99,
    };

    let subtotal = 0;
    const validatedItems = [];
    const stockIssues: string[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: true,
          media: { take: 1 },
        },
      });

      if (!product) {
        stockIssues.push(`Product "${item.title || item.productId}" is no longer available.`);
        continue;
      }

      let selectedVariant = null;
      if (item.variantId) {
        selectedVariant = product.variants.find((v) => v.id === item.variantId);
      } else if (item.size && item.colorName) {
        selectedVariant = product.variants.find(
          (v) => v.size === item.size && v.colorName.toLowerCase() === item.colorName.toLowerCase()
        );
      }

      const availableStock = selectedVariant ? selectedVariant.inventory : 10;
      const requestedQty = Math.max(1, parseInt(item.quantity) || 1);

      if (requestedQty > availableStock) {
        stockIssues.push(
          `Only ${availableStock} units available for ${product.title} (${selectedVariant?.size || 'standard'}).`
        );
      }

      const unitPrice = product.price + (selectedVariant?.priceAdjustment || 0);
      const itemTotal = unitPrice * requestedQty;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: selectedVariant?.id,
        title: product.title,
        sku: selectedVariant?.sku || product.sku,
        size: selectedVariant?.size || item.size || 'Standard',
        colorName: selectedVariant?.colorName || item.colorName || 'Standard',
        colorHex: selectedVariant?.colorHex || '#000000',
        imageUrl: selectedVariant?.imageUrl || product.media[0]?.url || '',
        unitPrice,
        quantity: requestedQty,
        totalPrice: itemTotal,
        inStock: requestedQty <= availableStock,
        availableStock,
      });
    }

    // Coupon calculation
    let discountAmount = 0;
    let couponDetails = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        couponDetails = { valid: false, message: 'Invalid or expired coupon code.' };
      } else if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        couponDetails = { valid: false, message: 'This coupon code has expired.' };
      } else if (subtotal < coupon.minOrderValue) {
        couponDetails = {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`,
        };
      } else {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.value) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.value;
        }

        discountAmount = Math.min(discountAmount, subtotal);
        couponDetails = {
          valid: true,
          code: coupon.code,
          discountAmount,
          message: `Coupon ${coupon.code} applied successfully!`,
        };
      }
    }

    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const finalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    res.json({
      success: true,
      data: {
        items: validatedItems,
        subtotal,
        discountAmount,
        shippingFee,
        finalAmount,
        coupon: couponDetails,
        stockIssues,
        isEligibleForFreeShipping: subtotal >= settings.freeShippingThreshold,
        freeShippingThreshold: settings.freeShippingThreshold,
        amountNeededForFreeShipping: Math.max(0, settings.freeShippingThreshold - subtotal),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
