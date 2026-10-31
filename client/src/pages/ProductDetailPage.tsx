import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { Shoe3DViewer } from '../components/3d/Shoe3DViewer';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { PinCodeChecker } from '../components/product/PinCodeChecker';
import { QualitySpecs } from '../components/product/QualitySpecs';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Ruler,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Film,
  Camera,
  Check,
  Share2,
  Phone,
} from 'lucide-react';
import { logWhatsAppEnquiry } from '../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Media Tab: '3d' | 'video' | 'gallery'
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video' | 'gallery'>('gallery');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Variant Selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Review Form
  const { user } = useAuth();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthorName, setReviewAuthorName] = useState(user?.name || '');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name && !reviewAuthorName) {
      setReviewAuthorName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    api.products
      .getBySlug(slug)
      .then((data) => {
        setProduct(data);
        if (Boolean(data.has3D)) {
          setActiveMediaTab('3d');
        } else if (data.videoUrl) {
          setActiveMediaTab('video');
        } else {
          setActiveMediaTab('gallery');
        }

        if (data.variants && data.variants.length > 0) {
          setSelectedSize(data.variants[0].size);
          setSelectedColor(data.variants[0].colorName);
        }
      })
      .catch((err) => {
        console.error('Failed to load product', err);
        setError('Product not found.');
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested footwear style might be out of catalog or renamed.
        </p>
        <Link to="/shop" className="btn-primary text-xs py-2.5 px-6 border-none shadow-md">
          Browse Footwear
        </Link>
      </div>
    );
  }

  // Find selected variant
  const currentVariant =
    product.variants?.find((v) => v.size === selectedSize && v.colorName === selectedColor) ||
    product.variants?.[0];

  const availableStock = currentVariant ? currentVariant.inventory : 10;
  const isOutOfStock = availableStock <= 0;

  // Unique sizes and colors
  const allSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const allColors = Array.from(
    new Map(product.variants?.map((v) => [v.colorName, v]) || []).values()
  );

  const isFavorite = isInWishlist(product.id);

  // 3D parsed config
  let modelConfig = { defaultColor: '#DC2626', accentColor: '#FFFFFF', soleColor: '#F8FAFC' };
  try {
    if (product.model3DConfig) {
      modelConfig = JSON.parse(product.model3DConfig);
    }
  } catch {}

  const handleColorChange = (newColorName: string) => {
    setSelectedColor(newColorName);
    if (product.variants && product.variants.length > 0) {
      const match = product.variants.find(
        (v) => v.colorName.toLowerCase() === newColorName.toLowerCase() && v.size === selectedSize && v.inventory > 0
      );
      if (!match) {
        const firstAvail = product.variants.find(
          (v) => v.colorName.toLowerCase() === newColorName.toLowerCase() && v.inventory > 0
        );
        if (firstAvail) {
          setSelectedSize(firstAvail.size);
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const unitPrice = product.price + (currentVariant?.priceAdjustment || 0);
    addToCart({
      productId: product.id,
      variantId: currentVariant?.id,
      title: product.title,
      sku: currentVariant?.sku || product.sku,
      size: selectedSize || 'Standard',
      colorName: selectedColor || 'Standard',
      colorHex: currentVariant?.colorHex || '#DC2626',
      imageUrl: currentVariant?.imageUrl || product.media?.[0]?.url || '',
      unitPrice,
      quantity,
      availableStock,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authorName = reviewAuthorName.trim() || user?.name || 'Verified Customer';
      await api.reviews.submit({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        userName: authorName,
      });
      setReviewSuccess(true);
      setReviewTitle('');
      setReviewComment('');
      // Reload product data
      const updated = await api.products.getBySlug(product.slug);
      setProduct(updated);
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  const whatsAppUrl = `https://wa.me/919553536884?text=${encodeURIComponent(
    `Hello Chandhana Shoe Mart (Tagarapuvalasa), I would like to inquire about ${product.title} (SKU: ${product.sku}, Size: ${selectedSize}, Color: ${selectedColor}, Price: ₹${product.price})`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/60 pt-6 pb-28 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/shop?department=${product.department}`}
            className="hover:text-red-600 transition-colors"
          >
            {product.department === 'SLIPPERS_SANDALS' ? 'Slippers & Sandals' : product.department}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Layout: Media Left, Purchase Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Media Stage (3D Viewer, Video Demo & Image Gallery) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Media Type Switcher Tabs - borderless pills (Scrollable on small mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl shadow-sm border-none w-full sm:max-w-fit overflow-x-auto shrink-0">
              {Boolean(product.has3D) && (
                <button
                  onClick={() => setActiveMediaTab('3d')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap shrink-0 ${
                    activeMediaTab === '3d'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Interactive Inspection</span>
                </button>
              )}

              {product.videoUrl && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap shrink-0 ${
                    activeMediaTab === 'video'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Footwear Video Demo</span>
                </button>
              )}

              <button
                onClick={() => setActiveMediaTab('gallery')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer whitespace-nowrap shrink-0 ${
                  activeMediaTab === 'gallery'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Multi-Angle Photos</span>
              </button>
            </div>

            {/* Display Stage */}
            <div className="relative">
              {activeMediaTab === '3d' && (
                <div className="bg-white rounded-3xl shadow-sm border-none overflow-hidden p-2">
                  <Shoe3DViewer
                    product={product}
                    primaryColor={currentVariant?.colorHex || modelConfig.defaultColor}
                    accentColor={modelConfig.accentColor}
                    soleColor={modelConfig.soleColor}
                    onColorChange={(hex, name) => {
                      const match = product.variants?.find(
                        (v) =>
                          v.colorHex.toLowerCase() === hex.toLowerCase() ||
                          (name && v.colorName.toLowerCase() === name.toLowerCase())
                      );
                      if (match) {
                        handleColorChange(match.colorName);
                      }
                    }}
                    height="h-[360px] sm:h-[420px] md:h-[480px]"
                  />
                </div>
              )}

              {activeMediaTab === 'video' && product.videoUrl && (
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-lg border-none">
                  <video
                    src={product.videoUrl}
                    poster={product.videoPoster || product.media?.[0]?.url}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {activeMediaTab === 'gallery' && (
                <div className="space-y-4">
                  {/* Main High-Res Viewer */}
                  <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm border-none flex items-center justify-center p-6">
                    <img
                      src={
                        product.media?.[activeImageIdx]?.url ||
                        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'
                      }
                      alt={product.title}
                      className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-300"
                    />

                    {product.discountPercent > 0 && (
                      <span className="absolute top-5 left-5 bg-red-600 text-white font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full shadow-md border-none">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {product.media && product.media.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {product.media.map((m, idx) => (
                        <button
                          key={m.id || idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-none transition-all p-1 bg-white cursor-pointer ${
                            activeImageIdx === idx
                              ? 'ring-2 ring-red-600 scale-105 shadow-md'
                              : 'ring-1 ring-slate-200 opacity-80 hover:opacity-100 hover:ring-slate-300'
                          }`}
                        >
                          <img
                            src={m.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="text-red-600 font-extrabold uppercase tracking-widest">
                  {product.brand}
                </span>
                <span className="font-mono text-slate-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Rating & reviews counter */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-slate-900 ml-1">{product.rating}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-medium">
                  {product.reviewCount} Verified Buyer Reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-white shadow-sm border-none space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-full border-none">
                    Save ₹{(product.originalPrice! - product.price).toLocaleString('en-IN')} (
                    {product.discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Inclusive of all taxes • Free express shipping on orders above ₹999
              </p>
            </div>

            {/* Colorway Selection */}
            {allColors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Colorway:{' '}
                    <span className="text-red-600 font-extrabold">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {allColors.map((col) => (
                    <button
                      key={col.colorName}
                      onClick={() => handleColorChange(col.colorName)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-none text-xs font-bold transition-all cursor-pointer ${
                        selectedColor === col.colorName
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-inner"
                        style={{ backgroundColor: col.colorHex }}
                      />
                      <span>{col.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection & Size Guide */}
            {allSizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Select Size (India / UK):{' '}
                    <span className="text-red-600 font-extrabold">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 border-none bg-transparent cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {allSizes.map((s) => {
                    const variant = product.variants?.find(
                      (v) => v.size === s && v.colorName === selectedColor
                    );
                    const stock = variant ? variant.inventory : 10;
                    const isAvailable = stock > 0;

                    return (
                      <button
                        key={s}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(s)}
                        className={`py-2.5 rounded-xl text-xs font-bold border-none transition-all text-center relative cursor-pointer ${
                          selectedSize === s
                            ? 'bg-red-600 text-white shadow-md font-black'
                            : isAvailable
                            ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 hover:ring-red-300 hover:bg-red-50/50'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Indicator */}
                <div className="text-[11px] pt-1 font-medium">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-bold">
                      Out of Stock in this combination
                    </span>
                  ) : availableStock <= 5 ? (
                    <span className="text-amber-600 font-bold">
                      ⚡ Hurry! Only {availableStock} left in stock
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-500 hover:text-red-600 text-sm border-none bg-transparent cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    className="p-2 text-slate-500 hover:text-red-600 text-sm border-none bg-transparent cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 btn-primary text-xs font-black py-3.5 flex items-center justify-center gap-2 border-none shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border-none transition-all shadow-sm cursor-pointer ${
                    isFavorite
                      ? 'bg-red-50 text-red-600 ring-1 ring-red-300'
                      : 'bg-white text-slate-500 hover:text-red-600 ring-1 ring-slate-200'
                  }`}
                  title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white text-slate-500 hover:text-red-600 ring-1 ring-slate-200 border-none shadow-sm transition-all cursor-pointer relative"
                  title="Share Footwear"
                >
                  <Share2 className="w-5 h-5" />
                  {isCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Primary CTA: WhatsApp Direct Order & Chat with Owner */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  logWhatsAppEnquiry({
                    customerName: 'Website Customer',
                    productId: product.id,
                    productTitle: product.title,
                    sku: product.sku,
                    brand: product.brand,
                    price: product.price,
                    imageUrl: product.media?.[0]?.url || product.variants?.[0]?.imageUrl,
                    size: selectedSize,
                    color: selectedColor,
                    message: `Inquiry for ${product.title} (SKU: ${product.sku}, Size: ${selectedSize}, Price: ₹${product.price})`,
                    source: 'PRODUCT_DETAIL',
                  });
                }}
                className="w-full py-4 text-xs sm:text-sm font-black flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg hover:shadow-xl active:scale-95 transition-all border-none cursor-pointer"
                title="Chat and Order with Owner on WhatsApp (9553536884)"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                <span>Chat & Order on WhatsApp with Owner</span>
              </a>

              {/* Direct Call Store */}
              <a
                href="tel:9553536884"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-50 text-[#5B21B6] hover:bg-purple-100 transition-all text-xs font-bold border-none"
              >
                <Phone className="w-4 h-4 text-[#5B21B6]" />
                <span>Call Store Owner: 9553536884</span>
              </a>
            </div>

            {/* PIN-code Delivery Estimator */}
            <PinCodeChecker />

            {/* Store Guarantee Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-[11px] text-slate-600 text-center font-medium">
              <div className="p-3 rounded-2xl bg-white shadow-sm border-none">
                <Truck className="w-4 h-4 text-red-600 mx-auto mb-1.5" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="p-3 rounded-2xl bg-white shadow-sm border-none">
                <RotateCcw className="w-4 h-4 text-red-600 mx-auto mb-1.5" />
                <span>7-Day Replacement</span>
              </div>
              <div className="p-3 rounded-2xl bg-white shadow-sm border-none">
                <ShieldCheck className="w-4 h-4 text-red-600 mx-auto mb-1.5" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quality, Materials & Technical Specifications Accordion */}
        <QualitySpecs product={product} />

        {/* Customer Reviews & Submit Review Form */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border-none space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Customer Reviews & Ratings</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rated <span className="font-extrabold text-slate-900">{product.rating}</span> out of 5 based on {product.reviewCount} verified customers
              </p>
            </div>
          </div>

          {/* Submit Review Box */}
          <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-slate-50 border-none space-y-4">
            <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Write a Verified Customer Review
            </h4>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
              <div className="flex gap-1 text-amber-500 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`w-5 h-5 ${
                      reviewRating >= star ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Reviewer Name and Review Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Full Name (e.g. Ramesh Kumar)"
                value={reviewAuthorName}
                onChange={(e) => setReviewAuthorName(e.target.value)}
                className="w-full bg-white px-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm"
              />
              <input
                type="text"
                required
                placeholder="Review Title (e.g. Incredibly lightweight and comfortable)"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full bg-white px-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm"
              />
            </div>

            <textarea
              required
              rows={3}
              placeholder="Describe your walking experience, fit accuracy, and cushioning..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-white p-4 rounded-xl text-xs text-slate-900 placeholder-slate-400 border-none ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm"
            />

            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary text-xs font-bold py-2.5 px-7 border-none shadow-md cursor-pointer">
                Submit Review
              </button>
              {reviewSuccess && (
                <span className="text-xs text-emerald-600 font-bold">
                  Thank you! Your review has been published.
                </span>
              )}
            </div>
          </form>

          {/* Existing Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50 border-none space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{rev.title}</span>
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 pt-1">
                    <span>{rev.userName}</span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No reviews yet. Be the first to review this footwear style!</p>
            )}
          </div>
        </div>

        {/* Related Footwear Carousel */}
        {product.related && product.related.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-black text-slate-900">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {product.related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Action Bar (Options & Checkout Always Clearly Visible on Small Devices) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-2.5 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold truncate">
              {selectedSize ? `Size: ${selectedSize}` : 'Pick a size'} • {selectedColor}
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 rounded-xl border-none transition-all shadow-sm shrink-0 cursor-pointer ${
              isFavorite
                ? 'bg-red-50 text-red-600 ring-1 ring-red-300'
                : 'bg-slate-100 text-slate-600'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 btn-primary text-xs font-black py-3 px-3 flex items-center justify-center gap-1.5 border-none shadow-md shrink-0 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        department={product.department}
      />
    </div>
  );
};

export default ProductDetailPage;
