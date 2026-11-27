"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const router = (0, express_1.Router)();
// GET all categories with product counts
router.get('/', async (_req, res, next) => {
    try {
        const categories = await prisma_js_1.prisma.category.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
// GET category by slug
router.get('/:slug', async (req, res, next) => {
    try {
        const category = await prisma_js_1.prisma.category.findUnique({
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
