import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Add customer review
router.post('/', authenticateToken, async (req: AuthRequest, res: Response, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title || !comment) {
      res.status(400).json({ success: false, message: 'Rating, title, and review comment are required.' });
      return;
    }

    const numRating = Math.min(5, Math.max(1, parseInt(rating) || 5));

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user!.id,
        userName: req.user!.name,
        rating: numRating,
        title,
        comment,
        verified: true,
      },
    });

    // Update product average rating and count
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
