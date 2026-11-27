"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.requireAdmin = exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../prisma.js");
const JWT_SECRET = process.env.JWT_SECRET || 'chandhana_shoe_mart_super_secure_jwt_secret_key_2026';
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        // In dev mode, gracefully authenticate with the default Admin user for seamless administrative access
        if (process.env.NODE_ENV !== 'production') {
            try {
                const devAdmin = await prisma_js_1.prisma.user.findFirst({ where: { role: 'ADMIN' } });
                if (devAdmin) {
                    req.user = {
                        id: devAdmin.id,
                        email: devAdmin.email,
                        role: devAdmin.role,
                        name: devAdmin.name,
                        phone: devAdmin.phone,
                    };
                    return next();
                }
            }
            catch (err) {
                console.error('Dev admin fallback error:', err);
            }
        }
        res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, name: true },
        });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid token: User no longer exists.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, name: true },
        });
        if (user) {
            req.user = user;
        }
    }
    catch {
        // Ignore invalid optional tokens
    }
    next();
};
exports.optionalAuth = optionalAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        if (process.env.NODE_ENV !== 'production') {
            return next();
        }
        res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
