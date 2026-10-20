# CHANDHANA SHOE MART | Full-Stack Footwear E-Commerce Platform

A production-oriented footwear shopping experience featuring real-time interactive **3D WebGL shoe inspection** (Three.js / React Three Fiber / Drei), cinematic product videos, dedicated slippers & sandals department, authenticated customer accounts, live Indian PIN-code delivery checks, cart & coupon calculations, transaction-safe inventory deduction, Razorpay & Cash on Delivery (COD) payment flow, order tracking, and a comprehensive admin console.

---

## 👟 Architecture & Technology Stack

- **Frontend (`client/`)**:
  - React 18 + TypeScript + Vite
  - Tailwind CSS with custom charcoal, dark, and gold theme (`#D4AF37`, `#0B0F17`, `#121824`)
  - Three.js + `@react-three/fiber` + `@react-three/drei` for real-time 3D WebGL footwear models
  - Lucide React iconography
  - React Router DOM v6
  - Context API for Auth, Cart (localStorage persisted + server validation), and Wishlist
  - `canvas-confetti` for order confirmation celebrations

- **Backend (`server/`)**:
  - Node.js + Express + TypeScript
  - Prisma ORM
  - RESTful API with structured responses (`{ success: true, data: ..., message: ... }`)
  - JWT Authentication + bcryptjs password hashing
  - Zod request validation
  - Helmet security headers, CORS origin protection, Express rate limiting
  - Official Razorpay SDK integration with HMAC SHA256 signature verification & sandbox dev mode

- **Database**:
  - Prisma Schema with User, Address, Category, Product, ProductVariant, ProductMedia, Wishlist, Order, OrderItem, Review, Coupon, and StoreSettings models.
  - Transaction-safe inventory deductions with automatic stock restoration upon cancellation.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.0.0 (Tested on Node v22.14.0)
- npm >= 9.0.0

### 2. Installation & Setup
Run the setup command from the repository root to install all dependencies and seed the database:

```bash
# 1. Install root, server, and client dependencies
npm run install:all

# 2. Synchronize database tables & push schema
npm run db:push

# 3. Seed database with 20+ realistic shoes, slippers, 3D models & reviews
npm run db:seed
```

### 3. Launch Development Servers
To start both the Express backend API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

Alternatively, run them in separate terminals:
```bash
# Backend server (port 5000)
npm run dev:server

# Frontend client (port 5173)
npm run dev:client
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Store Administrator** | `admin@chandhanashoemart.com` | `Admin@12345` | Full Admin Console (`/admin`), product CRUD, stock adjustment, order workflow |
| **Verified Customer** | `rahul.sharma@example.com` | `Customer@12345` | Profile, addresses, order history, reviews |

> *Note: The login screen also includes convenient **1-Click Demo Login** buttons for instant testing.*

---

## 🎟️ Active Demo Coupons

- `WELCOME10`: 10% discount on orders (min order ₹999)
- `STEPINSTYLE`: ₹500 flat discount on orders over ₹2,499
- `FESTIVE20`: 20% discount up to ₹1,000 on orders over ₹1,999

---

## 📦 Key Storefront Features

1. **Cinematic Hero & 3D WebGL Turntable**:
   - Realistic footwear geometry: upper mesh, molded cushioning midsole, high-abrasion traction lugs, dynamic laces, and lateral CSM gold crest.
   - 360° mouse/touch rotation, zoom, pan, and auto-rotate turntable.
   - Camera angle presets: `3/4 View`, `Profile`, `Sole Tread`, `Top Down`, `Heel Stabilizer`.
   - Live colorway switcher: change material colors in real-time (`Crimson Flame`, `Midnight Navy`, `Onyx Stealth`, `Arctic White`, `Forest Emerald`).
   - Wireframe texture inspection mode.

2. **Dedicated Slippers & Sandals Department (`/slippers`)**:
   - Spotlight on CloudStep 45mm platform bio-EVA slides, memory foam indoor clogs, all-terrain sandals, and anti-slip bathroom footwear.
   - Thickness, featherweight (120g), zero-slip tile grip, and arch support indicators.

3. **Product Demonstration Video Showcase**:
   - Playable footwear reels demonstrating sole flexibility, energy return, and water repellency with play/pause and sound controls.

4. **Interactive PIN-Code Delivery Estimator**:
   - Validates 6-digit Indian PIN codes and computes realistic transit timelines (e.g. 1-2 days for Bengaluru/Karnataka, 2-3 days for Mumbai/Delhi, Pan-India COD availability).

5. **Slide-Over Cart & Multi-Step Checkout**:
   - Free shipping progress bar (threshold: ₹999).
   - Quantity adjustments with live variant inventory enforcement.
   - Instant coupon discount calculation.
   - Razorpay payment gateway integration with HMAC verification + Cash on Delivery (COD).

6. **Live Shipment Tracking (`/orders/:orderNumber`)**:
   - 7-Stage visual timeline: `Placed` → `Confirmed` → `Processing` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`.
   - Courier partner and tracking AWB number display.
   - Real cancellation (with instant database inventory rollback) and 7-day return request workflows.

7. **Protected Admin Console (`/admin`)**:
   - Revenue analytics, low-stock warnings, catalog management, and order status progression.

---

## 🧪 Testing

Run backend automated integration tests:
```bash
cd server
npm test
```
All integration tests cover health checks, product filtering, category counts, PIN code checks, JWT authentication, coupon calculations, and transaction-safe order generation.

---

## 🌐 Production Deployment

- **Frontend**: Build the production bundle with `npm run build --prefix client`. The output in `client/dist` can be hosted on Vercel, Netlify, AWS S3 + CloudFront, or served as static assets from Express.
- **Backend**: Build with `npm run build --prefix server`. Run `npm run start --prefix server` behind a reverse proxy (e.g. Nginx or Cloudflare) with HTTPS enabled.
- **Database**: In `server/prisma/schema.prisma`, switch `provider = "postgresql"` and configure `DATABASE_URL` with your managed PostgreSQL instance URL (e.g. Supabase, Neon, AWS RDS).
