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

// GET /api/admin/products (Fetch all 555 footwear products with complete variants, media, and category)
router.get('/products', async (req: AuthRequest, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        media: true,
        category: true,
      },
      orderBy: { sku: 'asc' },
    });

    res.json({
      success: true,
      data: products,
      total: products.length,
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

// PUT /api/admin/products/:id (Update product details, category, brand, and pricing)
router.put('/products/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const {
      title,
      brand,
      department,
      categoryId,
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
    if (department) data.department = department;
    if (categoryId) data.categoryId = categoryId;
    if (price !== undefined) data.price = parseFloat(price);
    if (originalPrice !== undefined) data.originalPrice = parseFloat(originalPrice);
    if (discountPercent !== undefined) data.discountPercent = parseInt(discountPercent);
    if (description !== undefined) data.description = description;
    if (details !== undefined) data.details = details;
    if (has3D !== undefined) data.has3D = Boolean(has3D);
    if (model3DConfig !== undefined) data.model3DConfig = typeof model3DConfig === 'object' ? JSON.stringify(model3DConfig) : model3DConfig;
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
      include: { variants: true, media: true, category: true },
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

// PUT /api/admin/products/:id/toggle-stock (Toggle In-Stock / Out-of-Stock)
router.put('/products/:id/toggle-stock', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { isOutOfStock } = req.body;

    // Determine target inventory: 0 if marking out of stock, 15 if restoring stock
    const targetQty = isOutOfStock ? 0 : 15;

    await prisma.productVariant.updateMany({
      where: { productId: id },
      data: { inventory: targetQty },
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, media: true, category: true },
    });

    res.json({
      success: true,
      message: isOutOfStock ? 'Product marked as Out of Stock' : 'Product marked as In Stock',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id/price (Quick Price Fixing)
router.put('/products/:id/price', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { price, originalPrice, discountPercent } = req.body;

    const data: any = {};
    if (price !== undefined) data.price = parseFloat(price);
    if (originalPrice !== undefined) data.originalPrice = parseFloat(originalPrice);
    if (discountPercent !== undefined) {
      data.discountPercent = parseInt(discountPercent);
    } else if (originalPrice && price && parseFloat(originalPrice) > parseFloat(price)) {
      data.discountPercent = Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100);
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { variants: true, media: true, category: true },
    });

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id/toggle-size-stock (Toggle stock availability for a specific size)
router.put('/products/:id/toggle-size-stock', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { size, isOutOfStock } = req.body;

    if (!size) {
      res.status(400).json({ success: false, message: 'Size parameter is required.' });
      return;
    }

    const targetInventory = isOutOfStock ? 0 : 15;

    await prisma.productVariant.updateMany({
      where: { productId: id, size },
      data: { inventory: targetInventory },
    });

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, media: true, category: true },
    });

    res.json({
      success: true,
      message: `Size ${size} marked as ${isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id/sizes (Update/Manage multiple sizes & stock availability)
router.put('/products/:id/sizes', async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const { sizes } = req.body; // Array of { size: string, inventory: number, colorName?: string }

    if (!Array.isArray(sizes)) {
      res.status(400).json({ success: false, message: 'Sizes array is required.' });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const existingVariants = product.variants;
    const inputSizeNames = new Set(sizes.map((s: any) => s.size.trim()));

    // 1. Delete variants whose size was removed by admin
    for (const v of existingVariants) {
      if (!inputSizeNames.has(v.size)) {
        await prisma.productVariant.delete({ where: { id: v.id } });
      }
    }

    // 2. Update existing or create new variants
    for (const sItem of sizes) {
      const sTrim = sItem.size.trim();
      const inv = typeof sItem.inventory === 'number' ? Math.max(0, sItem.inventory) : (sItem.isAvailable ? 15 : 0);
      const match = existingVariants.find((v) => v.size === sTrim);

      if (match) {
        await prisma.productVariant.update({
          where: { id: match.id },
          data: { inventory: inv },
        });
      } else {
        const cleanSku = `${product.sku}-${sTrim.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;
        await prisma.productVariant.create({
          data: {
            productId: id,
            sku: cleanSku,
            size: sTrim,
            colorName: sItem.colorName || existingVariants[0]?.colorName || 'Classic',
            colorHex: existingVariants[0]?.colorHex || '#222222',
            inventory: inv,
            priceAdjustment: 0,
          },
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, media: true, category: true },
    });

    res.json({
      success: true,
      message: 'Product sizes and stock updated successfully',
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

// =========================================================================
// 3D MODEL ASSET MANAGEMENT ENDPOINTS (CHANDHANA SHOE MART 3D STUDIO)
// =========================================================================

// GET /api/admin/models/available (List built-in and uploaded 3D assets)
router.get('/models/available', async (_req: AuthRequest, res: Response, next) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const modelsDir = path.resolve(process.cwd(), 'client/public/models');

    const available: Array<{
      filename: string;
      url: string;
      type: string;
      sizeBytes: number;
      format: string;
      isBuiltIn: boolean;
    }> = [];

    if (fs.existsSync(modelsDir)) {
      const files = fs.readdirSync(modelsDir);
      for (const file of files) {
        if (file.toLowerCase().endsWith('.glb') || file.toLowerCase().endsWith('.gltf')) {
          const stats = fs.statSync(path.join(modelsDir, file));
          const isBuiltIn = ['shoe.glb', 'slipper.glb', 'sandal.glb', 'formal.glb', 'loafer.glb', 'boot.glb'].includes(file);
          
          let inferredType = 'custom';
          if (file.includes('shoe')) inferredType = 'sneaker';
          else if (file.includes('slipper')) inferredType = 'slipper';
          else if (file.includes('sandal')) inferredType = 'sandal';
          else if (file.includes('formal')) inferredType = 'formal';
          else if (file.includes('loafer')) inferredType = 'loafer';
          else if (file.includes('boot')) inferredType = 'boot';

          available.push({
            filename: file,
            url: `/models/${file}`,
            type: inferredType,
            sizeBytes: stats.size,
            format: 'glb',
            isBuiltIn,
          });
        }
      }
    }

    res.json({ success: true, data: available });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/models/upload (Securely upload and validate GLB model)
router.post('/models/upload', async (req: AuthRequest, res: Response, next) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { filename, base64Data } = req.body;

    if (!filename || !base64Data) {
      res.status(400).json({
        success: false,
        message: 'Both filename and base64Data are required for model upload.',
      });
      return;
    }

    // Strip data URL scheme prefix if provided
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // 1. Size Validation (Max 35 MB)
    const MAX_SIZE_BYTES = 35 * 1024 * 1024;
    if (buffer.length > MAX_SIZE_BYTES) {
      res.status(400).json({
        success: false,
        message: `File exceeds maximum allowed size of 35MB (Current: ${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
      });
      return;
    }

    // 2. Binary glTF Header Validation (Magic bytes: 'glTF' -> 0x46546C67)
    if (buffer.length < 20) {
      res.status(400).json({
        success: false,
        message: 'Uploaded file is corrupted or too small to be a valid 3D model.',
      });
      return;
    }

    const magic = buffer.toString('utf8', 0, 4);
    if (magic !== 'glTF') {
      res.status(400).json({
        success: false,
        message: `Invalid 3D model format. Header magic was "${magic}", expected "glTF" binary. Only standard glTF 2.0 binary (.glb) files are accepted.`,
      });
      return;
    }

    const version = buffer.readUInt32LE(4);
    if (version !== 2) {
      res.status(400).json({
        success: false,
        message: `Unsupported glTF version: ${version}. Only glTF 2.0 is supported.`,
      });
      return;
    }

    // 3. Sanitize filename & save
    const safeBaseName = filename
      .toLowerCase()
      .replace(/\.glb$/i, '')
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 40);

    const savedFilename = `custom_${safeBaseName}_${Date.now().toString().slice(-6)}.glb`;

    const targetDirs = [
      path.resolve(process.cwd(), 'client/public/models'),
      path.resolve(process.cwd(), 'client/dist/models'),
      path.resolve(process.cwd(), 'uploads/models'),
    ];

    for (const d of targetDirs) {
      if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
      }
      fs.writeFileSync(path.join(d, savedFilename), buffer);
    }

    const modelUrl = `/models/${savedFilename}`;

    res.status(201).json({
      success: true,
      message: '3D model validated and published successfully.',
      data: {
        filename: savedFilename,
        modelUrl,
        sizeBytes: buffer.length,
        format: 'glb',
        version: 2,
        status: 'ready',
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id/model (Assign/Update product 3D configuration)
router.put('/products/:id/model', async (req: AuthRequest, res: Response, next) => {
  try {
    const productId = req.params.id;
    const {
      has3D,
      modelType,
      modelUrl,
      defaultColor,
      accentColor,
      soleColor,
      roughness,
      metalness,
      variants,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Parse or build model3DConfig
    let parsedConfig: any = {};
    if (existingProduct.model3DConfig) {
      try {
        parsedConfig = JSON.parse(existingProduct.model3DConfig);
      } catch {}
    }

    const updatedConfig = {
      ...parsedConfig,
      modelType: modelType !== undefined ? modelType : parsedConfig.modelType || 'sneaker',
      modelUrl: modelUrl !== undefined ? modelUrl : parsedConfig.modelUrl,
      format: 'glb',
      status: 'ready',
      defaultColor: defaultColor || parsedConfig.defaultColor || '#DC2626',
      accentColor: accentColor || parsedConfig.accentColor || '#FFFFFF',
      soleColor: soleColor || parsedConfig.soleColor || '#F8FAFC',
      roughness: roughness !== undefined ? parseFloat(roughness) : (parsedConfig.roughness ?? 0.5),
      metalness: metalness !== undefined ? parseFloat(metalness) : (parsedConfig.metalness ?? 0.1),
      variants: variants || parsedConfig.variants || [],
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        has3D: has3D !== undefined ? Boolean(has3D) : true,
        model3DConfig: JSON.stringify(updatedConfig),
      },
      include: {
        category: true,
        variants: true,
        media: true,
      },
    });

    res.json({
      success: true,
      message: 'Product 3D configuration saved successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
