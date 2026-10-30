import { Product } from '../types';
import { scannedProducts } from './scannedCatalog';

export const fallbackFeaturedProducts: Product[] = ((scannedProducts as any[]) || []).map((p: any, idx: number) => ({
  id: p.id || `fallback-prod-${idx + 1}`,
  categoryId: p.categoryId || 'cat-slippers',
  title: p.title,
  slug: p.slug,
  brand: p.brand,
  sku: p.sku,
  department: p.department,
  price: p.price,
  originalPrice: p.originalPrice,
  discountPercent: p.discountPercent || 0,
  description: p.description || '',
  details: p.details,
  rating: p.rating || 4.5,
  reviewCount: p.reviewCount || 10,
  isFeatured: Boolean(p.isFeatured),
  isTrending: Boolean(p.isTrending),
  isNewArrival: Boolean(p.isNewArrival),
  isBestSeller: Boolean(p.isBestSeller),
  has3D: Boolean(p.has3D),
  media: (p.media || []).map((m: any, mIdx: number) =>
    typeof m === 'string'
      ? { id: `m-${idx}-${mIdx}`, productId: p.id || `fallback-prod-${idx + 1}`, url: m, type: 'IMAGE' as const, order: mIdx }
      : m
  ),
  variants: (p.variants || []).map((v: any, vIdx: number) => ({
    id: `v-${idx}-${vIdx}`,
    productId: p.id || `fallback-prod-${idx + 1}`,
    sku: v.sku,
    colorName: v.colorName,
    colorHex: v.colorHex || '#000000',
    size: v.size,
    inventory: v.inventory ?? 10,
    priceAdjustment: v.priceAdjustment ?? 0,
  })),
}));
