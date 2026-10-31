import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial promotional Video Ads...');

  const count = await prisma.videoAd.count();
  if (count > 0) {
    console.log(`Video ads already seeded (${count} ads exist).`);
    return;
  }

  const sampleAds = [
    {
      title: 'Walkaroo CloudStep Comfort Fest - 25% OFF',
      tagline: 'Ultra-lightweight walking footwear designed for all-day comfort',
      brand: 'Walkaroo',
      videoUrl: 'https://v1.pinimg.com/videos/mc/expMp4/ef/7e/62/ef7e6264480c3130998fb23372e40b87_t1.mp4',
      posterUrl: 'https://i.pinimg.com/736x/4b/47/61/4b47616d0e460266e69d57466228050b.jpg',
      offerText: 'FLAT 25% OFF FESTIVE DEAL',
      linkUrl: '/shop?brand=Walkaroo',
      ctaText: 'Enquire on WhatsApp',
      isActive: true,
      order: 1,
    },
    {
      title: 'Sparx High-Octane Athletic Stride',
      tagline: 'Engineered for speed, high-impact athletic performance & durability',
      brand: 'Sparx',
      videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/46/4b/74/464b748b0b8f698d60d9c423d27e7a18_720w.mp4',
      posterUrl: 'https://i.pinimg.com/736x/34/7b/22/347b22b79b43940703f90924820b4c07.jpg',
      offerText: 'BUY 1 GET SPECIAL DISCOUNT',
      linkUrl: '/shop?brand=Sparx',
      ctaText: 'Enquire on WhatsApp',
      isActive: true,
      order: 2,
    },
    {
      title: 'VKC Pride Royale PU Casual Collection',
      tagline: 'Long-life PU durability combined with classic executive styling',
      brand: 'VKC Pride',
      videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b4/17/45/b41745e2a05dcc91fc513a1bbc0c7729_720w.mp4',
      posterUrl: 'https://i.pinimg.com/736x/de/8e/23/de8e23545aeaacc357a06f463127d030.jpg',
      offerText: 'LIMITED EDITION ARRIVAL',
      linkUrl: '/shop?brand=VKC+Pride',
      ctaText: 'Enquire on WhatsApp',
      isActive: true,
      order: 3,
    },
    {
      title: 'Paragon Vertex All-Terrain Outdoor Sandal',
      tagline: 'Trusted skid-resistant grip for 50+ years of rugged Indian roads',
      brand: 'Paragon',
      videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b5/74/a8/b574a8ac276fdf349d7ce80ccec76960_720w.mp4',
      posterUrl: 'https://i.pinimg.com/736x/41/8a/f4/418af4b511557d392f0e701381e80adb.jpg',
      offerText: 'STORE SPECIAL ₹699 ONLY',
      linkUrl: '/shop?brand=Paragon',
      ctaText: 'Enquire on WhatsApp',
      isActive: true,
      order: 4,
    },
  ];

  for (const ad of sampleAds) {
    await prisma.videoAd.create({ data: ad });
  }

  console.log('Seeded 4 initial promotional Video Ads successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
