import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { catalogProducts } from './catalogProducts.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CHANDHANA SHOE MART database seeding (200+ Products & 3D Models)...');

  const isForce = process.argv.includes('--force');
  const existingCount = await prisma.product.count();

  if (existingCount >= 150 && !isForce) {
    console.log(`✅ Database already seeded with ${existingCount} products. Skipping wipe (pass --force to reseed).`);
    return;
  }

  // Clean existing data in reverse order of relationships
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.productMedia.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.storeSettings.deleteMany({});

  console.log('🧹 Existing data wiped.');

  // 1. Store Settings
  await prisma.storeSettings.create({
    data: {
      id: 'store-default',
      shopName: 'Chandhana Shoe Mart',
      tagline: 'Step Into Style with Chandhana Shoe Mart',
      phone: '+91 98450 12345',
      email: 'support@chandhanashoemart.com',
      address: 'No. 42, Commercial Street, Shivaji Nagar, Bengaluru, Karnataka 560001',
      whatsapp: '+91 98450 12345',
      freeShippingThreshold: 999,
      standardShippingFee: 99,
      announcement: '✨ Grand Season Launch: Flat 10% off with code WELCOME10 | Free express shipping on orders over ₹999!',
    },
  });

  // 2. Users
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const customerPassword = await bcrypt.hash('Customer@12345', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin CSM',
      email: 'admin@chandhanashoemart.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 98450 12345',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+91 99887 66554',
      addresses: {
        create: [
          {
            fullName: 'Rahul Sharma',
            phone: '+91 99887 66554',
            street: 'Flat 402, Green Glen Layout, Bellandur',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            isDefault: true,
            type: 'HOME',
          },
          {
            fullName: 'Rahul Sharma (Office)',
            phone: '+91 99887 66554',
            street: 'RMZ Ecoworld, Building 30B, Outer Ring Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            isDefault: false,
            type: 'WORK',
          },
        ],
      },
    },
  });

  console.log('👤 Users seeded (Admin & Customer).');

  // 3. Categories Data (18 Distinct Footwear Categories)
  const categoriesData = [
    // Men's
    {
      name: "Men's Running Shoes",
      slug: 'mens-running-shoes',
      department: 'MEN',
      description: 'Engineered for maximum energy return, breathable mesh, and shock-absorbing nitrogen foam soles.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 1,
    },
    {
      name: "Men's Sneakers",
      slug: 'mens-sneakers',
      department: 'MEN',
      description: 'Iconic street style sneakers combining suede, breathable leather, and cushioned midsoles.',
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 2,
    },
    {
      name: "Men's Formal Shoes",
      slug: 'mens-formal-shoes',
      department: 'MEN',
      description: 'Handcrafted genuine leather Oxford and Derby shoes for boardroom sophistication.',
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 3,
    },
    {
      name: "Men's Casual & Loafers",
      slug: 'mens-casual-loafers',
      department: 'MEN',
      description: 'Luxurious slip-on comfort with supple lining and versatile aesthetics.',
      imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 4,
    },
    {
      name: "Men's Boots & Outdoor",
      slug: 'mens-boots-outdoor',
      department: 'MEN',
      description: 'Waterproof all-terrain mountain boots and pull-on Chelsea boots built for rugged terrains.',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 5,
    },
    {
      name: "Men's Ethnic & Sandals",
      slug: 'mens-ethnic-sandals',
      department: 'MEN',
      description: 'Traditional handcrafted Kolhapuri chappals and modern athletic river sandals for Indian climates.',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 6,
    },
    // Women's
    {
      name: "Women's Running & Trainers",
      slug: 'womens-running-trainers',
      department: 'WOMEN',
      description: 'Responsive athletic footwear designed for agile road running and gym workouts.',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 7,
    },
    {
      name: "Women's Casual & Sneakers",
      slug: 'womens-casual-sneakers',
      department: 'WOMEN',
      description: 'Chic, lightweight, and cushioned platform sneakers tailored for daily elegance.',
      imageUrl: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 8,
    },
    {
      name: "Women's Flats & Loafers",
      slug: 'womens-flats-loafers',
      department: 'WOMEN',
      description: 'Effortless pointed-toe ballerinas and horsebit leather loafers with padded memory insoles.',
      imageUrl: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 9,
    },
    {
      name: "Women's Heels & Pumps",
      slug: 'womens-heels-pumps',
      department: 'WOMEN',
      description: 'Block heels, stilettos, and pumps engineered for all-day posture balance and party glamour.',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 10,
    },
    {
      name: "Women's Sandals & Wedges",
      slug: 'sandals-wedges',
      department: 'WOMEN',
      description: 'Braided jute wedges, strappy Roman gladiators, and breezy summer platforms.',
      imageUrl: 'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 11,
    },
    {
      name: "Women's Ethnic & Kolhapuri",
      slug: 'kolhapuri-ethnic',
      department: 'WOMEN',
      description: 'Traditional zari-embroidered juttis and artisan-crafted gold Kolhapuri chappals.',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 12,
    },
    // Dedicated Slippers & Sandals Department
    {
      name: 'Memory-Foam & Comfort Slippers',
      slug: 'memory-foam-slippers',
      department: 'SLIPPERS_SANDALS',
      description: 'Plush cloud-step cushioning designed to relieve foot pressure and fatigue.',
      imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 13,
    },
    {
      name: 'EVA Slides & Flip-Flops',
      slug: 'eva-slides-flip-flops',
      department: 'SLIPPERS_SANDALS',
      description: 'Ultralight waterproof molded EVA slides for poolside, casual strolls, and bathroom safety.',
      imageUrl: 'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 14,
    },
    {
      name: 'Adjustable Strap Sandals',
      slug: 'adjustable-strap-sandals',
      department: 'SLIPPERS_SANDALS',
      description: 'Ergonomic sandals with arch contouring and durable multi-surface rubber outsoles.',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 15,
    },
    // Kids
    {
      name: "Kids' School Shoes",
      slug: 'kids-school-shoes',
      department: 'KIDS',
      description: 'Durable, scuff-resistant uniform shoes with easy Velcro fastenings and non-slip grip.',
      imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
      featured: true,
      order: 16,
    },
    {
      name: "Kids' Casual Sneakers",
      slug: 'kids-casual-sneakers',
      department: 'KIDS',
      description: 'Vibrant, flexible sneakers engineered for active playgrounds and growing feet.',
      imageUrl: 'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 17,
    },
    {
      name: "Kids' Sandals",
      slug: 'kids-sandals',
      department: 'KIDS',
      description: 'Waterproof summer sandals with protective toe bumpers for outdoor play.',
      imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
      featured: false,
      order: 18,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`📁 ${categoriesData.length} Categories seeded.`);

  // 4. Products Data (200+ Complete Products with 3D model support)
  const products = catalogProducts;

  let seededCount = 0;
  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for slug: ${p.categorySlug}`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        sku: p.sku,
        categoryId: categoryId,
        department: p.department,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        description: p.description,
        details: p.details,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        has3D: p.has3D,
        model3DConfig: p.model3DConfig,
        upperMaterial: p.upperMaterial,
        soleMaterial: p.soleMaterial,
        insoleMaterial: p.insoleMaterial,
        cushioning: p.cushioning,
        closureType: p.closureType,
        heelHeight: p.heelHeight,
        weight: p.weight,
        gripType: p.gripType,
        careInstructions: p.careInstructions,
        warranty: p.warranty,
        media: {
          create: p.media.map((url, idx) => ({
            url,
            type: 'IMAGE',
            alt: `${p.title} view ${idx + 1}`,
            order: idx,
          })),
        },
        variants: {
          create: p.variants.map((v, idx) => ({
            sku: `${p.sku}-${v.colorName.substring(0, 3).toUpperCase()}-${v.size.replace(/\s+/g, '')}-${idx}`,
            colorName: v.colorName,
            colorHex: v.colorHex,
            size: v.size,
            inventory: v.inventory,
            priceAdjustment: 0,
            imageUrl: p.media[0],
          })),
        },
      },
    });

    // Sample review for authenticity
    if (seededCount < 30 || seededCount % 5 === 0) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: customer.id,
          userName: 'Rahul Sharma',
          rating: 5,
          title: 'Outstanding quality and comfort!',
          comment: `I have been wearing the ${p.title} for the past two weeks. Cushioning and build quality exceed expectations. Definitely worth the price!`,
          verified: true,
        },
      });

      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userId: admin.id,
          userName: 'Priya Sundaram',
          rating: 5,
          title: 'True to size and very premium.',
          comment: `Ordered my standard Indian size and it fits like a glove. Received express delivery within 48 hours to Bengaluru. Highly recommend Chandhana Shoe Mart!`,
          verified: true,
        },
      });
    }

    seededCount++;
    if (seededCount % 25 === 0) {
      console.log(`⏳ Seeded ${seededCount}/${products.length} products with 3D models...`);
    }
  }

  console.log(`👟 ${seededCount} Products and their 3D models seeded successfully.`);

  // 5. Promotional Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        value: 10,
        minOrderValue: 999,
        isActive: true,
      },
      {
        code: 'STEPINSTYLE',
        discountType: 'FIXED',
        value: 500,
        minOrderValue: 2499,
        isActive: true,
      },
      {
        code: 'CHANDHANA50',
        discountType: 'FIXED',
        value: 200,
        minOrderValue: 1499,
        isActive: true,
      },
      {
        code: 'FESTIVE20',
        discountType: 'PERCENTAGE',
        value: 20,
        minOrderValue: 1999,
        maxDiscount: 1000,
        isActive: true,
      },
    ],
  });

  console.log('🏷️ Promotional coupons seeded.');

  // 6. Sample Initial Order
  const firstProduct = await prisma.product.findFirst({
    where: { has3D: true },
    include: { variants: true, media: true },
  });

  if (firstProduct && firstProduct.variants.length > 0) {
    const variant = firstProduct.variants[0];
    await prisma.order.create({
      data: {
        orderNumber: 'CSM-2026-9842',
        userId: customer.id,
        status: 'SHIPPED',
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PAID',
        paymentId: 'pay_demo_rzp_892174',
        subtotal: firstProduct.price,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: firstProduct.price,
        shippingAddress: JSON.stringify({
          fullName: 'Rahul Sharma',
          phone: '+91 99887 66554',
          street: 'Flat 402, Green Glen Layout, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
        }),
        trackingNumber: 'CSM-EXP-BLR-883921',
        courierName: 'Delhivery Express',
        estimatedDelivery: 'Tomorrow, by 6:00 PM',
        items: {
          create: [
            {
              productId: firstProduct.id,
              variantId: variant.id,
              productTitle: firstProduct.title,
              sku: variant.sku,
              colorName: variant.colorName,
              size: variant.size,
              unitPrice: firstProduct.price,
              quantity: 1,
              totalPrice: firstProduct.price,
              imageUrl: firstProduct.media?.[0]?.url || '',
            },
          ],
        },
      },
    });
    console.log('📦 Sample customer order created.');
  }

  console.log('✅ CHANDHANA SHOE MART database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
