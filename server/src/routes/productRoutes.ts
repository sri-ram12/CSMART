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

    // 1. Department Filtering
    if (department && department !== 'ALL') {
      const depts = (department as string).split(',').map((d) => d.trim().toUpperCase()).filter(Boolean);
      const isSlippersSandals = depts.includes('SLIPPERS_SANDALS');
      const standardDepts = depts.filter((d) => d !== 'SLIPPERS_SANDALS');

      if (isSlippersSandals && standardDepts.length === 0) {
        // User clicked "Slippers & Sandals" department: match any slipper, slide, sandal, or wedge
        andClauses.push({
          OR: [
            { category: { slug: { contains: 'slipper' } } },
            { category: { slug: { contains: 'sandal' } } },
            { category: { slug: { contains: 'wedge' } } },
            { title: { contains: 'Slipper' } },
            { title: { contains: 'Sandal' } },
            { title: { contains: 'Slide' } },
            { title: { contains: 'Wedge' } },
          ],
        });
      } else if (standardDepts.length > 0) {
        const mappedDepts = Array.from(
          new Set(
            standardDepts.map((d) => (d === 'BOYS' || d === 'GIRLS' ? 'KIDS' : d))
          )
        );
        if (mappedDepts.length === 1) {
          where.department = mappedDepts[0];
        } else {
          where.department = { in: mappedDepts };
        }
      }
    }

    // 2. Brand Filtering (Case-insensitive multi-brand OR support)
    if (brand) {
      const brands = (brand as string).split(',').map((b) => b.trim()).filter(Boolean);
      if (brands.length > 0) {
        andClauses.push({
          OR: brands.flatMap((b) => [
            { brand: { contains: b } },
            { brand: { contains: b.toLowerCase() } },
            { brand: { contains: b.toUpperCase() } },
            { brand: { contains: b.charAt(0).toUpperCase() + b.slice(1).toLowerCase() } },
          ]),
        });
      }
    }

    // 3. Strict Category Filtering (Precise categorical matching without cross-department pollution)
    if (category) {
      const rawCats = (category as string).split(',').map((c) => c.trim().toLowerCase()).filter(Boolean);
      
      const categoryConditions = rawCats.flatMap((term) => [
        { category: { slug: term } },
        { category: { slug: { contains: term } } },
        { category: { name: { contains: term } } },
      ]);

      if (categoryConditions.length > 0) {
        andClauses.push({ OR: categoryConditions });
      }
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

    // 4. Variant Properties Filtering (Size, Color, In-Stock)
    const variantWhere: any = {};

    if (size) {
      const sizeStr = (size as string).trim();
      const sizes = sizeStr.split(',').map((s) => s.trim()).filter(Boolean);
      const sizeVariants = sizes.flatMap((s) => {
        const rawDigits = s.replace(/^[^\d]*/, '').trim();
        return Array.from(
          new Set([
            s,
            `UK ${rawDigits}`,
            rawDigits,
            `UK ${s}`,
          ].filter(Boolean))
        );
      });
      variantWhere.size = { in: sizeVariants };
    }

    if (color) {
      const colors = (color as string).split(',').map((c) => c.trim()).filter(Boolean);
      if (colors.length === 1) {
        variantWhere.colorName = { contains: colors[0] };
      } else if (colors.length > 1) {
        variantWhere.OR = colors.map((c) => ({ colorName: { contains: c } }));
      }
    }

    if (inStock === 'true') {
      variantWhere.inventory = { gt: 0 };
    }

    if (Object.keys(variantWhere).length > 0) {
      where.variants = { some: variantWhere };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'discount_desc':
      case 'discount':
        orderBy = { discountPercent: 'desc' };
        break;
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

    const isFallback = false;
    const fallbackMessage = null;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: take,
          totalPages: Math.ceil(totalCount / take),
          isFallback,
          fallbackMessage,
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
