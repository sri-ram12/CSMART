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

export default router;
