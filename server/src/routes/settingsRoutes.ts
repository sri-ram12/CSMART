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

export default router;
