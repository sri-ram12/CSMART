import { Product, Category, Order, User, Address, StoreSettings, CartItem, Banner, WhatsAppEnquiry, VideoAd } from '../types';
import { fallbackFeaturedProducts } from '../data/featuredProducts';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('csm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'An error occurred during request');
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
      request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: () => request<User>('/auth/me'),
    updateProfile: (data: { name?: string; phone?: string }) =>
      request<User>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getAddresses: () => request<Address[]>('/auth/addresses'),
    addAddress: (data: Partial<Address>) =>
      request<Address>('/auth/addresses', { method: 'POST', body: JSON.stringify(data) }),
    deleteAddress: (id: string) =>
      request<{ message: string }>(`/auth/addresses/${id}`, { method: 'DELETE' }),
    getWishlist: () => request<Product[]>('/auth/wishlist'),
    toggleWishlist: (productId: string) =>
      request<{ inWishlist: boolean }>('/auth/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }),
  },

  // Products
  products: {
    getAll: async (params: Record<string, string | number | boolean | undefined> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
      try {
        return await request<{ products: Product[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
          `/products?${query.toString()}`
        );
      } catch (err) {
        console.warn('api.products.getAll failed, using fallback data', err);
        return {
          products: fallbackFeaturedProducts,
          pagination: { total: fallbackFeaturedProducts.length, page: 1, limit: 12, totalPages: 1 },
        };
      }
    },
    getFeatured: async () => {
      try {
        return await request<Product[]>('/products/featured');
      } catch {
        return fallbackFeaturedProducts.filter((p) => p.isFeatured);
      }
    },
    getTrending: async () => {
      try {
        return await request<Product[]>('/products/trending');
      } catch {
        return fallbackFeaturedProducts.filter((p) => p.isTrending);
      }
    },
    getNewArrivals: async () => {
      try {
        return await request<Product[]>('/products/new-arrivals');
      } catch {
        return fallbackFeaturedProducts.filter((p) => p.isNewArrival);
      }
    },
    get3DCollection: async () => {
      try {
        return await request<Product[]>('/products/3d-collection');
      } catch {
        return fallbackFeaturedProducts.filter((p) => p.has3D);
      }
    },
    getBySlug: async (slug: string) => {
      try {
        return await request<Product>(`/products/by-slug/${slug}`);
      } catch {
        return fallbackFeaturedProducts.find((p) => p.slug === slug) || fallbackFeaturedProducts[0];
      }
    },
    getById: async (id: string) => {
      try {
        return await request<Product>(`/products/${id}`);
      } catch {
        return fallbackFeaturedProducts.find((p) => p.id === id) || fallbackFeaturedProducts[0];
      }
    },
    getFacets: async () => {
      try {
        return await request<{
          brands: Array<{ name: string; count: number }>;
          categories: Array<{ slug: string; name: string; count: number }>;
          departments: Record<string, number>;
          priceRange: { min: number; max: number };
          totalProducts: number;
        }>('/products/facets');
      } catch {
        return {
          brands: [
            { name: "Mea's Shoelle", count: 2 },
            { name: 'Campus Active', count: 2 },
            { name: 'HRX by Hrithik', count: 1 },
            { name: 'Relaxo Bahamas', count: 1 },
            { name: 'Red Tape Classic', count: 1 },
            { name: 'Sparx Premium', count: 1 },
          ],
          categories: [
            { slug: 'heels', name: 'Heels', count: 1 },
            { slug: 'sneakers', name: 'Sneakers', count: 2 },
            { slug: 'sandals', name: 'Sandals', count: 1 },
            { slug: 'boots', name: 'Boots', count: 1 },
            { slug: 'slippers-sandals', name: 'Slippers & Slides', count: 1 },
          ],
          departments: { MEN: 4, WOMEN: 2, KIDS: 1, SLIPPERS_SANDALS: 1 },
          priceRange: { min: 699, max: 3299 },
          totalProducts: fallbackFeaturedProducts.length,
        };
      }
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      try {
        return await request<Category[]>('/categories');
      } catch {
        const fallbacks: Category[] = [
          { id: 'cat-heels', name: 'Heels', slug: 'heels', department: 'WOMEN', featured: true },
          { id: 'cat-sandals', name: 'Sandals', slug: 'sandals', department: 'WOMEN', featured: true },
          { id: 'cat-sneakers', name: 'Sneakers', slug: 'sneakers', department: 'MEN', featured: true },
          { id: 'cat-boots', name: 'Boots', slug: 'boots', department: 'MEN', featured: true },
          { id: 'cat-slippers', name: 'Slippers & Slides', slug: 'slippers-sandals', department: 'SLIPPERS_SANDALS', featured: true },
          { id: 'cat-kids', name: 'Kids Footwear', slug: 'kids', department: 'KIDS', featured: true },
        ];
        return fallbacks;
      }
    },
    getBySlug: async (slug: string) => {
      try {
        return await request<Category>(`/categories/${slug}`);
      } catch {
        const fallback: Category = { id: `cat-${slug}`, name: slug.toUpperCase(), slug, department: 'MEN' };
        return fallback;
      }
    },
  },

  // Checkout & Pincode
  checkout: {
    validateCart: (data: { items: any[]; couponCode?: string }) =>
      request<{
        items: any[];
        subtotal: number;
        discountAmount: number;
        shippingFee: number;
        finalAmount: number;
        coupon: any;
        stockIssues: string[];
        isEligibleForFreeShipping: boolean;
        freeShippingThreshold: number;
        amountNeededForFreeShipping: number;
      }>('/checkout/validate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  pincode: {
    check: (pincode: string) =>
      request<{
        pincode: string;
        serviceable: boolean;
        city: string;
        transitDays: number;
        estimatedDelivery: string;
        codAvailable: boolean;
        courier: string;
        freeDeliveryThreshold: number;
        message: string;
      }>(`/pincode/${pincode}`),
  },

  // Orders
  orders: {
    create: (data: {
      items: any[];
      shippingAddress: any;
      paymentMethod: 'COD' | 'RAZORPAY';
      paymentId?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      couponCode?: string;
      guestInfo?: { name: string; email: string; phone: string };
    }) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getMyOrders: () => request<Order[]>('/orders/my-orders'),
    getByIdOrNumber: (idOrNumber: string) => request<Order>(`/orders/${idOrNumber}`),
    cancel: (id: string, reason?: string) =>
      request<Order>(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
    returnRequest: (id: string, reason?: string) =>
      request<Order>(`/orders/${id}/return`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },

  // Payment
  payment: {
    createRazorpayOrder: (amount: number, receipt?: string) =>
      request<{ orderId: string; amount: number; currency: string; keyId: string; isSandbox?: boolean }>(
        '/payment/razorpay/create-order',
        { method: 'POST', body: JSON.stringify({ amount, receipt }) }
      ),
    verifyRazorpay: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature?: string;
    }) =>
      request<{ verified: boolean; message: string; paymentId: string }>(
        '/payment/razorpay/verify',
        { method: 'POST', body: JSON.stringify(data) }
      ),
  },

  // Reviews
  reviews: {
    submit: (data: { productId: string; rating: number; title: string; comment: string; userName?: string }) =>
      request<any>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request<any[]>('/reviews'),
    delete: (id: string) => request<{ message: string }>(`/reviews/${id}`, { method: 'DELETE' }),
  },

  // Settings
  settings: {
    get: () => request<StoreSettings>('/settings'),
  },

  // Customer WhatsApp Enquiries
  enquiries: {
    log: (data: Partial<WhatsAppEnquiry>) =>
      request<WhatsAppEnquiry>('/settings/enquiries/log', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Promotional Video Ads for Customer Panel
  videoAds: {
    getActive: () => request<VideoAd[]>('/settings/video-ads'),
    trackView: (id: string) =>
      request<{ success: boolean }>(`/settings/video-ads/${id}/view`, { method: 'POST' }),
  },

  // Admin
  admin: {
    getProducts: () => request<Product[]>('/admin/products'),
    getStats: () => request<any>('/admin/stats'),
    getEnquiries: (params: { status?: string; search?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.append('status', params.status);
      if (params.search) q.append('search', params.search);
      return request<WhatsAppEnquiry[]>(`/admin/enquiries?${q.toString()}`);
    },
    createEnquiry: (data: Partial<WhatsAppEnquiry>) =>
      request<WhatsAppEnquiry>('/admin/enquiries', { method: 'POST', body: JSON.stringify(data) }),
    updateEnquiryStatus: (id: string, data: { status?: string; notes?: string }) =>
      request<WhatsAppEnquiry>(`/admin/enquiries/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteEnquiry: (id: string) =>
      request<{ message: string }>(`/admin/enquiries/${id}`, { method: 'DELETE' }),
    getOrders: (params: { status?: string; search?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.status) q.append('status', params.status);
      if (params.search) q.append('search', params.search);
      return request<Order[]>(`/admin/orders?${q.toString()}`);
    },
    updateOrderStatus: (id: string, data: { status?: string; trackingNumber?: string; courierName?: string; paymentStatus?: string }) =>
      request<Order>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
    getInventory: (lowStockOnly = false) =>
      request<any[]>(`/admin/inventory?lowStockOnly=${lowStockOnly}`),
    updateInventory: (variantId: string, inventory: number) =>
      request<any>(`/admin/inventory/${variantId}`, { method: 'PUT', body: JSON.stringify({ inventory }) }),
    createProduct: (data: any) =>
      request<Product>('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id: string, data: any) =>
      request<Product>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id: string) =>
      request<{ message: string }>(`/admin/products/${id}`, { method: 'DELETE' }),
    toggleStock: (id: string, isOutOfStock: boolean) =>
      request<Product>(`/admin/products/${id}/toggle-stock`, { method: 'PUT', body: JSON.stringify({ isOutOfStock }) }),
    toggleSizeStock: (id: string, size: string, isOutOfStock: boolean) =>
      request<Product>(`/admin/products/${id}/toggle-size-stock`, { method: 'PUT', body: JSON.stringify({ size, isOutOfStock }) }),
    updateSizes: (id: string, sizes: Array<{ size: string; inventory: number }>) =>
      request<Product>(`/admin/products/${id}/sizes`, { method: 'PUT', body: JSON.stringify({ sizes }) }),
    quickUpdatePrice: (id: string, data: { price: number; originalPrice?: number; discountPercent?: number }) =>
      request<Product>(`/admin/products/${id}/price`, { method: 'PUT', body: JSON.stringify(data) }),
    getCoupons: () => request<any[]>('/admin/coupons'),
    createCoupon: (data: any) => request<any>('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
    getSettings: () => request<StoreSettings>('/admin/settings'),
    updateSettings: (data: Partial<StoreSettings>) =>
      request<StoreSettings>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
    getAvailableModels: () =>
      request<Array<{ name: string; url: string; sizeBytes: number; isBuiltIn: boolean }>>('/admin/models/available'),
    uploadModel: async (file: File) => {
      const formData = new FormData();
      formData.append('model', file);
      const res = await fetch(`${API_BASE}/admin/models/upload`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || 'Model upload failed');
      }
      return json.data !== undefined ? json.data : json;
    },
    updateProductModel: (id: string, data: { has3D: boolean; model3DConfig?: any }) =>
      request<Product>(`/admin/products/${id}/model`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleNewArrival: (id: string) =>
      request<{ isNewArrival: boolean }>(`/admin/products/${id}/toggle-new-arrival`, { method: 'PUT' }),
    uploadImage: (data: { image: string; filename?: string }) =>
      request<{ url: string }>('/admin/upload-image', { method: 'POST', body: JSON.stringify(data) }),
    updateProductImage: (id: string, imageUrl: string) =>
      request<Product>(`/admin/products/${id}/image`, { method: 'PUT', body: JSON.stringify({ imageUrl }) }),
    getBanners: () => request<Banner[]>('/admin/banners'),
    createBanner: (data: Partial<Banner>) =>
      request<Banner>('/admin/banners', { method: 'POST', body: JSON.stringify(data) }),
    updateBanner: (id: string, data: Partial<Banner>) =>
      request<Banner>(`/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBanner: (id: string) =>
      request<{ message: string }>(`/admin/banners/${id}`, { method: 'DELETE' }),
    // Video Ads Management
    getVideoAds: () => request<VideoAd[]>('/admin/video-ads'),
    uploadVideo: (data: { video: string; filename?: string }) =>
      request<{ url: string }>('/admin/video-ads/upload', { method: 'POST', body: JSON.stringify(data) }),
    createVideoAd: (data: Partial<VideoAd>) =>
      request<VideoAd>('/admin/video-ads', { method: 'POST', body: JSON.stringify(data) }),
    updateVideoAd: (id: string, data: Partial<VideoAd>) =>
      request<VideoAd>(`/admin/video-ads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteVideoAd: (id: string) =>
      request<{ message: string }>(`/admin/video-ads/${id}`, { method: 'DELETE' }),
  },
  banners: {
    getAll: () => request<Banner[]>('/settings/banners'),
  },
};
