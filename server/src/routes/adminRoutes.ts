import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Apply admin guard to all routes
router.use(authenticateToken as any, requireAdmin as any);

// GET /api/admin/stats
router.get('/stats', async (_req: AuthRequest, res: Response, next) => {
  try {
    const [totalOrders, productsCount, orders, lowStockVariants, outOfStockVariants] =
      await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { items: true },
        }),
        prisma.productVariant.count({
          where: { inventory: { lte: 5, gt: 0 } },
        }),
        prisma.productVariant.count({
          where: { inventory: { lte: 0 } },
        }),
      ]);

    const confirmedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
      },
      select: { totalAmount: true },
    });

    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = await prisma.order.count({
      where: { status: { in: ['PLACED', 'CONFIRMED', 'PROCESSING'] } },
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        productsCount,
        lowStockVariants,
        outOfStockVariants,
        recentOrders: orders,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders
router.get('/orders', async (req: AuthRequest, res: Response, next) => {
  try {
    const { status, search } = req.query;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status as string;
    }

    if (search) {
      const s = (search as string).trim();
      where.OR = [
        { orderNumber: { contains: s } },
        { trackingNumber: { contains: s } },
        { guestEmail: { contains: s } },
        { guestName: { contains: s } },
        { user: { name: { contains: s } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req: AuthRequest, res: Response, next) => {
  try {
    const { status, trackingNumber, courierName, paymentStatus } = req.body;

    const data: any = {};
    if (status) data.status = status;
    if (trackingNumber) data.trackingNumber = trackingNumber;
    if (courierName) data.courierName = courierName;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data,
      include: { items: true },
    });

    res.json({
      success: true,
      message: `Order status updated to ${updated.status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/inventory
router.get('/inventory', async (req: AuthRequest, res: Response, next) => {
  try {
    const { lowStockOnly } = req.query;
    const where: any = {};
    if (lowStockOnly === 'true') {
      where.inventory = { lte: 5 };
    }

    const variants = await prisma.productVariant.findMany({
      where,
      include: {
        product: { select: { id: true, title: true, sku: true, brand: true, price: true } },
      },
      orderBy: { inventory: 'asc' },
    });

    res.json({ success: true, data: variants });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/inventory/:variantId
router.put('/inventory/:variantId', async (req: AuthRequest, res: Response, next) => {
  try {
    const { inventory } = req.body;
    const qty = parseInt(inventory);

    if (isNaN(qty) || qty < 0) {
      res.status(400).json({ success: false, message: 'Valid non-negative inventory number is required.' });
      return;
    }

    const updated = await prisma.productVariant.update({
      where: { id: req.params.variantId },
      data: { inventory: qty },
      include: { product: true },
    });

    res.json({
      success: true,
      message: `Stock updated for ${updated.sku} to ${updated.inventory}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products (Create product)
router.post('/products', async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      title,
      brand,
      sku,
      categoryId,
      department,
      price,
      originalPrice,
      discountPercent,
      description,
      details,
      has3D,
      model3DConfig,
      videoUrl,
      videoPoster,
      upperMaterial,
      soleMaterial,
      insoleMaterial,
      cushioning,
      closureType,
      heelHeight,
      weight,
      gripType,
      careInstructions,
      warranty,
      media = [],
      variants = [],
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        brand: brand || 'Chandhana',
        sku,
        categoryId,
        department,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountPercent: parseInt(discountPercent) || 0,
        description,
        details,
        has3D: Boolean(has3D),
        model3DConfig: typeof model3DConfig === 'object' ? JSON.stringify(model3DConfig) : model3DConfig,
        videoUrl,
        videoPoster,
        upperMaterial,
        soleMaterial,
        insoleMaterial,
        cushioning,
        closureType,
        heelHeight,
        weight,
        gripType,
        careInstructions,
        warranty,
        media: {
          create: media.map((url: string, idx: number) => ({
            url,
            order: idx,
            type: 'IMAGE',
          })),
        },
        variants: {
          create: variants.map((v: any, idx: number) => ({
            sku: v.sku || `${sku}-${v.size}-${idx}`,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            size: v.size,
            inventory: parseInt(v.inventory) || 10,
            priceAdjustment: parseFloat(v.priceAdjustment) || 0,
            imageUrl: v.imageUrl || (media[0] || ''),
          })),
        },
      },
      include: {
        variants: true,
        media: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id (Update product)
router.put('/products/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      title,
      brand,
      price,
      originalPrice,
      discountPercent,
      description,
      details,
      has3D,
      model3DConfig,
      videoUrl,
      videoPoster,
      upperMaterial,
      soleMaterial,
      isFeatured,
      isTrending,
      isNewArrival,
    } = req.body;

    const data: any = {};
    if (title) data.title = title;
    if (brand) data.brand = brand;
    if (price !== undefined) data.price = parseFloat(price);
    if (originalPrice !== undefined) data.originalPrice = parseFloat(originalPrice);
    if (discountPercent !== undefined) data.discountPercent = parseInt(discountPercent);
    if (description) data.description = description;
    if (details) data.details = details;
    if (has3D !== undefined) data.has3D = Boolean(has3D);
    if (model3DConfig) data.model3DConfig = typeof model3DConfig === 'object' ? JSON.stringify(model3DConfig) : model3DConfig;
    if (videoUrl !== undefined) data.videoUrl = videoUrl;
    if (videoPoster !== undefined) data.videoPoster = videoPoster;
    if (upperMaterial) data.upperMaterial = upperMaterial;
    if (soleMaterial) data.soleMaterial = soleMaterial;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isTrending !== undefined) data.isTrending = Boolean(isTrending);
    if (isNewArrival !== undefined) data.isNewArrival = Boolean(isNewArrival);

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { variants: true, media: true },
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const productId = req.params.id;

    // Check if product is in any past orders
    const orderCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete style: referenced in ${orderCount} customer order(s). You can set its inventory to 0 to mark as discontinued.`,
      });
      return;
    }

    await prisma.product.delete({
      where: { id: productId },
    });
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// Coupons
router.get('/coupons', async (_req: AuthRequest, res: Response, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
});

router.post('/coupons', async (req: AuthRequest, res: Response, next) => {
  try {
    const { code, discountType, value, minOrderValue, maxDiscount, expiresAt } = req.body;
    const coupon = await prisma.coupon.create({
      data: {
        code: code.trim().toUpperCase(),
        discountType: discountType || 'PERCENTAGE',
        value: parseFloat(value),
        minOrderValue: parseFloat(minOrderValue) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error) {
    next(error);
  }
});

// Store Settings
router.get('/settings', async (_req: AuthRequest, res: Response, next) => {
  try {
    const settings = await prisma.storeSettings.findFirst();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req: AuthRequest, res: Response, next) => {
  try {
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'store-default' },
      update: req.body,
      create: {
        id: 'store-default',
        ...req.body,
      },
    });
    res.json({ success: true, message: 'Store settings updated', data: settings });
  } catch (error) {
    next(error);
  }
});

export default router;
