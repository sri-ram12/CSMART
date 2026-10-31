import React, { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../../services/api';
import { Product, Category, Banner } from '../../types';
import {
  Plus,
  Trash2,
  Sparkles,
  Film,
  ArrowLeft,
  Edit3,
  Box,
  Check,
  AlertCircle,
  Tag,
  Star,
  MessageSquare,
  Search,
  CheckCircle2,
  Package,
  Ruler,
  Share2,
  Image as ImageIcon,
  QrCode,
  Eye,
  Upload,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Admin3DModelStudioModal } from '../../components/admin/Admin3DModelStudioModal';
import { ProductShareModal } from '../../components/admin/ProductShareModal';
import { ProductImageUploadModal } from '../../components/admin/ProductImageUploadModal';
import { ShareQRModal } from '../../components/common/ShareQRModal';

export const ALL_BRANDS = [
  'Walkaroo',
  'Sparx',
  'VKC Pride',
  'Paragon',
  'Walkmate',
  'Striker',
  'Brano',
  'Redfort',
  'Zaguaar',
  'Hison',
  'Poster Shoes',
  'Lancer',
  'Jockey',
  'Sushma',
  'TR Selections',
  'ZM Selections',
  'Airpistha',
  'Doctor Choice',
];

interface CustomerReviewItem {
  id: string;
  productId: string;
  userId?: string | null;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    brand: string;
    media?: Array<{ url: string }>;
  };
}

