"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../prisma.js");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'csmart-super-secret-jwt-key-2025';
function getUserFromToken(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return { id: decoded.userId || decoded.id, name: decoded.name || 'Verified Customer' };
    }
    catch {
        return null;
    }
}
// 1. POST /api/reviews - Add customer rating & review (Accessible by PUBLIC & logged-in users)
router.post('/', async (req, res, next) => {
    try {
        const { productId, rating, title, comment, userName } = req.body;
        if (!productId || !rating || !title || !comment) {
            res.status(400).json({ success: false, message: 'Rating, title, and review comment are required.' });
            return;
        }
        const numRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
        const tokenUser = getUserFromToken(req);
        const authorName = tokenUser?.name || (userName && String(userName).trim()) || 'Verified Customer';
        const authorId = tokenUser?.id || null;
        const review = await prisma_js_1.prisma.review.create({
            data: {
                productId,
                userId: authorId,
                userName: authorName,
                rating: numRating,
                title: title.trim(),
                comment: comment.trim(),
                verified: true,
            },
        });
        // Update product average rating and count
        const allReviews = await prisma_js_1.prisma.review.findMany({
            where: { productId },
            select: { rating: true },
        });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await prisma_js_1.prisma.product.update({
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
    }
    catch (error) {
        next(error);
    }
});
// 2. GET /api/reviews - List all reviews across the catalog for admin panel
router.get('/', async (_req, res, next) => {
    try {
        const reviews = await prisma_js_1.prisma.review.findMany({
            include: {
                product: { select: { id: true, title: true, sku: true, brand: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: reviews });
    }
    catch (error) {
        next(error);
    }
});
// 3. DELETE /api/reviews/:id - Remove review by ID (Admin control)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await prisma_js_1.prisma.review.findUnique({
            where: { id },
            select: { productId: true },
        });
        if (!existing) {
            res.status(404).json({ success: false, message: 'Review not found.' });
            return;
        }
        await prisma_js_1.prisma.review.delete({ where: { id } });
        // Re-aggregate product rating & count
        const remaining = await prisma_js_1.prisma.review.findMany({
            where: { productId: existing.productId },
            select: { rating: true },
        });
        const avgRating = remaining.length > 0
            ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
            : 4.8;
        await prisma_js_1.prisma.product.update({
            where: { id: existing.productId },
            data: {
                rating: parseFloat(avgRating.toFixed(1)),
                reviewCount: remaining.length,
            },
        });
        res.json({
            success: true,
            message: 'Review removed successfully.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
