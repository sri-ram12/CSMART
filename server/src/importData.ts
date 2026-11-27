import { prisma } from './prisma.js';
import fs from 'fs';
import path from 'path';

async function importAll() {
  const jsonPath = path.resolve(process.cwd(), 'server/prisma/data_export.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Export file not found at:', jsonPath);
    process.exit(1);
  }

  console.log('📦 Reading export data from:', jsonPath);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log('🚀 Starting import into Turso Database...');

  // 1. Store Settings
  if (data.storeSettings?.length) {
    console.log(`Inserting ${data.storeSettings.length} StoreSettings...`);
    for (const item of data.storeSettings) {
      await prisma.storeSettings.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  // 2. Users
  if (data.users?.length) {
    console.log(`Inserting ${data.users.length} Users...`);
    for (const item of data.users) {
      await prisma.user.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  // 3. Addresses
  if (data.addresses?.length) {
    console.log(`Inserting ${data.addresses.length} Addresses...`);
    for (const item of data.addresses) {
      await prisma.address.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  // 4. Categories
  if (data.categories?.length) {
    console.log(`Inserting ${data.categories.length} Categories...`);
    for (const item of data.categories) {
      await prisma.category.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    }
  }

  // 5. Products (sequential upsert to maintain referential integrity)
  if (data.products?.length) {
    console.log(`Inserting ${data.products.length} Products...`);
    for (const p of data.products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: p,
        create: p,
      });
    }
  }

  // 6. Product Variants (in chunks of 250)
  if (data.productVariants?.length) {
    console.log(`Inserting ${data.productVariants.length} Product Variants...`);
    const chunkSize = 250;
    for (let i = 0; i < data.productVariants.length; i += chunkSize) {
      const chunk = data.productVariants.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map((v: any) =>
          prisma.productVariant.upsert({
            where: { id: v.id },
            update: v,
            create: v,
          })
        )
      );
      if ((i + chunkSize) % 1000 === 0 || i + chunkSize >= data.productVariants.length) {
        console.log(`  Variants progress: ${Math.min(i + chunkSize, data.productVariants.length)} / ${data.productVariants.length}`);
      }
    }
  }

  // 7. Product Media (in chunks of 200)
  if (data.productMedia?.length) {
    console.log(`Inserting ${data.productMedia.length} Product Media...`);
    const chunkSize = 200;
    for (let i = 0; i < data.productMedia.length; i += chunkSize) {
      const chunk = data.productMedia.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map((m: any) =>
          prisma.productMedia.upsert({
            where: { id: m.id },
            update: m,
            create: m,
          })
        )
      );
      if ((i + chunkSize) % 500 === 0 || i + chunkSize >= data.productMedia.length) {
        console.log(`  Media progress: ${Math.min(i + chunkSize, data.productMedia.length)} / ${data.productMedia.length}`);
      }
    }
  }

  // 8. Reviews
  if (data.reviews?.length) {
    console.log(`Inserting ${data.reviews.length} Reviews...`);
    for (const r of data.reviews) {
      await prisma.review.upsert({
        where: { id: r.id },
        update: r,
        create: r,
      });
    }
  }

  // 9. Coupons
  if (data.coupons?.length) {
    console.log(`Inserting ${data.coupons.length} Coupons...`);
    for (const c of data.coupons) {
      await prisma.coupon.upsert({
        where: { id: c.id },
        update: c,
        create: c,
      });
    }
  }

  // 10. Banners
  if (data.banners?.length) {
    console.log(`Inserting ${data.banners.length} Banners...`);
    for (const b of data.banners) {
      await prisma.banner.upsert({
        where: { id: b.id },
        update: b,
        create: b,
      });
    }
  }

  // 11. Video Ads
  if (data.videoAds?.length) {
    console.log(`Inserting ${data.videoAds.length} Video Ads...`);
    for (const v of data.videoAds) {
      await prisma.videoAd.upsert({
        where: { id: v.id },
        update: v,
        create: v,
      });
    }
  }

  // 12. WhatsApp Enquiries
  if (data.whatsAppEnquiries?.length) {
    console.log(`Inserting ${data.whatsAppEnquiries.length} WhatsApp Enquiries...`);
    for (const w of data.whatsAppEnquiries) {
      await prisma.whatsAppEnquiry.upsert({
        where: { id: w.id },
        update: w,
        create: w,
      });
    }
  }

  console.log('✅ All data successfully imported into Supabase PostgreSQL!');
  process.exit(0);
}

importAll().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
