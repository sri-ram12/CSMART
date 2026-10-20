import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET all categories with product counts
router.get('/', async (_req: Request, res: Response, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        productCount: c._count.products,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET category by slug
router.get('/:slug', async (req: Request, res: Response, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