export const AdminProductsPage: React.FC = () => {
  // Navigation tabs: 'catalog' | 'banners' | 'reviews'
  const [activeTab, setActiveTab] = useState<'catalog' | 'banners' | 'reviews'>('catalog');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<CustomerReviewItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Catalog Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Reviews Filters
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | 'ALL'>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceEditingProduct, setPriceEditingProduct] = useState<Product | null>(null);
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [selected3DProduct, setSelected3DProduct] = useState<Product | null>(null);

  // Share & Image Modals & QR State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageEditingProduct, setImageEditingProduct] = useState<Product | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Banner Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('/shop');
  const [bannerBgColor, setBannerBgColor] = useState('#5B21B6');
  const [bannerTextColor, setBannerTextColor] = useState('#FFFFFF');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerType, setBannerType] = useState('OFFER');

  // New product form fields
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Walkaroo');
  const [sku, setSku] = useState('');
  const [department, setDepartment] = useState<'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS'>('MEN');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [has3D, setHas3D] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [upperMaterial, setUpperMaterial] = useState('');
  const [soleMaterial, setSoleMaterial] = useState('');
  const [colorName, setColorName] = useState('Standard');
  const [colorHex, setColorHex] = useState('#222222');

  // Edit product fields
  const [editTitle, setEditTitle] = useState('');
  const [editBrand, setEditBrand] = useState('Walkaroo');
  const [editDepartment, setEditDepartment] = useState<'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS'>('MEN');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHas3D, setEditHas3D] = useState(false);

  // Quick price fixing fields
  const [quickPrice, setQuickPrice] = useState('');
  const [quickOriginalPrice, setQuickOriginalPrice] = useState('');

  // Sizes & Availability management fields
  const [isSizesModalOpen, setIsSizesModalOpen] = useState(false);
  const [sizeEditingProduct, setSizeEditingProduct] = useState<Product | null>(null);
  const [editingSizes, setEditingSizes] = useState<Array<{ size: string; inventory: number }>>([]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.admin.getProducts().catch(() => api.products.getAll({ limit: 1000 }).then((r) => r.products)),
        api.categories.getAll(),
      ]);
      setProducts(prodRes);
      setCategories(catRes);
      if (catRes.length > 0 && !categoryId) setCategoryId(catRes[0].id);
    } catch (e) {
      console.error('Error loading products', e);
      showNotification('error', 'Failed to load catalog data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async () => {
    setIsReviewsLoading(true);
    try {
      const data = await api.reviews.getAll();
      setReviews(data);
    } catch (e) {
      console.error('Error loading reviews', e);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const loadBanners = async () => {
    try {
      const data = await api.admin.getBanners();
      setBanners(data || []);
    } catch (e) {
      console.error('Error loading banners', e);
    }
  };

  useEffect(() => {
    loadData();
    loadReviews();
    loadBanners();
  }, []);

  // Handlers for New Arrivals, Images, and Shares
  const handleToggleNewArrival = async (p: Product) => {
    try {
      const res = await api.admin.toggleNewArrival(p.id);
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, isNewArrival: res.isNewArrival } : item))
      );
      showNotification(
        'success',
        `Product "${p.title}" ${res.isNewArrival ? 'marked as New Arrival ⭐' : 'removed from New Arrivals'}.`
      );
    } catch (e) {
      showNotification('error', 'Failed to toggle New Arrival status.');
    }
  };

  const handleOpenShareModal = (p: Product) => {
    setSharingProduct(p);
    setIsShareModalOpen(true);
  };

  const handleOpenImageModal = (p: Product) => {
    setImageEditingProduct(p);
    setIsImageModalOpen(true);
  };

  const handleProductImageSuccess = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item))
    );
    showNotification('success', `Picture updated for "${updatedProduct.title}"!`);
  };

  // Banner CRUD handlers
  const handleOpenCreateBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImageUrl('');
    setBannerLinkUrl('/shop');
    setBannerBgColor('#5B21B6');
    setBannerTextColor('#FFFFFF');
    setBannerIsActive(true);
    setBannerType('OFFER');
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setEditingBanner(b);
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle || '');
    setBannerImageUrl(b.imageUrl || '');
    setBannerLinkUrl(b.linkUrl || '/shop');
    setBannerBgColor(b.bgColor || '#5B21B6');
    setBannerTextColor(b.textColor || '#FFFFFF');
    setBannerIsActive(b.isActive);
    setBannerType(b.type || 'OFFER');
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) {
      showNotification('error', 'Banner title is required.');
      return;
    }
    try {
      const payload: Partial<Banner> = {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        imageUrl: bannerImageUrl,
        linkUrl: bannerLinkUrl,
        bgColor: bannerBgColor,
        textColor: bannerTextColor,
        isActive: bannerIsActive,
        type: bannerType,
      };

      if (editingBanner) {
        const updated = await api.admin.updateBanner(editingBanner.id, payload);
        setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        showNotification('success', 'Offer banner updated successfully!');
      } else {
        const created = await api.admin.createBanner(payload);
        setBanners((prev) => [created, ...prev]);
        showNotification('success', 'New offer banner created and live on storefront!');
      }
      setIsBannerModalOpen(false);
    } catch (e: any) {
      showNotification('error', e?.message || 'Failed to save offer banner.');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to remove this promotional banner from the storefront?')) return;
    try {
      await api.admin.deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showNotification('success', 'Offer banner removed from storefront.');
    } catch {
      showNotification('error', 'Failed to delete banner.');
    }
  };

  const handleToggleBannerStatus = async (b: Banner) => {
    try {
      const updated = await api.admin.updateBanner(b.id, { isActive: !b.isActive });
      setBanners((prev) => prev.map((item) => (item.id === b.id ? updated : item)));
      showNotification('success', `Banner status changed to ${updated.isActive ? 'Active' : 'Draft'}.`);
    } catch {
      showNotification('error', 'Failed to update banner status.');
    }
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchTitle && !matchSku && !matchBrand) return false;
      }
      // Department
      if (departmentFilter !== 'ALL' && p.department !== departmentFilter) {
        return false;
      }
      // Brand
      if (brandFilter !== 'ALL' && p.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
      // Stock
      const isOut = p.variants && p.variants.length > 0
        ? p.variants.every((v) => v.inventory <= 0)
        : false;
      if (stockFilter === 'IN_STOCK' && isOut) return false;
      if (stockFilter === 'OUT_OF_STOCK' && !isOut) return false;

      return true;
    });
  }, [products, searchQuery, departmentFilter, brandFilter, stockFilter]);

  // Paginated Products
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, departmentFilter, brandFilter, stockFilter]);

  // Toggle In-Stock / Out-of-Stock
  const handleToggleStock = async (product: Product) => {
    const isCurrentlyOut = product.variants && product.variants.length > 0
      ? product.variants.every((v) => v.inventory <= 0)
      : false;
    const targetIsOut = !isCurrentlyOut;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== product.id) return p;
        const newVariants = (p.variants || []).map((v) => ({
          ...v,
          inventory: targetIsOut ? 0 : 15,
        }));
        return { ...p, variants: newVariants };
      })
    );

    try {
      await api.admin.toggleStock(product.id, targetIsOut);
      showNotification(
        'success',
        `${product.sku} is now marked ${targetIsOut ? 'OUT OF STOCK' : 'IN STOCK'}`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update stock status.');
      loadData(); // Revert
    }
  };

  // Quick Price Fixing
  const handleOpenPriceModal = (p: Product) => {
    setPriceEditingProduct(p);
    setQuickPrice(String(p.price));
    setQuickOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setIsPriceModalOpen(true);
  };

  const handleSaveQuickPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceEditingProduct) return;
    try {
      const pNum = parseFloat(quickPrice);
      const mrpNum = quickOriginalPrice ? parseFloat(quickOriginalPrice) : undefined;
      const discount = mrpNum && mrpNum > pNum ? Math.round(((mrpNum - pNum) / mrpNum) * 100) : 0;

      await api.admin.quickUpdatePrice(priceEditingProduct.id, {
        price: pNum,
        originalPrice: mrpNum,
        discountPercent: discount,
      });

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== priceEditingProduct.id) return p;
          return {
            ...p,
            price: pNum,
            originalPrice: mrpNum || null,
            discountPercent: discount,
          };
        })
      );

      setIsPriceModalOpen(false);
      showNotification(
        'success',
        `Price updated for ${priceEditingProduct.sku}: Selling Price ₹${pNum}, MRP ₹${mrpNum || pNum} (${discount}% OFF)`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update price.');
    }
  };

  // Open Manage Sizes Modal
  const handleOpenSizesModal = (p: Product) => {
    setSizeEditingProduct(p);
    const existingSizes = (p.variants || []).map((v) => ({
      size: v.size,
      inventory: v.inventory,
    }));
    if (existingSizes.length === 0) {
      setEditingSizes([
        { size: 'UK 6', inventory: 15 },
        { size: 'UK 7', inventory: 15 },
        { size: 'UK 8', inventory: 15 },
        { size: 'UK 9', inventory: 15 },
        { size: 'UK 10', inventory: 15 },
      ]);
    } else {
      setEditingSizes(existingSizes);
    }
    setIsSizesModalOpen(true);
  };

  // 1-Click Toggle for a single size from the table
  const handleToggleSingleSize = async (p: Product, sizeName: string, isCurrentlyAvailable: boolean) => {
    const targetOut = isCurrentlyAvailable; // If available, mark out of stock
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== p.id) return prod;
        const newVars = (prod.variants || []).map((v) =>
          v.size === sizeName ? { ...v, inventory: targetOut ? 0 : 15 } : v
        );
        return { ...prod, variants: newVars };
      })
    );
    try {
      await api.admin.toggleSizeStock(p.id, sizeName, targetOut);
      showNotification(
        'success',
        `${p.sku} size ${sizeName} is now marked ${targetOut ? 'OUT OF STOCK' : 'IN STOCK'}`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle size stock.');
      loadData();
    }
  };

  // Save Sizes & Stock from Modal
  const handleSaveSizes = async () => {
    if (!sizeEditingProduct) return;
    try {
      const updated = await api.admin.updateSizes(sizeEditingProduct.id, editingSizes);
      setProducts((prev) => prev.map((p) => (p.id === sizeEditingProduct.id ? updated : p)));
      setIsSizesModalOpen(false);
      showNotification('success', `Sizes and availability updated for ${sizeEditingProduct.sku}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update sizes.');
    }
  };

  const handleToggleEditingSizeAvailability = (index: number) => {
    setEditingSizes((prev) =>
      prev.map((s, idx) =>
        idx === index ? { ...s, inventory: s.inventory > 0 ? 0 : 15 } : s
      )
    );
  };

  const handleSizeNameChange = (index: number, newName: string) => {
    setEditingSizes((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, size: newName } : s))
    );
  };

  const handleSizeInventoryChange = (index: number, newInv: number) => {
    setEditingSizes((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, inventory: Math.max(0, newInv) } : s))
    );
  };

  const handleRemoveSize = (index: number) => {
    setEditingSizes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddStandardSize = (sizeName: string) => {
    if (!editingSizes.some((s) => s.size === sizeName)) {
      setEditingSizes((prev) => [...prev, { size: sizeName, inventory: 15 }]);
    }
  };

  const handleMarkAllSizesInStock = () => {
    setEditingSizes((prev) => prev.map((s) => ({ ...s, inventory: 15 })));
  };

  const handleMarkAllSizesOutOfStock = () => {
    setEditingSizes((prev) => prev.map((s) => ({ ...s, inventory: 0 })));
  };

  // Open Edit Product Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditBrand(p.brand || 'Walkaroo');
    setEditDepartment(p.department || 'MEN');
    setEditCategoryId(p.categoryId || (categories[0]?.id || ''));
    setEditPrice(String(p.price));
    setEditOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setEditDescription(p.description || '');
    setEditHas3D(p.has3D);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const pNum = parseFloat(editPrice);
      const mrpNum = editOriginalPrice ? parseFloat(editOriginalPrice) : undefined;
      const calcDiscount =
        mrpNum && mrpNum > pNum ? Math.round(((mrpNum - pNum) / mrpNum) * 100) : 0;

      const updated = await api.admin.updateProduct(editingProduct.id, {
        title: editTitle,
        brand: editBrand,
        department: editDepartment,
        categoryId: editCategoryId,
        price: pNum,
        originalPrice: mrpNum || null,
        discountPercent: calcDiscount,
        description: editDescription,
        has3D: editHas3D,
      });

      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
      setIsEditModalOpen(false);
      showNotification(
        'success',
        `Product "${editTitle}" updated! Placed in ${editDepartment} > ${editBrand}.`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update product.');
    }
  };

  // Create Product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pNum = parseFloat(price);
      const mrpNum = originalPrice ? parseFloat(originalPrice) : undefined;
      const calcDiscount =
        mrpNum && mrpNum > pNum ? Math.round(((mrpNum - pNum) / mrpNum) * 100) : 0;

      const generatedSku = sku || `CSM-${Date.now().toString().slice(-6)}`;

      await api.admin.createProduct({
        title,
        brand,
        sku: generatedSku,
        department,
        categoryId: categoryId || categories[0]?.id,
        price: pNum,
        originalPrice: mrpNum,
        discountPercent: calcDiscount,
        description,
        has3D,
        videoUrl: videoUrl || undefined,
        upperMaterial: upperMaterial || 'Engineered Breathable Material',
        soleMaterial: soleMaterial || 'High-Abrasion Cushion Sole',
        media: [imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        variants: [
          { size: 'UK 6', colorName: colorName || 'Standard', colorHex: colorHex || '#222222', inventory: 15 },
          { size: 'UK 7', colorName: colorName || 'Standard', colorHex: colorHex || '#222222', inventory: 20 },
          { size: 'UK 8', colorName: colorName || 'Standard', colorHex: colorHex || '#222222', inventory: 25 },
          { size: 'UK 9', colorName: colorName || 'Standard', colorHex: colorHex || '#222222', inventory: 20 },
          { size: 'UK 10', colorName: colorName || 'Standard', colorHex: colorHex || '#222222', inventory: 15 },
        ],
      });

      setIsModalOpen(false);
      showNotification('success', `Product "${title}" published successfully!`);
      loadData();
      // Reset
      setTitle('');
      setSku('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create product.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from the catalog?')) {
      try {
        await api.admin.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification('success', 'Product removed from catalog.');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to delete product.');
      }
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to permanently delete this customer review?')) {
      try {
        await api.reviews.delete(reviewId);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        showNotification('success', 'Customer review deleted and product ratings recalculated.');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to delete review.');
      }
    }
  };

  // Filtered Reviews Memo
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (reviewRatingFilter !== 'ALL' && r.rating !== reviewRatingFilter) {
        return false;
      }
      if (reviewSearch.trim()) {
        const q = reviewSearch.toLowerCase();
        const matchUser = (r.userName || '').toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchComment = (r.comment || '').toLowerCase().includes(q);
        const matchProd = (r.product?.title || '').toLowerCase().includes(q);
        const matchSku = (r.product?.sku || '').toLowerCase().includes(q);
        if (!matchUser && !matchTitle && !matchComment && !matchProd && !matchSku) return false;
      }
      return true;
    });
  }, [reviews, reviewRatingFilter, reviewSearch]);

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-10 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-purple-200/60 gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#5B21B6] text-white text-[10px] font-black uppercase tracking-wider">
                  Admin Portal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Chandhana Store Operations
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Catalog Management, MRP & Price Calibration, Stock Toggle & Public Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (products.length > 0) {
                  setSelected3DProduct(products[0]);
                  setIs3DStudioOpen(true);
                }
              }}
              className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#FAF7FD] hover:bg-[#EDE9FE] text-[#5B21B6] font-bold text-xs flex items-center gap-1.5 border border-purple-200 shadow-xs transition-all cursor-pointer"
              title="Launch 3D Footwear Asset Studio"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>3D Model Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B21B6] font-bold text-xs flex items-center gap-1.5 border border-purple-200 shadow-xs transition-all cursor-pointer"
              title="Generate & Print Store QR Code"
            >
              <QrCode className="w-4 h-4 text-[#7C3AED]" />
              <span>Store QR</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 sm:py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Footwear Style</span>
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center justify-between animate-in fade-in duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`px-3 sm:px-5 py-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-[#5B21B6] text-[#5B21B6] bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-3 sm:px-5 py-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'banners'
                ? 'border-[#5B21B6] text-[#5B21B6] bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offer Banners ({banners.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3 sm:px-5 py-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#5B21B6] text-[#5B21B6] bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: FOOTWEAR CATALOG MANAGEMENT (555 items)
           ======================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by SKU (e.g. 871, 102), Product Title, or Brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Department Filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                >
                  <option value="ALL">All Departments</option>
                  <option value="MEN">Men's Footwear</option>
                  <option value="WOMEN">Women's Footwear</option>
                  <option value="KIDS">Kids' Footwear</option>
                  <option value="SLIPPERS_SANDALS">Slippers & Sandals</option>
                </select>

                {/* Brand Filter */}
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                >
                  <option value="ALL">All Brands ({ALL_BRANDS.length})</option>
                  {ALL_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* Stock Status Filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                >
                  <option value="ALL">All Stock</option>
                  <option value="IN_STOCK">In Stock Only</option>
                  <option value="OUT_OF_STOCK">Out of Stock Only</option>
                </select>

                <span className="text-[11px] font-bold text-slate-500 pl-1">
                  Showing {filteredProducts.length} items
                </span>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-xs border border-purple-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7FD] text-slate-700 uppercase font-bold text-[11px] border-b border-purple-100">
                    <tr>
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-3">SKU</th>
                      <th className="py-3.5 px-3">Dept & Category</th>
                      <th className="py-3.5 px-3">Price & Official MRP</th>
                      <th className="py-3.5 px-3">Sizes & Availability</th>
                      <th className="py-3.5 px-3 text-center">Live Stock Control</th>
                      <th className="py-3.5 px-3">3D Viewer</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No footwear items match your search or filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((p) => {
                        const isOutOfStock =
                          p.variants && p.variants.length > 0
                            ? p.variants.every((v) => v.inventory <= 0)
                            : false;

                        return (
                          <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                            {/* Product thumbnail + Title */}
                            <td className="py-3 px-4 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenImageModal(p)}
                                className="relative group/thumb shrink-0 border-none bg-transparent p-0 cursor-pointer"
                                title="Click to Change Product Picture (Gallery / Files)"
                              >
                                <img
                                  src={p.media?.[0]?.url || p.variants?.[0]?.imageUrl || '/shop/shoe_placeholder.png'}
                                  alt={p.title}
                                  className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-100 group-hover/thumb:opacity-75 transition"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                                  <ImageIcon className="w-4 h-4 text-white" />
                                </div>
                              </button>
                              <div className="min-w-0 max-w-xs">
                                <span
                                  className="font-bold text-slate-900 block truncate"
                                  title={p.title}
                                >
                                  {p.title}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                                    {p.brand}
                                  </span>
                                  {p.isNewArrival && (
                                    <span className="text-[9px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                                      <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> New
                                    </span>
                                  )}
                                  {p.rating > 0 && (
                                    <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                                      ★ {p.rating} ({p.reviewCount})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* SKU */}
                            <td className="py-3 px-3 font-mono font-bold text-slate-600 text-[11px]">
                              {p.sku}
                            </td>

                            {/* Department & Category */}
                            <td className="py-3 px-3">
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold block w-fit mb-1">
                                {p.department}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[130px]">
                                {p.category?.name || 'Catalog Footwear'}
                              </span>
                            </td>

                            {/* Price, MRP & Discount */}
                            <td className="py-3 px-3">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-black text-slate-900 text-sm">
                                  ₹{p.price.toLocaleString('en-IN')}
                                </span>
                                {p.originalPrice && p.originalPrice > p.price && (
                                  <span className="text-[11px] text-slate-400 line-through">
                                    ₹{p.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              {p.discountPercent > 0 && (
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                                  {p.discountPercent}% OFF
                                </span>
                              )}
                            </td>

                            {/* Available Sizes & Stock Toggle Column */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 flex-wrap max-w-[170px]">
                                {p.variants && p.variants.length > 0 ? (
                                  p.variants.map((v) => {
                                    const isAvail = v.inventory > 0;
                                    return (
                                      <button
                                        key={v.id || v.size}
                                        type="button"
                                        onClick={() => handleToggleSingleSize(p, v.size, isAvail)}
                                        className={`text-[9.5px] px-1.5 py-0.5 rounded font-black border transition-all cursor-pointer ${
                                          isAvail
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200 line-through opacity-75 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200'
                                        }`}
                                        title={`${v.size}: ${isAvail ? `In Stock (${v.inventory})` : 'Out of Stock'}. Click to toggle!`}
                                      >
                                        {v.size} {isAvail ? '✓' : '✕'}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <span className="text-[10px] text-slate-400">Standard</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenSizesModal(p)}
                                className="text-[10px] text-[#5B21B6] hover:underline font-bold mt-1 flex items-center gap-0.5 cursor-pointer border-none bg-transparent p-0"
                              >
                                <Ruler className="w-2.5 h-2.5" /> Manage Sizes
                              </button>
                            </td>

                            {/* 1-Click In-Stock / Out-of-Stock Toggle */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleStock(p)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer border flex items-center justify-center gap-1 mx-auto ${
                                  isOutOfStock
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                }`}
                                title="Click to toggle In-Stock / Out-of-Stock"
                              >
                                {isOutOfStock ? (
                                  <>
                                    <AlertCircle className="w-3 h-3 text-rose-600" />
                                    <span>Out of Stock (0)</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>In Stock</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* 3D Model Status */}
                            <td className="py-3 px-3">
                              {p.has3D ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected3DProduct(p);
                                    setIs3DStudioOpen(true);
                                  }}
                                  className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold px-2 py-1 rounded-full border border-purple-200 flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Configure 3D Model"
                                >
                                  <Sparkles className="w-3 h-3 text-purple-600" />
                                  <span>3D ACTIVE</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelected3DProduct(p);
                                    setIs3DStudioOpen(true);
                                  }}
                                  className="text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold px-2 py-1 rounded-full border-none flex items-center gap-1 cursor-pointer"
                                  title="Add 3D Model"
                                >
                                  <span>+ 3D Model</span>
                                </button>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* Share Product / New Arrival */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenShareModal(p)}
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors border-none bg-transparent cursor-pointer"
                                  title="Share Product on WhatsApp / Customer Link"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>

                                {/* Change Catalog Picture from Gallery / Camera */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenImageModal(p)}
                                  className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors border-none bg-transparent cursor-pointer"
                                  title="Change Catalog Picture (Gallery / Files)"
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </button>

                                {/* Toggle New Arrival */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleNewArrival(p)}
                                  className={`p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer ${
                                    p.isNewArrival
                                      ? 'text-amber-500 hover:bg-amber-50'
                                      : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50/50'
                                  }`}
                                  title={p.isNewArrival ? 'New Arrival Active (Click to remove)' : 'Mark as New Arrival'}
                                >
                                  <Sparkles className={`w-4 h-4 ${p.isNewArrival ? 'fill-amber-500' : ''}`} />
                                </button>

                                {/* Manage Sizes & Stock */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenSizesModal(p)}
                                  className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors border-none bg-transparent cursor-pointer"
                                  title="Manage Sizes & Availability"
                                >
                                  <Ruler className="w-4 h-4" />
                                </button>

                                {/* Quick Price Fixing */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenPriceModal(p)}
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors border-none bg-transparent cursor-pointer"
                                  title="Quick Fix Price & MRP"
                                >
                                  <Tag className="w-4 h-4" />
                                </button>

                                {/* Edit Product (Category, Brand, Dept, Price) */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-1.5 rounded-lg text-[#5B21B6] hover:bg-[#FAF7FD] transition-colors border-none bg-transparent cursor-pointer"
                                  title="Edit Product Details & Category"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {/* Delete Product */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-none bg-transparent cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProducts.length} products total)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-black text-slate-700 px-2">
                      {currentPage}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROMOTIONAL BANNERS & OFFERS MANAGEMENT
           ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  Storefront Promotional Banners &amp; Offers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish real-time offer banners, festive sale slides &amp; special discounts directly on the customer homepage
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateBanner}
                className="px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer Banner</span>
              </button>
            </div>

            {/* Banners Grid */}
            {banners.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-purple-100 space-y-3">
                <Tag className="w-10 h-10 text-purple-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No promotional banners yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Create your first promotional offer banner to showcase festive discounts, new arrivals, or brand offers to customers.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateBanner}
                  className="px-4 py-2 rounded-xl bg-[#5B21B6] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Banner</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                  >
                    {/* Visual Banner Preview */}
                    <div
                      className="p-5 relative min-h-[140px] flex flex-col justify-between overflow-hidden"
                      style={{
                        backgroundColor: banner.bgColor || '#5B21B6',
                        color: banner.textColor || '#FFFFFF',
                      }}
                    >
                      {banner.imageUrl && (
                        <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden pointer-events-none opacity-50">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="relative z-10 space-y-1">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs inline-block">
                          {banner.type || 'OFFER'}
                        </span>
                        <h4 className="font-black text-lg leading-snug drop-shadow-xs line-clamp-1">
                          {banner.title}
                        </h4>
                        {banner.subtitle && (
                          <p className="text-xs opacity-90 line-clamp-2 drop-shadow-xs">
                            {banner.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="relative z-10 pt-2 flex items-center justify-between text-[11px] opacity-80 font-mono">
                        <span>Link: {banner.linkUrl || '/shop'}</span>
                      </div>
                    </div>

                    {/* Banner Card Controls */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                      {/* Active Status Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerStatus(banner)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                          banner.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{banner.isActive ? 'Live on Storefront' : 'Draft / Inactive'}</span>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditBanner(banner)}
                          className="p-1.5 rounded-lg text-[#5B21B6] hover:bg-purple-100 transition cursor-pointer"
                          title="Edit Banner Content & Colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: CUSTOMER REVIEWS MODERATION & DELETION
           ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Filter & Search Bar for Reviews */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reviews by customer name, product title, SKU, or comment text..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={String(reviewRatingFilter)}
                  onChange={(e) =>
                    setReviewRatingFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))
                  }
                  className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                >
                  <option value="ALL">All Star Ratings</option>
                  <option value="5">5 Stars Only</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <span className="text-xs font-bold text-slate-500">
                  {filteredReviews.length} Reviews
                </span>
              </div>
            </div>

            {/* Reviews List */}
            {isReviewsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#5B21B6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center text-slate-400 shadow-xs border border-purple-100">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">No customer reviews found.</p>
                <p className="text-xs text-slate-400">
                  Public reviews submitted by visitors or customers will appear here for admin moderation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-white shadow-xs border border-purple-100/80 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {rev.product?.media?.[0]?.url && (
                            <img
                              src={rev.product.media[0].url}
                              alt={rev.product.title}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-50 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 block truncate">
                              {rev.product?.title || 'Footwear Product'}
                            </span>
                            <span className="text-[10px] text-purple-700 font-bold block">
                              SKU: {rev.product?.sku} • {rev.product?.brand}
                            </span>
                          </div>
                        </div>

                        {/* Delete Review Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border-none bg-transparent cursor-pointer shrink-0"
                          title="Delete / Remove this review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Review Content */}
                      <div className="pt-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900">{rev.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>

                    {/* Review Author Footer */}
                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800">
                        👤 {rev.userName || 'Public Visitor'}
                      </span>
                      {rev.verified && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODAL 1: QUICK PRICE & MRP FIXING
           ======================================================== */}
        {isPriceModalOpen && priceEditingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 space-y-4 shadow-2xl border-none animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Fix Price & Catalog MRP
                  </h3>
                  <p className="text-xs text-slate-500 truncate max-w-xs">
                    {priceEditingProduct.title} (SKU: {priceEditingProduct.sku})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPriceModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveQuickPrice} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quickPrice}
                    onChange={(e) => setQuickPrice(e.target.value)}
                    className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 font-bold text-base border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold block">
                    Official Catalog MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickOriginalPrice}
                    onChange={(e) => setQuickOriginalPrice(e.target.value)}
                    placeholder="e.g. Printed MRP from catalog"
                    className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 font-bold text-base border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>

                {quickOriginalPrice && parseFloat(quickOriginalPrice) > parseFloat(quickPrice) && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-800 font-bold">Calculated Discount:</span>
                    <span className="font-black text-emerald-700 text-sm">
                      {Math.round(
                        ((parseFloat(quickOriginalPrice) - parseFloat(quickPrice)) /
                          parseFloat(quickOriginalPrice)) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPriceModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl shadow-md border-none cursor-pointer"
                  >
                    Save Price Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 1B: MANAGE SIZES & AVAILABILITY
           ======================================================== */}
        {isSizesModalOpen && sizeEditingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="max-w-md sm:max-w-lg w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl border-none animate-in zoom-in-95 duration-200 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#5B21B6]" />
                    <span>Manage Sizes & Stock Availability</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-sm mt-0.5">
                    {sizeEditingProduct.title} (SKU: {sizeEditingProduct.sku})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizesModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-slate-700">Configured Sizes ({editingSizes.length}):</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleMarkAllSizesInStock}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    All In Stock
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkAllSizesOutOfStock}
                    className="text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    All Out of Stock
                  </button>
                </div>
              </div>

              {/* Sizes List with Live Toggles */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {editingSizes.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                    No sizes added yet. Use the standard size buttons below to add sizes.
                  </div>
                ) : (
                  editingSizes.map((sItem, idx) => {
                    const isAvail = sItem.inventory > 0;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={sItem.size}
                            onChange={(e) => handleSizeNameChange(idx, e.target.value)}
                            className="w-22 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-900"
                            placeholder="e.g. UK 7"
                          />
                          <span className="text-[11px] text-slate-500 font-medium">
                            Stock:
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={sItem.inventory}
                            onChange={(e) => handleSizeInventoryChange(idx, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 text-center"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* 1-Click Toggle Available / Out of Stock */}
                          <button
                            type="button"
                            onClick={() => handleToggleEditingSizeAvailability(idx)}
                            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer border flex items-center gap-1 ${
                              isAvail
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {isAvail ? 'In Stock (Available)' : 'Out of Stock (0)'}
                          </button>

                          {/* Delete Size */}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer border-none bg-transparent"
                            title="Remove this size"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Add Size Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">Quick Add Standard Size:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map((stdSize) => {
                    const alreadyHas = editingSizes.some((s) => s.size === stdSize);
                    if (alreadyHas) return null;
                    return (
                      <button
                        key={stdSize}
                        type="button"
                        onClick={() => handleAddStandardSize(stdSize)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#5B21B6] hover:bg-purple-100 border border-purple-200 cursor-pointer"
                      >
                        + {stdSize}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Changes */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSizesModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSizes}
                  className="px-5 py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl shadow-md border-none cursor-pointer"
                >
                  Save Size Availability
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: EDIT PRODUCT (CATEGORY, BRAND, DEPT, 3D)
           ======================================================== */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 my-8 shadow-2xl border-none animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Edit Footwear Item
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: {editingProduct.sku}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>

                {/* Brand & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Brand *</label>
                    <select
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    >
                      {ALL_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Department *</label>
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value as any)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    >
                      <option value="MEN">Men's Footwear</option>
                      <option value="WOMEN">Women's Footwear</option>
                      <option value="KIDS">Kids' Footwear</option>
                      <option value="SLIPPERS_SANDALS">Slippers & Sandals</option>
                    </select>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">
                    Product Category Placement *
                  </label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing: Selling Price & MRP */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Selling Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 font-bold border border-slate-200 focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Original MRP (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 font-bold border border-slate-200 focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Description</label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                  />
                </div>

                {/* 3D Model Toggle */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editHas3D}
                      onChange={(e) => setEditHas3D(e.target.checked)}
                      className="rounded text-[#5B21B6] focus:ring-[#5B21B6] w-4 h-4 cursor-pointer"
                    />
                    <span>Enable Interactive 3D WebGL Inspection Viewer</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl shadow-md border-none cursor-pointer"
                  >
                    Save Changes & Update Live Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: ADD NEW PRODUCT
           ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 space-y-4 my-8 shadow-2xl border-none animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">Add New Footwear Style</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Walkaroo Men's Ultra Comfort Slide"
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Brand *</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    >
                      {ALL_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">SKU / Model Number</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. WL-901 or SM-871"
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    >
                      <option value="MEN">Men's Footwear</option>
                      <option value="WOMEN">Women's Footwear</option>
                      <option value="KIDS">Kids' Footwear</option>
                      <option value="SLIPPERS_SANDALS">Slippers & Sandals</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Selling Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="499"
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 font-bold border border-slate-200 focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Original MRP (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="699"
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 font-bold border border-slate-200 focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">
                      Product Picture (Gallery Upload or Image Link)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... or choose file from gallery"
                        className="flex-1 w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6] text-xs"
                      />
                      <label className="shrink-0 px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B21B6] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = async () => {
                                try {
                                  const res = await api.admin.uploadImage({
                                    image: reader.result as string,
                                    filename: file.name,
                                  });
                                  setImageUrl(res.url);
                                  showNotification('success', 'Image uploaded from device!');
                                } catch (err: any) {
                                  showNotification('error', err?.message || 'Failed to upload image.');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {imageUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={imageUrl}
                          alt="Thumbnail preview"
                          className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-0.5"
                        />
                        <span className="text-[11px] text-emerald-600 font-bold">✓ Picture preview ready</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Product Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe cushioning, materials, and intended usage..."
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border border-slate-200 font-medium focus:ring-2 focus:ring-[#5B21B6]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={has3D}
                        onChange={(e) => setHas3D(e.target.checked)}
                        className="rounded text-[#5B21B6] focus:ring-[#5B21B6] w-4 h-4 cursor-pointer"
                      />
                      <span>Enable Interactive 3D WebGL Inspection Viewer</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl shadow-md border-none cursor-pointer"
                  >
                    Publish Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 4: 3D MODEL STUDIO MODAL
           ======================================================== */}
        <Admin3DModelStudioModal
          isOpen={is3DStudioOpen}
          onClose={() => setIs3DStudioOpen(false)}
          product={selected3DProduct}
          onProductUpdated={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            showNotification('success', `3D model configuration saved for "${updated.title}"`);
          }}
        />

        {/* ========================================================
            MODAL 5: PROMOTIONAL OFFER BANNER CREATE / EDIT
           ======================================================== */}
        {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col">
              <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-white" />
                  <h3 className="font-black text-base">
                    {editingBanner ? 'Edit Promotional Banner' : 'Create New Offer Banner'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveBanner} className="p-5 overflow-y-auto space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Offer Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. Grand Festive Sale: Flat 20% Off!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Subtitle / Description</label>
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    placeholder="e.g. Valid on Walkaroo, Sparx, VKC Pride and Paragon footwear"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Storefront Destination Link</label>
                  <input
                    type="text"
                    value={bannerLinkUrl}
                    onChange={(e) => setBannerLinkUrl(e.target.value)}
                    placeholder="e.g. /shop, /slippers, or /shop?brand=Walkaroo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Banner Graphic (Gallery Upload or Image Link)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={bannerImageUrl}
                      onChange={(e) => setBannerImageUrl(e.target.value)}
                      placeholder="https://... or upload from gallery"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                    <label className="shrink-0 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B21B6] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async () => {
                              try {
                                const res = await api.admin.uploadImage({
                                  image: reader.result as string,
                                  filename: file.name,
                                });
                                setBannerImageUrl(res.url);
                                showNotification('success', 'Banner image uploaded from device!');
                              } catch {
                                showNotification('error', 'Failed to upload banner image.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bannerBgColor}
                        onChange={(e) => setBannerBgColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={bannerBgColor}
                        onChange={(e) => setBannerBgColor(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      {['#5B21B6', '#065F46', '#991B1B', '#1E293B', '#EA580C', '#9D174D'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBannerBgColor(c)}
                          className="w-5 h-5 rounded-full border border-white shadow-xs cursor-pointer"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Status on Storefront</label>
                    <label className="flex items-center gap-2 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerIsActive}
                        onChange={(e) => setBannerIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-[#5B21B6]"
                      />
                      <span className="text-xs font-bold text-slate-800">
                        {bannerIsActive ? '✓ Active & Visible' : 'Draft / Hidden'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5">Live Preview:</p>
                  <div
                    className="p-4 rounded-2xl relative overflow-hidden shadow-xs min-h-[90px] flex flex-col justify-center"
                    style={{ backgroundColor: bannerBgColor, color: bannerTextColor }}
                  >
                    {bannerImageUrl && (
                      <img
                        src={bannerImageUrl}
                        alt="Preview"
                        className="absolute right-0 top-0 bottom-0 w-1/3 object-cover opacity-50 pointer-events-none"
                      />
                    )}
                    <div className="relative z-10">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 inline-block mb-1">
                        {bannerType}
                      </span>
                      <h5 className="font-black text-sm">{bannerTitle || 'Your Banner Title'}</h5>
                      <p className="text-[11px] opacity-80">{bannerSubtitle || 'Special offer subtitle'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsBannerModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {editingBanner ? 'Save Changes' : 'Publish Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 6: SHARE PRODUCT / NEW ARRIVAL MODAL
           ======================================================== */}
        <ProductShareModal
          product={sharingProduct}
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSharingProduct(null);
          }}
        />

        {/* ========================================================
            MODAL 7: CHANGE CATALOG PRODUCT PICTURE (GALLERY / URL)
           ======================================================== */}
        <ProductImageUploadModal
          product={imageEditingProduct}
          isOpen={isImageModalOpen}
          onClose={() => {
            setIsImageModalOpen(false);
            setImageEditingProduct(null);
          }}
          onSuccess={handleProductImageSuccess}
        />

        {/* ========================================================
            MODAL 8: STORE QR CODE SHARING MODAL
           ======================================================== */}
        <ShareQRModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
