import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { X, Share2, Copy, Check, Download, ExternalLink, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface ProductShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.slug}`
    : `https://chandhanashoemart.com/product/${product.slug}`;

  const primaryImage = product.media?.[0]?.url || product.variants?.[0]?.imageUrl || '/shop/shoe_placeholder.png';

  const shareText = `✨ *New Arrival at Chandhana Shoe Mart!*
👟 *${product.brand}* - ${product.title}
💰 *Price: ₹${product.price}* ${product.originalPrice && product.originalPrice > product.price ? `(MRP: ₹${product.originalPrice})` : ''}
🏷️ *Brand:* ${product.brand}
📦 *Category:* ${product.category?.name || product.department}
👉 *View & Order Online:* ${productUrl}`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.brand} - ${product.title}`,
          text: `Check out ${product.brand} ${product.title} at Chandhana Shoe Mart for ₹${product.price}!`,
          url: productUrl,
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight leading-none">
                Share Product &amp; New Arrival
              </h3>
              <p className="text-purple-100 text-xs mt-1">
                Share to Customer Storefront, WhatsApp &amp; Social
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Visual Share Card Preview */}
          <div
            ref={cardRef}
            className="rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-amber-50/40 p-4 shadow-sm relative overflow-hidden"
          >
            {/* Store branding header inside card */}
            <div className="flex items-center justify-between border-b border-purple-100/80 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#5B21B6]">
                  Chandhana Shoe Mart
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                ✓ Authentic In Stock
              </span>
            </div>

            <div className="flex gap-3.5 items-center">
              {/* Product Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white border border-purple-100 overflow-hidden shrink-0 shadow-xs flex items-center justify-center p-1">
                <img
                  src={primaryImage}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Product Meta */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[#5B21B6] text-white text-[10px] font-black uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {product.isNewArrival && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-amber-600" /> New Arrival
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {product.title}
                </h4>

                <p className="text-[11px] text-slate-500 font-medium">
                  SKU: <span className="font-mono font-bold text-slate-700">{product.sku}</span> • {product.department}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-lg font-black text-slate-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-[10px] font-black text-emerald-600">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sizes Footer */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-purple-100/60 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-slate-500 font-bold">Sizes Available:</span>
                {product.variants.slice(0, 6).map((v) => (
                  <span
                    key={v.id}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      v.inventory > 0 ? 'bg-purple-100 text-[#5B21B6]' : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    {v.size}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Share Link Box */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="truncate text-slate-600 font-mono flex-1">{productUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-bold hover:text-[#5B21B6] transition cursor-pointer shrink-0 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Share via Phone App</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Full Formatted Product Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductShareModal;

