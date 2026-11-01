import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import pincodeRoutes from './routes/pincodeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { prisma } from './prisma.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Allows 3D WebGL textures and CDN assets
  })
);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and Vite dev server
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers (allows direct video uploads from device gallery)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static uploads directory for product images, banners, and video ads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const videosDir = path.resolve(uploadsDir, 'videos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Rate limiter for general APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    brand: 'CHANDHANA SHOE MART',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Production static asset serving for Render / single-service deployment
const clientDistCandidates = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(currentDir, '../../client/dist'),
  path.resolve(currentDir, '../client/dist'),
];
const clientDistPath = clientDistCandidates.find((candidate) => fs.existsSync(candidate));

if (clientDistPath) {
  console.log(`📦 Serving static client build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Dynamic OpenGraph / WhatsApp Product Preview Card Generator
  app.get('/product/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const indexPath = path.join(clientDistPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return next();
      }

      const product = await prisma.product.findUnique({
        where: { slug },
        include: { media: { orderBy: { order: 'asc' } }, variants: true },
      });

      if (!product) {
        return res.sendFile(indexPath);
      }

      let html = fs.readFileSync(indexPath, 'utf-8');

      // Best image selection
      const rawImage =
        product.media?.[0]?.url ||
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
    } catch (err) {
      console.warn('OpenGraph preview injection skipped:', err);
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });

  // SPA fallback for storefront routes (excluding /api and static asset files)
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/assets') ||
      Boolean(path.extname(req.path))
    ) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for undefined API Endpoints
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

// Central Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
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

export default app;
