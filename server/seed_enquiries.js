const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.whatsAppEnquiry.count();
  if (count === 0) {
    console.log('Seeding initial WhatsApp customer enquiries...');
    const samples = [
      {
        customerName: 'Suresh Kumar',
        phone: '9848022334',
        productTitle: 'Walkaroo Men Ultra Comfort Daily Slide Sandals',
        sku: '102',
        brand: 'Walkaroo',
        price: 499,
        size: 'UK 8',
        color: 'Navy Blue',
        source: 'PRODUCT_DETAIL',
        status: 'NEW',
        message: 'Hello Chandhana Shoe Mart,\nI am interested in:\n👞 *Walkaroo Men Ultra Comfort Daily Slide Sandals*\n💰 Price: *₹499* | Size: UK 8 | Color: Navy Blue\n\nPlease let me know the best price, discount, and availability. Thank you!',
        notes: 'Customer inquired from Bheemunipatnam, needs UK 8 for daily use.',
      },
      {
        customerName: 'Lakshmi Prasanna',
        phone: '9989123456',
        productTitle: 'Sushma Elegant Block Heel Party Sandals',
        sku: '304',
        brand: 'Sushma',
        price: 799,
        size: 'UK 6',
        color: 'Golden',
        source: 'PRODUCT_DETAIL',
        status: 'CONTACTED',
        message: 'Hello Chandhana Shoe Mart,\nI am interested in:\n👞 *Sushma Elegant Block Heel Party Sandals*\n💰 Price: *₹799* | Size: UK 6 | Color: Golden\n\nIs this available in your Tagarapuvalasa shop today? Can I visit in evening?',
        notes: 'Called customer, confirmed stock available for trial in store.',
      },
      {
        customerName: 'Ravi Teja',
        phone: '9701239876',
        productTitle: 'Sparx Athleisure Breathable Mesh Running Shoes',
        sku: '501',
        brand: 'Sparx',
        price: 999,
        size: 'UK 9',
        color: 'Black/Red',
        source: 'CATALOG_CARD',
        status: 'CONVERTED',
        message: 'Hello Chandhana Shoe Mart,\nI am interested in:\n👞 *Sparx Athleisure Breathable Mesh Running Shoes*\n💰 Price: *₹999* | Size: UK 9\n\nLooking to buy today.',
        notes: 'Customer visited shop near Tata Theatre and purchased.',
      },
      {
        customerName: 'Appala Naidu',
        phone: '9440187654',
        productTitle: 'VKC Pride Extra Grip PU Leather Chappal',
        sku: '871',
        brand: 'VKC Pride',
        price: 389,
        size: 'UK 7',
        color: 'Brown',
        source: 'PRODUCT_DETAIL',
        status: 'NEW',
        message: 'Hello Chandhana Shoe Mart,\nI would like to inquire about VKC Pride 871 Brown size 7. What is the shop timing tomorrow?',
        notes: 'Shop timing 9am to 9pm communicated.',
      },
      {
        customerName: 'Kavitha Devi',
        phone: '9121345678',
        productTitle: 'Doctor Choice Orthopedic Soft Cushion Sandal',
        sku: '412',
        brand: 'Doctor Choice',
        price: 649,
        size: 'UK 5',
        color: 'Maroon',
        source: 'CART_ORDER',
        status: 'CONTACTED',
        message: 'Hello Chandhana Shoe Mart,\nI need soft orthopedic footwear for senior citizen. Is Doctor Choice 412 available?',
        notes: 'Shared shop location and offered size 5 & 6 trial.',
      },
    ];

    for (const item of samples) {
      await prisma.whatsAppEnquiry.create({ data: item });
    }
    console.log(`Seeded ${samples.length} WhatsApp enquiries.`);
  } else {
    console.log(`Already has ${count} WhatsApp enquiries.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

