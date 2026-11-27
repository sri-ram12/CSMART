"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const categoryRoutes_js_1 = __importDefault(require("./routes/categoryRoutes.js"));
const checkoutRoutes_js_1 = __importDefault(require("./routes/checkoutRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
const pincodeRoutes_js_1 = __importDefault(require("./routes/pincodeRoutes.js"));
const reviewRoutes_js_1 = __importDefault(require("./routes/reviewRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const settingsRoutes_js_1 = __importDefault(require("./routes/settingsRoutes.js"));
const prisma_js_1 = require("./prisma.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
dotenv_1.default.config();
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
// Security Headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Allows 3D WebGL textures and CDN assets
}));
// CORS
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow localhost and Vite dev server
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
}));
// Logging
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.use((0, morgan_1.default)('dev'));
}
// Body parsers (allows direct video uploads from device gallery)
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '100mb' }));
// Static uploads directory for product images, banners, and video ads
const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
const videosDir = path_1.default.resolve(uploadsDir, 'videos');
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs_1.default.existsSync(videosDir)) {
        fs_1.default.mkdirSync(videosDir, { recursive: true });
    }
}
catch (err) {
    // Read-only filesystem in serverless environments (e.g. Vercel)
}
app.use('/uploads', express_1.default.static(uploadsDir));
// Rate limiter for general APIs
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);
// Health Check (responds on both /api/health and /health)
const healthHandler = async (_req, res) => {
    let dbStatus = 'connecting';
    let productCount = 0;
    let dbError = null;
    try {
        productCount = await prisma_js_1.prisma.product.count();
        dbStatus = 'connected';
    }
    catch (err) {
        dbStatus = 'error';
        dbError = err.message || String(err);
    }
    res.json({
        status: dbStatus === 'connected' ? 'healthy' : 'degraded',
        brand: 'CHANDHANA SHOE MART',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        database: {
            status: dbStatus,
            products: productCount,
            target: process.env.TURSO_DATABASE_URL ? 'turso-libsql' : 'turso-cloud',
            error: dbError,
        },
    });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
// Mount Routes (supports both /api/* and /* for compatibility with Vercel service rewrites)
const apiRoutes = [
    ['/auth', authRoutes_js_1.default],
    ['/products', productRoutes_js_1.default],
    ['/categories', categoryRoutes_js_1.default],
    ['/checkout', checkoutRoutes_js_1.default],
    ['/orders', orderRoutes_js_1.default],
    ['/payment', paymentRoutes_js_1.default],
    ['/pincode', pincodeRoutes_js_1.default],
    ['/reviews', reviewRoutes_js_1.default],
    ['/admin', adminRoutes_js_1.default],
    ['/settings', settingsRoutes_js_1.default],
];
for (const [prefix, router] of apiRoutes) {
    app.use(`/api${prefix}`, router);
    app.use(prefix, router);
}
// Production static asset serving for Render / single-service deployment
const clientDistCandidates = [
    path_1.default.resolve(process.cwd(), 'client/dist'),
    path_1.default.resolve(process.cwd(), '../client/dist'),
    path_1.default.resolve(currentDir, '../../client/dist'),
    path_1.default.resolve(currentDir, '../client/dist'),
];
const clientDistPath = clientDistCandidates.find((candidate) => fs_1.default.existsSync(candidate));
if (clientDistPath) {
    console.log(`📦 Serving static client build from: ${clientDistPath}`);
    app.use(express_1.default.static(clientDistPath));
    // Dynamic OpenGraph / WhatsApp Product Preview Card Generator
    app.get('/product/:slug', async (req, res, next) => {
        try {
            const { slug } = req.params;
            const indexPath = path_1.default.join(clientDistPath, 'index.html');
            if (!fs_1.default.existsSync(indexPath)) {
                return next();
            }
            const product = await prisma_js_1.prisma.product.findUnique({
                where: { slug },
                include: { media: { orderBy: { order: 'asc' } }, variants: true },
            });
            if (!product) {
                return res.sendFile(indexPath);
            }
            let html = fs_1.default.readFileSync(indexPath, 'utf-8');
            // Best image selection
            const rawImage = product.media?.[0]?.url ||
                product.variants?.[0]?.imageUrl ||
                '/csm_original_logo.png';
            // Always use canonical production domain for external scrapers
            const host = req.get('x-forwarded-host') || req.get('host') || 'www.chandhanashoemart.com';
            const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
            const origin = isLocal ? `http://${host}` : 'https://www.chandhanashoemart.com';
            const absoluteImageUrl = rawImage.startsWith('http')
                ? rawImage
                : `${origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
            const canonicalUrl = `${origin}/product/${product.slug}`;
            const titleText = `${product.title} (₹${product.price.toLocaleString('en-IN')}) | Chandhana Shoe Mart`;
            const descText = product.description
                ? product.description.replace(/[\r\n]+/g, ' ').slice(0, 200)
                : `Check out ${product.title} at Chandhana Shoe Mart, Tagarapuvalasa. 100% genuine footwear at best prices.`;
            const safeTitle = titleText.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeDesc = descText.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const safeImage = absoluteImageUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
            const safeUrl = canonicalUrl.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
            const ogMeta = `
    <!-- Dynamic WhatsApp & Social Preview Tags for ${safeTitle} -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Chandhana Shoe Mart" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="800" />
    <meta property="product:price:amount" content="${product.price}" />
    <meta property="product:price:currency" content="INR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
`;
            html = html.replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`);
            html = html.replace('</head>', `${ogMeta}\n  </head>`);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
        }
        catch (err) {
            console.warn('OpenGraph preview injection skipped:', err);
            return res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
        }
    });
    // SPA fallback for storefront routes (excluding /api and static asset files)
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') ||
            req.path.startsWith('/uploads') ||
            req.path.startsWith('/assets') ||
            Boolean(path_1.default.extname(req.path))) {
            return next();
        }
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
// 404 Handler for undefined API Endpoints
app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});
// Central Error Handler
app.use(errorHandler_js_1.errorHandler);
// Self-healing brand spelling normalization (Coasters, Hillson, Jaguar)
async function normalizeBrandSpellings() {
    try {
        const brandFixes = [
            { from: 'Poster Shoes', to: 'Coasters', regex: /Poster Shoes|Poster/g },
            { from: 'Hison', to: 'Hillson', regex: /Hison/g },
            { from: 'Zaguaar', to: 'Jaguar', regex: /Zaguaar/g },
        ];
        for (const b of brandFixes) {
            const items = await prisma_js_1.prisma.product.findMany({
                where: { OR: [{ brand: b.from }, { title: { contains: b.from } }] },
            });
            for (const p of items) {
                await prisma_js_1.prisma.product.update({
                    where: { id: p.id },
                    data: {
                        brand: b.to,
                        title: p.title.replace(b.regex, b.to),
                        description: p.description ? p.description.replace(b.regex, b.to) : p.description,
                    },
                });
            }
        }
    }
    catch (err) {
        console.warn('Brand normalization skipped:', err);
    }
}
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        normalizeBrandSpellings();
        console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              CHANDHANA SHOE MART - BACKEND API                   ║
║  🌐 Server running on http://localhost:${PORT}                    ║
║  👟 Connected to Database with full footwear catalog             ║
║  🛡️  Auth, Orders, Admin, 3D Models & Razorpay ready             ║
╚══════════════════════════════════════════════════════════════════╝
    `);
    });
}
// CommonJS export compatibility for Vercel Express runtime
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
    module.exports.default = app;
}
exports.default = app;
