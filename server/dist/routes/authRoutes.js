"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const prisma_js_1 = require("../prisma.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    phone: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Register
router.post('/register', async (req, res, next) => {
    try {
        const validated = registerSchema.parse(req.body);
        const existingUser = await prisma_js_1.prisma.user.findUnique({
            where: { email: validated.email.toLowerCase() },
        });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'An account with this email already exists.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(validated.password, 10);
        const user = await prisma_js_1.prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email.toLowerCase(),
                password: hashedPassword,
                phone: validated.phone,
                role: 'CUSTOMER',
            },
            select: { id: true, name: true, email: true, role: true, phone: true },
        });
        const token = (0, auth_js_1.generateToken)(user);
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            data: { user, token },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: error.errors[0].message });
            return;
        }
        next(error);
    }
});
// Login
router.post('/login', async (req, res, next) => {
    try {
        const validated = loginSchema.parse(req.body);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email: validated.email.toLowerCase() },
        });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(validated.password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }
        const userPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || undefined,
        };
        const token = (0, auth_js_1.generateToken)(userPayload);
        res.json({
            success: true,
            message: 'Logged in successfully!',
            data: { user: userPayload, token },
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ success: false, message: error.errors[0].message });
            return;
        }
        next(error);
    }
});
// Get Current User Profile
router.get('/me', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                addresses: true,
            },
        });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
// Update Profile
router.put('/profile', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const updated = await prisma_js_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name ? { name } : {}),
                ...(phone ? { phone } : {}),
            },
            select: { id: true, name: true, email: true, role: true, phone: true },
        });
        res.json({ success: true, message: 'Profile updated successfully', data: updated });
    }
    catch (error) {
        next(error);
    }
});
// Get User Addresses
router.get('/addresses', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const addresses = await prisma_js_1.prisma.address.findMany({
            where: { userId: req.user.id },
            orderBy: { isDefault: 'desc' },
        });
        res.json({ success: true, data: addresses });
    }
    catch (error) {
        next(error);
    }
});
// Create Address
router.post('/addresses', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const { fullName, phone, street, city, state, postalCode, country, isDefault, type } = req.body;
        if (!fullName || !phone || !street || !city || !state || !postalCode) {
            res.status(400).json({ success: false, message: 'All address fields are required.' });
            return;
        }
        if (isDefault) {
            await prisma_js_1.prisma.address.updateMany({
                where: { userId: req.user.id },
                data: { isDefault: false },
            });
        }
        const address = await prisma_js_1.prisma.address.create({
            data: {
                userId: req.user.id,
                fullName,
                phone,
                street,
                city,
                state,
                postalCode,
                country: country || 'India',
                isDefault: Boolean(isDefault),
                type: type || 'HOME',
            },
        });
        res.status(201).json({ success: true, message: 'Address added', data: address });
    }
    catch (error) {
        next(error);
    }
});
// Delete Address
router.delete('/addresses/:id', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        await prisma_js_1.prisma.address.deleteMany({
            where: { id: req.params.id, userId: req.user.id },
        });
        res.json({ success: true, message: 'Address removed' });
    }
    catch (error) {
        next(error);
    }
});
// Wishlist
router.get('/wishlist', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const wishlistItems = await prisma_js_1.prisma.wishlist.findMany({
            where: { userId: req.user.id },
            include: {
                product: {
                    include: {
                        variants: true,
                        media: true,
                    },
                },
            },
        });
        res.json({ success: true, data: wishlistItems.map((item) => item.product) });
    }
    catch (error) {
        next(error);
    }
});
router.post('/wishlist/toggle', auth_js_1.authenticateToken, async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ success: false, message: 'Product ID is required.' });
            return;
        }
        const existing = await prisma_js_1.prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.id,
                    productId,
                },
            },
        });
        if (existing) {
            await prisma_js_1.prisma.wishlist.delete({
                where: { id: existing.id },
            });
            res.json({ success: true, message: 'Removed from wishlist', inWishlist: false });
        }
        else {
            await prisma_js_1.prisma.wishlist.create({
                data: {
                    userId: req.user.id,
                    productId,
                },
            });
            res.json({ success: true, message: 'Added to wishlist', inWishlist: true });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
