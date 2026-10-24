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
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      has3D,
      discount,
      rating,
      sortBy = 'recommended',
      page = '1',
      limit = '24',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const take = Math.min(60, Math.max(1, parseInt(limit as string) || 24));
    const skip = (pageNum - 1) * take;

    // Build Prisma where filter
    const where: any = {};
    const andClauses: any[] = [];

    if (department && department !== 'ALL') {
      const depts = (department as string).split(',').map((d) => d.trim()).filter(Boolean);
      if (depts.length === 1) {
        if (depts[0] === 'BOYS' || depts[0] === 'GIRLS') {
          where.department = 'KIDS';
        } else {
          where.department = depts[0];
        }
      } else if (depts.length > 1) {
        const mapped = Array.from(new Set(depts.map((d) => (d === 'BOYS' || d === 'GIRLS' ? 'KIDS' : d))));
        where.department = { in: mapped };
      }
    }

    if (brand) {
      const brands = (brand as string).split(',').map((b) => b.trim()).filter(Boolean);
      if (brands.length === 1) {
        where.brand = { contains: brands[0] };
      } else if (brands.length > 1) {
        andClauses.push({
          OR: brands.map((b) => ({ brand: { contains: b } })),
        });
      }
    }

    if (category) {
      const cats = (category as string).split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);
      const categoryConditions = cats.flatMap((c) => [
        { category: { slug: { contains: c } } },
        { category: { name: { contains: c } } },
        { title: { contains: c } },
        { description: { contains: c } },
      ]);
      andClauses.push({ OR: categoryConditions });
    }

    if (discount) {
      where.discountPercent = { gte: parseInt(discount as string) };
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating as string) };
    }

    if (search) {
      const s = (search as string).trim();
      const searchConditions = [
        { title: { contains: s } },
        { brand: { contains: s } },
        { sku: { contains: s } },
        { description: { contains: s } },
        { upperMaterial: { contains: s } },
      ];
      andClauses.push({ OR: searchConditions });
    }

    if (andClauses.length > 0) {
      where.AND = andClauses;
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

// GET /api/products/facets (Brand counts, category counts, price ranges)
router.get('/facets', async (_req: Request, res: Response, next) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        brand: true,
        department: true,
        price: true,
        category: { select: { slug: true, name: true } },
      },
    });

    const brandMap: Record<string, number> = {};
    const catMap: Record<string, { slug: string; name: string; count: number }> = {};
    const deptMap: Record<string, number> = {};
    let minPrice = Infinity;
    let maxPrice = 0;

    for (const p of products) {
      brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
      deptMap[p.department] = (deptMap[p.department] || 0) + 1;
      if (p.category) {
        if (!catMap[p.category.slug]) {
          catMap[p.category.slug] = { slug: p.category.slug, name: p.category.name, count: 0 };
        }
        catMap[p.category.slug].count++;
      }
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    }

    const brands = Object.entries(brandMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const categories = Object.values(catMap).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: {
        brands,
        categories,
        departments: deptMap,
        priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
        totalProducts: products.length,
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
