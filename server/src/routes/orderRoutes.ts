import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create new order (supports both logged in and guest checkout)
router.post('/', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'COD',
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      couponCode,
      guestInfo,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({ success: false, message: 'Shipping address is required.' });
      return;
    }

    const settings = (await prisma.storeSettings.findFirst()) || {
      freeShippingThreshold: 999,
      standardShippingFee: 99,
    };

    // Run order creation and inventory deduction in transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const it of items) {
        const product = await tx.product.findUnique({
          where: { id: it.productId },
          include: { variants: true },
        });

        if (!product) {
          throw new Error(`Product ${it.productId} not found.`);
        }

        let variant = null;
        if (it.variantId) {
          variant = product.variants.find((v) => v.id === it.variantId);
        } else if (it.size && it.colorName) {
          variant = product.variants.find(
            (v) => v.size === it.size && v.colorName.toLowerCase() === it.colorName.toLowerCase()
          );
        }

        const availableStock = variant ? variant.inventory : 10;
        const qty = Math.max(1, parseInt(it.quantity) || 1);

        if (availableStock < qty) {
          throw new Error(
            `Insufficient stock for "${product.title}" (${variant?.size || 'Standard'}). Available: ${availableStock}.`
          );
        }

        // Deduct variant inventory
        if (variant) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { inventory: { decrement: qty } },
          });
        }

        const unitPrice = product.price + (variant?.priceAdjustment || 0);
        const itemTotal = unitPrice * qty;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: product.id,
          variantId: variant?.id,
          productTitle: product.title,
          sku: variant?.sku || product.sku,
          colorName: variant?.colorName || it.colorName || 'Default',
          size: variant?.size || it.size || 'Standard',
          unitPrice,
          quantity: qty,
          totalPrice: itemTotal,
          imageUrl: variant?.imageUrl || it.imageUrl || '',
        });
      }

      // Calculate coupon discount
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() },
        });
        if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.value;
          }
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }

      const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
      const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

      const orderNumber = `CSM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Determine initial payment status
      const paymentStatus = paymentMethod === 'RAZORPAY' && paymentId ? 'PAID' : 'PENDING';

      // Estimated delivery timeline (3-5 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const estimatedDelivery = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      return await tx.order.create({
        data: {
          orderNumber,
          userId: req.user?.id || null,
          guestEmail: !req.user ? guestInfo?.email : null,
          guestName: !req.user ? guestInfo?.name : null,
          guestPhone: !req.user ? guestInfo?.phone : null,
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          couponCode: discountAmount > 0 ? couponCode : null,
          status: paymentStatus === 'PAID' ? 'CONFIRMED' : 'PLACED',
          paymentStatus,
          paymentMethod,
          paymentId,
          razorpayOrderId,
          razorpayPaymentId,
          shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
          trackingNumber: `CSM-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
          courierName: 'CSM Express / Blue Dart',
          estimatedDelivery,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

// GET customer's orders
router.get('/my-orders', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// GET single order by ID or orderNumber
router.get('/:idOrNumber', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { idOrNumber } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Check ownership if user is logged in
    if (order.userId && req.user && req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied to this order.' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Cancel order
router.post('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { reason = 'Customer requested cancellation' } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const cancelableStatuses = ['PLACED', 'CONFIRMED', 'PROCESSING'];
    if (!cancelableStatuses.includes(order.status)) {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in status "${order.status}". Please contact support for assistance.`,
      });
      return;
    }

    // Restore inventory and update order status in transaction
    const updated = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { inventory: { increment: item.quantity } },
          });
        }
      }

      return await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          cancelReason: reason,
        },
      });
    });

    res.json({ success: true, message: 'Order cancelled successfully. Stock restored.', data: updated });
  } catch (error) {
    next(error);
  }
});

// Request Return
router.post('/:id/return', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { reason = 'Fit or size issue' } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.status !== 'DELIVERED') {
      res.status(400).json({ success: false, message: 'Return can only be requested for delivered orders.' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'RETURN_REQUESTED',
        returnReason: reason,
      },
    });

    res.json({
      success: true,
      message: 'Return request submitted successfully. Our courier partner will schedule pickup within 48 hours.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
