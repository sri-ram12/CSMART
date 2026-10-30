/**
 * Product-to-3D Model Realignment Migration Script
 * Ensures every catalog product has category-authentic 3D model geometry:
 * - Slippers / Slides -> /models/slipper.glb
 * - Sandals / Floaters -> /models/sandal.glb
 * - Formals / Oxfords -> /models/formal.glb
 * - Loafers -> /models/loafer.glb
 * - Boots -> /models/boot.glb
 * - Sneakers / Runners -> /models/shoe.glb
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function alignAllProducts() {
  console.log('🔄 Aligning all catalog products with authentic category 3D models...');

  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
  });

  let counts = {
    slipper: 0,
    sandal: 0,
    formal: 0,
    loafer: 0,
    boot: 0,
    sneaker: 0,
  };

  for (const product of products) {
    const combined = [
      product.category?.slug || '',
      product.category?.name || '',
      product.title || '',
      product.description || '',
      product.department || '',
    ]
      .join(' ')
      .toLowerCase();

    let modelType = 'sneaker';
    let modelUrl = '/models/shoe.glb';
    let defaultColor = '#DC2626';
    let accentColor = '#FFFFFF';
    let soleColor = '#F8FAFC';

    // 1. Slippers, Slides, Flip-Flops, Chappals
    if (
      combined.includes('slipper') ||
      combined.includes('slide') ||
      combined.includes('flip-flop') ||
      combined.includes('flip flop') ||
      combined.includes('flipflop') ||
      combined.includes('chappal') ||
      combined.includes('bahamas') ||
      combined.includes('flite') ||
      combined.includes('hawai')
    ) {
      modelType = 'slipper';
      modelUrl = '/models/slipper.glb';
      defaultColor = '#1E3A8A';
      accentColor = '#27272A';
      soleColor = '#18181B';
      counts.slipper++;
    }
    // 2. Sandals, Floaters, Strappy, Kolhapuri
    else if (
      combined.includes('sandal') ||
      combined.includes('floater') ||
      combined.includes('kolhapuri') ||
      combined.includes('strappy') ||
      combined.includes('ethnic-sandals') ||
      combined.includes('gladiator')
    ) {
      modelType = 'sandal';
      modelUrl = '/models/sandal.glb';
      defaultColor = '#18181B';
      accentColor = '#3F3F46';
      soleColor = '#18181B';
      counts.sandal++;
    }
    // 3. Formal Dress Shoes, Derby, Oxford, Brogue
    else if (
      combined.includes('formal') ||
      combined.includes('oxford') ||
      combined.includes('derby') ||
      combined.includes('brogue') ||
      combined.includes('dress shoe') ||
      combined.includes('monk')
    ) {
      modelType = 'formal';
      modelUrl = '/models/formal.glb';
      defaultColor = '#8B4513';
      accentColor = '#111827';
      soleColor = '#29180C';
      counts.formal++;
    }
    // 4. Loafers, Moccasins, Slip-ons
    else if (
      combined.includes('loafer') ||
      combined.includes('moccasin') ||
      combined.includes('boat shoe') ||
      combined.includes('penny')
    ) {
      modelType = 'loafer';
      modelUrl = '/models/loafer.glb';
      defaultColor = '#3E2723';
      accentColor = '#0F172A';
      soleColor = '#1C1917';
      counts.loafer++;
    }
    // 5. Boots, Outdoor, Trekker
    else if (
      combined.includes('boot') ||
      combined.includes('trekking') ||
      combined.includes('hiking') ||
      combined.includes('chelsea') ||
      combined.includes('combat')
    ) {
      modelType = 'boot';
      modelUrl = '/models/boot.glb';
      defaultColor = '#C19A6B';
      accentColor = '#3F2E22';
      soleColor = '#18181B';
      counts.boot++;
    }
    // 6. Running / Sneakers / Sports
    else {
      modelType = 'sneaker';
      modelUrl = '/models/shoe.glb';
      defaultColor = '#DC2626';
      accentColor = '#FFFFFF';
      soleColor = '#F8FAFC';
      counts.sneaker++;
    }

    // Pick first variant color if available
    if (product.variants && product.variants.length > 0 && product.variants[0].colorHex) {
      defaultColor = product.variants[0].colorHex;
    }

    const config = {
      modelType,
      modelUrl,
      format: 'glb',
      status: 'ready',
      defaultColor,
      accentColor,
      soleColor,
      roughness: modelType === 'formal' ? 0.3 : 0.55,
      metalness: modelType === 'formal' ? 0.18 : 0.1,
      variants: product.variants.map((v) => ({
        colorName: v.colorName,
        colorHex: v.colorHex,
        size: v.size,
      })),
    };

    await prisma.product.update({
      where: { id: product.id },
      data: {
        has3D: true,
        model3DConfig: JSON.stringify(config),
      },
    });
  }

  console.log('\n📊 Model Assignment Summary Across All Products:');
  console.log(`🩴 Slippers / Slides: ${counts.slipper} products -> /models/slipper.glb`);
  console.log(`👡 Sandals / Floaters: ${counts.sandal} products -> /models/sandal.glb`);
  console.log(`👞 Formals / Oxfords: ${counts.formal} products -> /models/formal.glb`);
  console.log(`👞 Loafers: ${counts.loafer} products -> /models/loafer.glb`);
  console.log(`🥾 Boots: ${counts.boot} products -> /models/boot.glb`);
  console.log(`👟 Sneakers / Runners: ${counts.sneaker} products -> /models/shoe.glb`);
  console.log(`\n✅ All ${products.length} products updated successfully!`);

  await prisma.$disconnect();
}

alignAllProducts().catch((err) => {
  console.error('Alignment failed:', err);
  process.exit(1);
});
