export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: string;
  inventory: number;
  priceAdjustment: number;
  imageUrl?: string;
}

export interface ProductMedia {
  id: string;
  productId: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  alt?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  department: 'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS';
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  productCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  sku: string;
  categoryId: string;
  category?: Category;
  department: 'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS';
  price: number;
  originalPrice?: number;
  discountPercent: number;
  description: string;
  details?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  has3D: boolean;
  model3DConfig?: string;
  videoUrl?: string;
  videoPoster?: string;
  upperMaterial?: string;
  soleMaterial?: string;
  insoleMaterial?: string;
  cushioning?: string;
  closureType?: string;
  heelHeight?: string;
  weight?: string;
  gripType?: string;
  careInstructions?: string;
  warranty?: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  reviews?: Review[];
  related?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  availableStock?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'HOME' | 'WORK';
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productTitle: string;
  sku: string;
  colorName: string;
  size: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  status:
    | 'PLACED'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURN_REQUESTED'
    | 'RETURNED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentId?: string;
  razorpayOrderId?: string;
  shippingAddress: string;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  cancelReason?: string;
  returnReason?: string;
  createdAt: string;
  items: OrderItem[];
  user?: { id: string; name: string; email: string; phone?: string | null };
}

export interface StoreSettings {
  id: string;
  shopName: string;
  logoUrl?: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  announcement: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}
