/**
 * Authentic Google Maps Location Details for Chandana Shoe Mart (CSM)
 * Extracted directly from live Google Maps place card: https://maps.app.goo.gl/YBteoVzaYAF12mW97
 */

export interface StoreLocationData {
  name: string;
  teluguName: string;
  heritageTitle: string;
  tagline: string;
  category: string;
  address: {
    line1: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    fullFormatted: string;
  };
  phone: {
    display: string;
    tel: string;
    whatsapp: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  googleMaps: {
    shortUrl: string;
    fullPlaceUrl: string;
    placeId: string;
    cid: string;
    embedQuery: string;
  };
  rating: {
    score: number;
    maxScore: number;
    totalReviews: number;
    badge: string;
  };
  openingHours: {
    currentStatus: string;
    dailySchedule: { day: string; hours: string; isOpen: boolean }[];
  };
  customerReviews: {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    quote: string;
    profileUrl: string;
  }[];
  photos: {
    id: string;
    title: string;
    description: string;
    category: 'storefront' | 'ambiance' | 'interior' | 'display';
    localPath: string;
    highResGoogleUrl: string;
  }[];
}

export const storeLocationDetails: StoreLocationData = {
  name: 'Chandana Shoe Mart',
  teluguName: 'చందన షూమార్ట్',
  heritageTitle: 'పాదరక్షల బృందావనం',
  tagline: 'Quality First...',
  category: 'Shoe store / Footwear Retailer',

  address: {
    line1: 'Main Road',
    landmark: 'Opposite Tata Theatre',
    area: 'Tagarapuvalasa / Chittivalasa',
    city: 'Visakhapatnam (Bheemunipatnam Mandal)',
    state: 'Andhra Pradesh',
    pincode: '531162',
    fullFormatted: 'Opp: Tata Theatre, Main Road, Tagarapuvalasa, Visakhapatnam, Andhra Pradesh 531162',
  },

  phone: {
    display: '+91 95535 36884',
    tel: '09553536884',
    whatsapp: '+919553536884',
  },

  coordinates: {
    latitude: 17.9318122,
    longitude: 83.4274064,
  },

  googleMaps: {
    shortUrl: 'https://maps.app.goo.gl/YBteoVzaYAF12mW97',
    fullPlaceUrl: 'https://www.google.com/maps/place/Chandana+Shoe+Mart/@17.9318122,83.4274064,17z/data=!4m2!3m1!1s0x3a3957f918037751:0x3921cf8a897fef11',
    placeId: 'ChIJVXcDGPlXOTorEe9_iYrPITk',
    cid: '4116799728312643345',
    embedQuery: 'Chandana+Shoe+Mart+Tagarapuvalasa',
  },

  rating: {
    score: 3.3,
    maxScore: 5.0,
    totalReviews: 9,
    badge: 'Verified Google Business',
  },

  openingHours: {
    currentStatus: 'Open · Closes 9:00 PM',
    dailySchedule: [
      { day: 'Monday', hours: '9:00 AM – 9:00 PM', isOpen: true },
      { day: 'Tuesday', hours: 'Closed (Weekly Holiday)', isOpen: false },
      { day: 'Wednesday', hours: '9:00 AM – 9:00 PM', isOpen: true },
      { day: 'Thursday', hours: '9:00 AM – 9:00 PM', isOpen: true },
      { day: 'Friday', hours: '9:00 AM – 9:00 PM', isOpen: true },
      { day: 'Saturday', hours: '9:00 AM – 9:00 PM', isOpen: true },
      { day: 'Sunday', hours: '9:00 AM – 9:00 PM', isOpen: true },
    ],
  },

  customerReviews: [
    {
      id: 'rev-1',
      author: 'Google Local Guide',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWVp_DwHMiBBTz6zbCqLY1-6V0qhjxl7I7O1EEtdVnRhSLr4eJ5=s60-k-no',
      rating: 4,
      quote: 'Nice shop at reasonable prices',
      profileUrl: 'https://www.google.com/maps/contrib/106236177729930559045',
    },
    {
      id: 'rev-2',
      author: 'Verified Customer',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjWFOoB8Y80Qjd8nPxn-h2aF5pkQlq5ctWtOwDVV5YIoA6BZgD0r4A=s60-k-no',
      rating: 4,
      quote: 'Best shop for shoes and chappals',
      profileUrl: 'https://www.google.com/maps/contrib/104691498974803311032',
    },
  ],

  photos: [
    {
      id: 'storefront-photo',
      title: 'Main Storefront & Official Signboard',
      description: 'CHANDANA SHOE MART official signboard, Walkaroo entrance billboard & Sparx display standee',
      category: 'storefront',
      localPath: '/shop/shop_photo_1_storefront.jpg',
      highResGoogleUrl: '/shop/shop_photo_1_storefront.jpg',
    },
    {
      id: 'ambiance-photo',
      title: 'Showroom Interior & Brand Display Wall',
      description: 'Full retail showroom view with stacked brand shoe boxes (Bata, Flite, Walkaroo) & glass display showcase',
      category: 'ambiance',
      localPath: '/shop/shop_photo_2_ambiance.jpg',
      highResGoogleUrl: '/shop/shop_photo_2_ambiance.jpg',
    },
    {
      id: 'interior-photo',
      title: 'Entrance Walkway & Footwear Displays',
      description: 'Step-up customer entrance with footwear trial stands, Sparx rack & Walkaroo inventory wall',
      category: 'interior',
      localPath: '/shop/shop_photo_3_interior.jpg',
      highResGoogleUrl: '/shop/shop_photo_3_interior.jpg',
    },
    {
      id: 'display-photo',
      title: 'Retail Aisle & Floor-to-Ceiling Shelves',
      description: 'Vibrant retail footwear aisle with organized shelves, red Walkaroo branded ceiling & trial seating',
      category: 'display',
      localPath: '/shop/shop_photo_4_display.jpg',
      highResGoogleUrl: '/shop/shop_photo_4_display.jpg',
    },
    {
      id: 'counter-showcase-photo',
      title: 'Counter Showcase & Formal Footwear Range',
      description: 'Leather footwear, formal shoes, sandals and daily wear displays ready for customer trials',
      category: 'display',
      localPath: '/shop/shop_photo_5_counter.jpg',
      highResGoogleUrl: '/shop/shop_photo_5_counter.jpg',
    },
  ],
};
