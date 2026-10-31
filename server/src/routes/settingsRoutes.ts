import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET public store settings
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    const settings = await prisma.storeSettings.findFirst();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// GET public active banners — used by customer homepage
router.get('/banners', async (_req: Request, res: Response, next) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
});

// GET public active video ads — used by customer storefront
router.get('/video-ads', async (_req: Request, res: Response, next) => {
  try {
    const ads = await prisma.videoAd.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: ads });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings/video-ads/:id/view — track video ad view
router.post('/video-ads/:id/view', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    await prisma.videoAd.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /api/settings/enquiries/log — log customer WhatsApp product enquiry
router.post('/enquiries/log', async (req: Request, res: Response, next) => {
  try {
    const {
      customerName,
      phone,
      productId,
      productTitle,
      sku,
      brand,
      price,
      imageUrl,
      size,
      color,
      message,
      source,
    } = req.body;

    const enquiry = await prisma.whatsAppEnquiry.create({
      data: {
        customerName: customerName || 'Store Visitor',
        phone: phone || null,
        productId: productId || null,
        productTitle: productTitle || null,
        sku: sku || null,
        brand: brand || null,
        price: price ? parseFloat(String(price)) : null,
        imageUrl: imageUrl || null,
        size: size || null,
        color: color || null,
        message: message || 'Customer clicked WhatsApp to inquire about footwear.',
        source: source || 'PRODUCT_DETAIL',
        status: 'NEW',
      },
    });

    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
});

export default router;
