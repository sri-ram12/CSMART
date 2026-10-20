import { Router, Request, Response } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// GET /api/products (with rich filters, search, pagination, sorting)
router.get('/', async (req: Request, res: Response, next) => {
  try {
    const {
      search,
      department,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      has3D,
      sortBy = 'recommended',
      page = '1',
      limit = '12',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit as string) || 12));
    const skip = (pageNum - 1) * take;

    // Build Prisma where filter
    const where: any = {};

    if (department && department !== 'ALL') {
      where.department = department as string;
    }

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (search) {
      const s = (search as string).trim();
      where.OR = [
        { title: { contains: s } },
        { brand: { contains: s } },
        { sku: { contains: s } },
        { description: { contains: s } },
        { upperMaterial: { contains: s } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (has3D === 'true') {
      where.has3D = true;
    }

    // Filter by variant properties (size, color, inStock)
    if (size || color || inStock === 'true') {
      where.variants = {
        some: {
          ...(size ? { size: size as string } : {}),
          ...(color ? { colorName: { contains: color as string } } : {}),
          ...(inStock === 'true' ? { inventory: { gt: 0 } } : {}),
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'best_selling':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'recommended':
      default:
        orderBy = [{ isFeatured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }];
        break;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true, department: true } },
          media: { orderBy: { order: 'asc' } },
          variants: true,
        },
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(totalCount / take),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/featured
router.get('/featured', async (_req: Request, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        variants: true,
      },
      take: 8,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/trending
router.get('/trending', async (_req: Request, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isTrending: true },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        variants: true,
      },
      take: 8,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/3d-collection
router.get('/3d-collection', async (_req: Request, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { has3D: true },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        variants: true,
      },
      take: 6,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/by-slug/:slug
router.get('/by-slug/:slug', async (req: Request, res: Response, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        variants: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Also get related products in same department/category
    const related = await prisma.product.findMany({
      where: {
        department: product.department,
        id: { not: product.id },
      },
      include: {
        media: { orderBy: { order: 'asc' } },
        variants: true,
      },
      take: 4,
    });

    res.json({ success: true, data: { ...product, related } });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        media: { orderBy: { order: 'asc' } },
        variants: true,
        reviews: true,
      },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
