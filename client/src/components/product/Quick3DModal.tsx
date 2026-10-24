import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ShoppingBag, ArrowRight, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { Shoe3DViewer } from '../3d/Shoe3DViewer';
import { useCart } from '../../context/CartContext';

interface Quick3DModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Quick3DModal: React.FC<Quick3DModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  // Extract 3D config
  let modelConfig = { defaultColor: '#DC2626', accentColor: '#FFFFFF', soleColor: '#F8FAFC' };
  try {
    if (product.model3DConfig) {
      modelConfig = JSON.parse(product.model3DConfig);
    }
  } catch {}

  const activeColorHex = selectedColor || modelConfig.defaultColor;

  const defaultVariant = product.variants?.[0] || {
    id: `${product.id}-v0`,
    sku: product.sku,
    size: 'UK 8',
    colorName: 'Standard',
    colorHex: '#000000',
    inventory: 10,
    priceAdjustment: 0,
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      sku: defaultVariant.sku,
      size: defaultVariant.size,
      colorName: defaultVariant.colorName,
      colorHex: activeColorHex,
      imageUrl: product.media?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      unitPrice: product.price,
      quantity: 1,
      availableStock: defaultVariant.inventory,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                360° Interactive 3D Showcase
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                {product.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border-none p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 bg-slate-50 rounded-2xl overflow-hidden p-2 relative shadow-inner">
            <Shoe3DViewer
              product={product}
              primaryColor={activeColorHex}
              accentColor={modelConfig.accentColor}
              soleColor={modelConfig.soleColor}
              onColorChange={(hex) => setSelectedColor(hex)}
              height="h-[320px] sm:h-[400px] md:h-[450px]"
            />
          </div>

          {/* Details & Fast Actions */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="text-red-600 font-extrabold uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount})</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {product.title}
              </h2>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Special Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
              {product.discountPercent > 0 && (
                <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Color variants selector for live 3D preview */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2">
                  Live Colorways (Tap to preview on 3D model)
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Map(product.variants.map((v) => [v.colorHex, v])).values()).map((v) => (
                    <button
                      key={v.colorHex}
                      onClick={() => setSelectedColor(v.colorHex)}
                      className={`border-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeColorHex.toLowerCase() === v.colorHex.toLowerCase()
                          ? 'bg-slate-900 text-white shadow-sm ring-2 ring-red-500 ring-offset-1'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/60"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className={`w-full py-3 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 border-none ${
                  addedSuccess ? 'bg-emerald-600 text-white' : 'btn-primary'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Quick Add to Cart
                  </>
                )}
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 border-none"
              >
                <span>View Full Product Details & Sizing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
