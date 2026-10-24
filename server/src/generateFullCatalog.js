import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image pools by style
const imagePool = {
  mensRunning: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  ],
  mensSneakers: [
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
  ],
  mensFormal: [
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521774466027-0262c60643ea?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
  ],
  mensBoots: [
    'https://images.unsplash.com/photo-1549298916-f52d724204b4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80',
  ],
  mensSandals: [
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
  ],
  womensAthletic: [
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  ],
  womensCasual: [
    'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80',
  ],
  womensHeels: [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop&q=80',
  ],
  womensFlats: [
    'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80',
  ],
  womensSandals: [
    'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop&q=80',
  ],
  slippersSlides: [
    'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
  ],
  kids: [
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
  ],
};

const colorsPool = [
  { name: 'Crimson Flame', hex: '#DC2626' },
  { name: 'Onyx Black', hex: '#111827' },
  { name: 'Arctic White', hex: '#F8FAFC' },
  { name: 'Midnight Navy', hex: '#1E3A8A' },
  { name: 'Saddle Tan', hex: '#78350F' },
  { name: 'Forest Olive', hex: '#14532D' },
  { name: 'Rose Gold', hex: '#E11D48' },
  { name: 'Pastel Lilac', hex: '#A855F7' },
  { name: 'Royal Gold', hex: '#D97706' },
  { name: 'Sky Cyan', hex: '#0284C7' },
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 18 product category archetypes
const templates = [
  // 1. Mens Running
  {
    cat: 'mens-running-shoes',
    dept: 'MEN',
    brand: 'Chandhana Pro',
    imageKey: 'mensRunning',
    modelType: 'runner',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    priceMin: 1899,
    priceMax: 4999,
    upper: 'Breathable Engineered Jacquard Mesh',
    sole: 'Nitrogen-Infused Dual-Density Foam Sole',
    names: [
      'Apex Nitro Hyper-Speed Runner', 'Quantum-X Carbon Plated Marathon Racer', 'AeroFlow Velocity Sprint',
      'CloudPulse Ultra-Distance Trainer', 'HydroGuard All-Weather Trail Runner', 'BioKnit AirStride Speed',
      'Horizon Max Cushion Road Shoe', 'Tempo Surge Lightweight Racer', 'CrossFit Apex High-Impact Trainer',
      'SolarGlide Energy Return Shoe', 'Ignite Pro Seamless Knit Runner', 'TerraClaw Mountain Trail Master',
      'Falcon Speedster Road Trainer', 'PulseTread Aerobic Athletic Shoe', 'VoltStrike Carbon Zoom',
      'StormRunner Hydrophobic Shoe', 'SkyLine Elevation Light Trainer', 'Veloce Pro Road Competition',
      'StrataFlex Ergonomic Running Shoe', 'HyperSprint Athletic Court Shoe'
    ]
  },
  // 2. Mens Sneakers
  {
    cat: 'mens-sneakers',
    dept: 'MEN',
    brand: 'Chandhana Originals',
    imageKey: 'mensSneakers',
    modelType: 'sneaker',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 1499,
    priceMax: 3999,
    upper: 'Suede Calfskin & Perforated Leather',
    sole: 'Vulcanized Cupsole Gum Rubber',
    names: [
      'Monarch Suede Vintage Court Sneaker', 'StreetVibe Mid-Top Skate Sneaker', 'Urban Edge Chunky Lifestyle',
      'Artisan Cupsole Minimalist Trainer', 'Heritage Canvas Low-Top Sneaker', 'Grand Horizon Perforated Sneaker',
      'Classic Ten Full-Grain Leather Sneaker', 'Velvet Suede Terrace Sneaker', 'Vanguard High-Top Street Sneaker',
      'MetroKnit Breathable Casual Sneaker', 'Camden Nubuck Leather Sneaker', 'Oxford Suede Weekend Trainer',
      'Manhattan Club Leather Sneaker', 'Eclipse Monochrome Minimalist', 'Riverside Deck Walking Sneaker',
      'Soho Low-Top Street Court Sneaker', 'BrickLane Canvas Casual Sneaker', 'Tribeca Perforated Leather Sneaker',
      'Kingston Knit Lo-Fi Sneaker', 'Ventura Vintage Suede Court Shoe'
    ]
  },
  // 3. Mens Formal
  {
    cat: 'mens-formal-shoes',
    dept: 'MEN',
    brand: 'Chandhana Sartorial',
    imageKey: 'mensFormal',
    modelType: 'formal',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 2499,
    priceMax: 6999,
    upper: 'Full-Grain Italian Calf Leather',
    sole: 'Goodyear Welted Hand-Polished Leather Sole',
    names: [
      'Windsor Hand-Burnished Leather Derby', 'Imperial Wholecut Italian Oxford', 'Sovereign Cap-Toe Brogue',
      'Mayfair Double Monk Strap Shoe', 'Belgravia Single Buckle Monk', 'Kensington Tassel Loafer',
      'Westminster Penny Loafer', 'St. James Venetian Dress Loafer', 'Savile Row Wingtip Brogue',
      'Buckingham Tuxedo Patent Oxford', 'Regent Street Medallion Derby', 'Edinburgh Tweed & Leather Oxford',
      'Milanese Horsebit Leather Loafer', 'Florence Pebble-Grain Loafer', 'Piccadilly Apron-Toe Derby',
      'Ascot Formal Slip-On Dress Shoe', 'Oxford Royal Saddle Shoe', 'Windsor Burgundy Wingtip Brogue',
      'Cambridge Burnished Tan Derby', 'Balmoral Full-Grain Formal Oxford'
    ]
  },
  // 4. Mens Casual & Loafers
  {
    cat: 'mens-casual-loafers',
    dept: 'MEN',
    brand: 'Chandhana Lifestyle',
    imageKey: 'mensFormal',
    modelType: 'loafer',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 1399,
    priceMax: 3299,
    upper: 'Supple Nappa Leather & Suede',
    sole: 'Rubber Pebble Driving Pod Sole',
    names: [
      'Riviera Moccasin Driver Loafer', 'Portofino Suede Tassel Slip-On', 'Napoli Hand-Stitched Penny Loafer',
      'Amalfi Coast Boat Deck Shoe', 'Bologna Woven Leather Loafer', 'St. Tropez Lightweight Suede Slip-On',
      'Sorrento Casual Slip-On Driver', 'Monaco Bit Loafer with Gold Crest', 'Capri Espadrille Moccasin',
      'Verona Soft-Glove Leather Loafer', 'Bari Perforated Summer Loafer', 'Genova Handcrafted Slip-On',
      'Lucca Saddle Driving Shoe', 'Siena Classic Driving Loafer', 'Palermo Luxury Suede Loafer'
    ]
  },
  // 5. Mens Boots
  {
    cat: 'mens-boots-outdoor',
    dept: 'MEN',
    brand: 'Chandhana Rugged',
    imageKey: 'mensBoots',
    modelType: 'boot',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 2499,
    priceMax: 5999,
    upper: 'Waterproof Oiled Nubuck & Cordura',
    sole: 'Lugged All-Terrain Vibram-Style Outsole',
    names: [
      'Alpine-Force Waterproof Mountain Trekker', 'Chelsea Classic Pull-On Leather Boot', 'Vanguard Tactical Combat Boot',
      'Highland Suede Chukka Desert Boot', 'Karakoram Extreme Trail Explorer', 'IronClad Cap-Toe Work Boot',
      'Himalaya Thermal Insulated Winter Boot', 'Sahyadri High-Ankle Hiking Boot', 'Everest Peak Rugged Trekking Boot',
      'Dakota Oiled Leather Work Boot', 'Montana Suede Lace-Up Desert Boot', 'Canyonlands Waterproof Trekker',
      'Sherpa Grip Expedition Boot', 'Yukon Tough-Terrain Mud Boot', 'Glacier Ridge Snow Hiking Boot'
    ]
  },
  // 6. Mens Sandals & Ethnic
  {
    cat: 'mens-ethnic-sandals',
    dept: 'MEN',
    brand: 'Chandhana Heritage',
    imageKey: 'mensSandals',
    modelType: 'sandal',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 899,
    priceMax: 2499,
    upper: 'Vegetable-Tanned Genuine Leather',
    sole: 'Hand-Compressed Leather & Textured Rubber',
    names: [
      'Royal Heritage Handcrafted Kolhapuri Chappal', 'Peshawari Traditional Leather Sandal', 'Deccan Toe-Ring Artisan Chappal',
      'Rajgharana Antique Gold Mojari Sandal', 'Maratha Hand-Braided Leather Chappal', 'Kaveri Comfort Padded Leather Sandal',
      'Hampi Temple Carving Ethnic Sandal', 'Thar Desert Camel Leather Sandal', 'Mysore Silk-Lined Wedding Mojari',
      'Konkan Coastal Braided Leather Sandal'
    ]
  },
  // 7. Womens Running & Trainers
  {
    cat: 'womens-running-trainers',
    dept: 'WOMEN',
    brand: 'Chandhana Women',
    imageKey: 'womensAthletic',
    modelType: 'runner',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 1799,
    priceMax: 4499,
    upper: 'Soft-Woven Engineered FlyKnit Mesh',
    sole: 'Responsive Aeroflux Nitrogen Midsole',
    names: [
      'CloudStrata Women’s Performance Trainer', 'Solaria Nitro-Glide Distance Runner', 'Aurora Energy Return Athletic Shoe',
      'Lumina Featherweight Gym Trainer', 'Zephyr Ultra-Breathable Workout Shoe', 'Velocity Pro Carbon Women’s Racer',
      'LunaKnit Active Slip-On Athletic Sneaker', 'Vortex High-Impact Studio Trainer', 'AeroBliss Aerobic Workout Shoe',
      'Stella Carbon Road Marathon Racer', 'Nova Wave Cushion Training Shoe', 'Horizon Flow Stability Athletic Shoe',
      'PulseGlow Reflective Night Runner', 'Zenith Flex Ergonomic Gym Trainer', 'HyperSprint Women’s Light Racer'
    ]
  },
  // 8. Womens Casual & Sneakers
  {
    cat: 'womens-casual-sneakers',
    dept: 'WOMEN',
    brand: 'Chandhana Women',
    imageKey: 'womensCasual',
    modelType: 'sneaker',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 1299,
    priceMax: 3499,
    upper: 'Eco-Vegan Leather & Pastel Suede Accents',
    sole: 'Lightweight Chunky Platform Rubber',
    names: [
      'Breezeway Slip-On Athleisure Sneaker', 'Milano Leather Minimalist Sneaker', 'CloudWalk Platform Chunky Dad Sneaker',
      'Chloe Retro Suede Court Sneaker', 'Parisienne Vintage Tennis Sneaker', 'Bella Star Embroidered Canvas Sneaker',
      'Riviera Slip-On Summer Espadrille Sneaker', 'Chelsea Knit High-Top Fashion Sneaker', 'Starlight Metallic Trim Sneaker',
      'Capri Pastel Colorblock Platform Sneaker', 'SOHO Low-Top Chunky Sole Sneaker', 'Vienna Vintage Streetwear Trainer',
      'Roma Perforated White Leather Sneaker', 'Venice Beach Lightweight Canvas Shoe', 'Geneva Quilted Slip-On Sneaker'
    ]
  },
  // 9. Womens Flats & Loafers
  {
    cat: 'womens-flats-loafers',
    dept: 'WOMEN',
    brand: 'Chandhana Women',
    imageKey: 'womensFlats',
    modelType: 'loafer',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 1199,
    priceMax: 2999,
    upper: 'Ultra-Soft Glove Leather & Suede',
    sole: 'Anti-Slip Flexible Resin Rubber Sole',
    names: [
      'Aurelia Pointed-Toe Formal Ballet Flats', 'Milano Handcrafted Soft Leather Loafer', 'Ballerina Memory Foam Daily Walking Flat',
      'Verona Quilted Almond-Toe Ballet Flat', 'Siena Gold-Horsebit Leather Loafer', 'Cambridge Tassel Smoking Slipper',
      'Duchess Velvet Evening Smoking Loafer', 'Florentine Pointed Backless Mule', 'Primrose D’Orsay Ankle Ballet Flat',
      'Venice Patent Leather Professional Loafer'
    ]
  },
  // 10. Womens Heels & Pumps
  {
    cat: 'womens-heels-pumps',
    dept: 'WOMEN',
    brand: 'Chandhana Elegance',
    imageKey: 'womensHeels',
    modelType: 'heel',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 1699,
    priceMax: 4999,
    upper: 'Premium Micro-Suede & Gloss Patent Leather',
    sole: 'Reinforced Arch Steel-Shank Stiletto Sole',
    names: [
      'VelvetStiletto 4-Inch Pointed Pump', 'Audrey Classic 3-Inch Block Heel Court Shoe', 'Sophia Ankle-Strap Kitten Heel',
      'Isabella Peep-Toe D’Orsay Evening Pump', 'Charlotte Scalloped Edge Court Shoe', 'Juliette Slingback Stiletto Pump',
      'Rosalind Satin Bridal Wedding Pump', 'Valentina Metallic Strappy Evening Heel', 'Grace Almond-Toe Low Block Heel',
      'Sienna Chunky Platform Mid-Heel', 'Carmen Lace-Up High Stiletto Sandal', 'Genevieve Gold-Trim Pointed Pump',
      'Celeste Crystal-Embellished Gala Heel', 'Vivienne Patent Nude Classic Pump', 'Serena Elegant Flared Block Heel'
    ]
  },
  // 11. Womens Sandals & Wedges
  {
    cat: 'sandals-wedges',
    dept: 'WOMEN',
    brand: 'Chandhana Elegance',
    imageKey: 'womensSandals',
    modelType: 'wedge',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 1299,
    priceMax: 3499,
    upper: 'Hand-Braided Natural Jute & Soft Straps',
    sole: 'Cushioned Shock-Absorbing Cork & Jute Platform',
    names: [
      'Stella Braided Jute Espadrille Wedge', 'Bohemian Strappy Roman Gladiator Sandal', 'Catalina Cork Platform Comfort Wedge',
      'Riviera Espadrille Ankle-Tie Platform', 'Santorini Strappy Toe-Loop Summer Sandal', 'Ibiza Braided T-Strap Flat Sandal',
      'Marbella Cross-Strap Wedge Sandal', 'Mykonos Embellished Slide Sandal', 'Amalfi Metallic Ankle-Wrap Sandal',
      'Mallorca Dual-Buckle Comfort Wedge Sandal'
    ]
  },
  // 12. Womens Ethnic & Kolhapuri
  {
    cat: 'kolhapuri-ethnic',
    dept: 'WOMEN',
    brand: 'Chandhana Heritage',
    imageKey: 'womensSandals',
    modelType: 'sandal',
    sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    priceMin: 899,
    priceMax: 2499,
    upper: 'Embroidered Silk & Handcrafted Leather',
    sole: 'Padded Soft-Bed Leather Sole',
    names: [
      'Royal Padmavati Zari Embroidered Jutti', 'Chandramukhi Metallic Gold Kolhapuri', 'Meenakari Kundan Embellished Mojari',
      'Shringar Mirror-Work Festive Jutti', 'Anarkali Golden Braid Toe-Ring Chappal', 'Rajputana Velvet Threadwork Khussa',
      'Gulabi Phulkari Handcrafted Jutti', 'Noor Jahan Pearl-Studded Wedding Mojari'
    ]
  },
  // 13. Memory Foam Slippers
  {
    cat: 'memory-foam-slippers',
    dept: 'SLIPPERS_SANDALS',
    brand: 'Chandhana Comfort',
    imageKey: 'slippersSlides',
    modelType: 'comfort_slide',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 699,
    priceMax: 1899,
    upper: 'High-Density Memory Foam & Faux-Fur Fleece',
    sole: 'Anti-Skid Textured Indoor/Outdoor Rubber',
    names: [
      'OrthoRelief Memory Foam Relieving Slipper', 'SilkCloud Faux-Fur Bedroom Slippers', 'CozyNest Sheepskin Lined Indoor Clogs',
      'Nordic Thermal Quilted House Bootie', 'ZenStep Acupressure Relieving Slippers', 'CloudNest Fleece Heated Slippers',
      'Serenity Plush Memory Foam Open-Toe Slide', 'TheraSoft Plantar Fascia Recovery Slipper'
    ]
  },
  // 14. EVA Slides & Flip-Flops
  {
    cat: 'eva-slides-flip-flops',
    dept: 'SLIPPERS_SANDALS',
    brand: 'Chandhana Comfort',
    imageKey: 'slippersSlides',
    modelType: 'comfort_slide',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 599,
    priceMax: 1499,
    upper: 'Ultralight Bio-Based 120g EVA Mold',
    sole: '45mm Thick Pillow Base with Siped Wave Channels',
    names: [
      'CloudStep Ultra-Cushion EVA Recovery Slides', 'HydroGlide Wave Cushion Waterproof Slides', 'AquaTread Non-Slip Bathroom Slippers',
      'AeroFoam 45mm Platform Pillow Slide', 'BreezeFlex Ergonomic Shower Slippers', 'WaveRider Lightweight Beach Flip-Flops',
      'CloudStrut Quick-Drying Pool Slides', 'TerraSlide High-Grip Garden Slippers', 'SoftWalk Antibacterial EVA Clogs',
      'HydroShield Wet-Tile Grip Flip-Flop', 'Zenith Air-Cushion Recovery Slide', 'PillowStride Bio-Foam Lounge Slides'
    ]
  },
  // 15. Adjustable Strap Sandals
  {
    cat: 'adjustable-strap-sandals',
    dept: 'SLIPPERS_SANDALS',
    brand: 'Chandhana Comfort',
    imageKey: 'slippersSlides',
    modelType: 'comfort_slide',
    sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    priceMin: 999,
    priceMax: 2499,
    upper: 'Quick-Dry Hydrophobic Webbing Straps',
    sole: 'Anatomical Arch Support Rubber Sole',
    names: [
      'TerraGrip Adjustable All-Terrain Sandals', 'OrthoCare Diabetic Soft-Bed Sandals', 'Outback River Trekking Wet Sandals',
      'ArchFit Ergonomic Walking Sandals', 'AdventureTrail Dual-Buckle Water Sandal', 'BioMotion Plantar Relieving Sandal',
      'Explorer HydroLock Multi-Strap Sandal', 'CushionTrek Heavy-Duty Hiking Sandal', 'ComfortCruiser Padded Strap Sandal',
      'Riverbank Waterproof Outdoor Sandal'
    ]
  },
  // 16. Kids School Shoes
  {
    cat: 'kids-school-shoes',
    dept: 'KIDS',
    brand: 'Chandhana Kids',
    imageKey: 'kids',
    modelType: 'runner',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 11C', 'UK 12C', 'UK 13C'],
    priceMin: 699,
    priceMax: 1499,
    upper: 'High-Scuff Action Leather with Reinforced Toe Cap',
    sole: 'Non-Marking Flexible School Rubber Sole',
    names: [
      'Junior Speedy-Sprint Uniform School Shoe', 'SchoolReady Classic Black Velcro Shoe', 'ScholarPro Scuff-Resistant Oxford Shoe',
      'CampusTough Dual-Strap Boys School Shoe', 'MaryJane Girls Classic School Buckle Shoe'
    ]
  },
  // 17. Kids Casual Sneakers
  {
    cat: 'kids-casual-sneakers',
    dept: 'KIDS',
    brand: 'Chandhana Kids',
    imageKey: 'kids',
    modelType: 'runner',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 11C', 'UK 12C', 'UK 13C'],
    priceMin: 799,
    priceMax: 1699,
    upper: 'Breathable Mesh with Colorful Synthetic Overlays',
    sole: 'Cushioned Shock-Absorbing Phylon Outsole',
    names: [
      'Dynamo Turbo Lights USB LED Kid Sneaker', 'DinoTrack Light-Up Playground Sneaker', 'Princess Glow Sparkle Ballet Sneaker',
      'LittleStar Canvas Low-Top Slip-On', 'SpeedRacer Aerodynamic Lighted Sneaker'
    ]
  },
  // 18. Kids Sandals
  {
    cat: 'kids-sandals',
    dept: 'KIDS',
    brand: 'Chandhana Kids',
    imageKey: 'kids',
    modelType: 'sandal',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 11C', 'UK 12C', 'UK 13C'],
    priceMin: 599,
    priceMax: 1299,
    upper: 'Soft Padded Webbing with Hook-and-Loop Closures',
    sole: 'Ergonomic Slip-Resistant Rubber Footbed',
    names: [
      'Junior Explorer All-Weather Adventure Sandal', 'Toddler First-Steps Flexible Soft-Sole Sandal',
      'Rainbow Wave Summertime Pool Sandal', 'PuddleSplash Waterproof River Sandal', 'HappyFeet Ergonomic Comfort Sandal'
    ]
  }
];

// Generate products
const generatedProducts = [];
let skuIndex = 1;

for (const tmpl of templates) {
  for (let i = 0; i < tmpl.names.length; i++) {
    const title = 'Chandhana ' + tmpl.names[i];
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const price = Math.round(getRandomInt(tmpl.priceMin, tmpl.priceMax) / 50) * 50 - 1; // e.g. 1899, 2499
    const discountPercent = getRandomInt(15, 45);
    const originalPrice = Math.round((price / (1 - discountPercent / 100)) / 100) * 100 - 1;
    const skuCode = `CSM-${tmpl.dept.substring(0, 2)}-${String(skuIndex).padStart(4, '0')}`;
    skuIndex++;

    const color1 = getRandomElement(colorsPool);
    let color2 = getRandomElement(colorsPool);
    while (color2.hex === color1.hex) {
      color2 = getRandomElement(colorsPool);
    }
    const color3 = getRandomElement(colorsPool);

    // Pick 2-3 curated images from pool
    const pool = imagePool[tmpl.imageKey] || imagePool.mensRunning;
    const img1 = pool[i % pool.length];
    const img2 = pool[(i + 1) % pool.length];
    const img3 = pool[(i + 2) % pool.length];
    const media = [img1, img2, img3];

    // Build 3D config
    const model3DConfig = JSON.stringify({
      defaultColor: color1.hex,
      accentColor: color2.hex,
      soleColor: '#F8FAFC',
      roughness: 0.55,
      metalness: 0.15,
      modelType: tmpl.modelType,
    });

    // Variants for sizes and colors
    const variants = [];
    for (const size of tmpl.sizes) {
      variants.push({
        size,
        colorName: color1.name,
        colorHex: color1.hex,
        inventory: getRandomInt(8, 25),
        priceAdjustment: 0,
      });
      variants.push({
        size,
        colorName: color2.name,
        colorHex: color2.hex,
        inventory: getRandomInt(5, 20),
        priceAdjustment: 0,
      });
    }

    generatedProducts.push({
      title,
      slug,
      brand: tmpl.brand,
      sku: skuCode,
      categorySlug: tmpl.cat,
      department: tmpl.dept,
      price,
      originalPrice,
      discountPercent,
      description: `Premium handcrafted footwear engineered with ${tmpl.upper} and ${tmpl.sole}. Designed for unmatched all-day comfort, durability, and Indian lifestyle needs.`,
      details: `Featuring high-durability reinforced stitching, anatomical arch contouring, and anti-slip traction pods. Handcrafted under strict quality control standards at Chandhana Shoe Mart.`,
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviewCount: getRandomInt(12, 180),
      isFeatured: i < 3,
      isTrending: i % 4 === 0,
      isNewArrival: i % 3 === 0,
      isBestSeller: i % 5 === 0,
      has3D: true,
      model3DConfig,
      upperMaterial: tmpl.upper,
      soleMaterial: tmpl.sole,
      insoleMaterial: 'Ortholite High-Rebound Memory Cushion Foam',
      cushioning: 'Dual-Layer Impact Absorption Shock Cell',
      closureType: tmpl.dept === 'SLIPPERS_SANDALS' ? 'Slip-on / Slide' : 'Standard Lace-Up / Ergonomic Fastening',
      heelHeight: tmpl.modelType === 'heel' ? '3.5 inches' : tmpl.dept === 'SLIPPERS_SANDALS' ? '45mm Platform' : '1.2 inches',
      weight: `${getRandomInt(140, 360)}g (Single Foot)`,
      gripType: 'High-Traction Anti-Slip Rubber Pods with Hydro Channels',
      careInstructions: 'Wipe clean with a damp microfiber cloth. Allow to air dry naturally away from direct sunlight.',
      warranty: '6 Months Brand Warranty against manufacturing defects',
      media,
      variants,
    });
  }
}

console.log(`Generated ${generatedProducts.length} full-spec footwear products.`);

const outputPath = path.resolve(__dirname, 'catalogProducts.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedProducts, null, 2), 'utf8');
console.log(`Written to ${outputPath}`);

const tsOutputPath = path.resolve(__dirname, 'catalogProducts.ts');
const tsContent = `// Auto-generated 200+ product catalog for Chandhana Shoe Mart
export interface ProductSeedData {
  title: string;
  slug: string;
  brand: string;
  sku: string;
  categorySlug: string;
  department: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  description: string;
  details: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  has3D: boolean;
  model3DConfig: string;
  upperMaterial: string;
  soleMaterial: string;
  insoleMaterial: string;
  cushioning: string;
  closureType: string;
  heelHeight: string;
  weight: string;
  gripType: string;
  careInstructions: string;
  warranty: string;
  media: string[];
  variants: Array<{
    size: string;
    colorName: string;
    colorHex: string;
    inventory: number;
    priceAdjustment: number;
  }>;
}

export const catalogProducts: ProductSeedData[] = ${JSON.stringify(generatedProducts, null, 2)};
`;
fs.writeFileSync(tsOutputPath, tsContent, 'utf8');
console.log(`Written to ${tsOutputPath}`);
