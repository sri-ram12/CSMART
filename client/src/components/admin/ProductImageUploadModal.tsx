import React, { useState, useRef } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { X, Image as ImageIcon, Upload, Link as LinkIcon, Check, AlertCircle, Camera, RefreshCw } from 'lucide-react';

interface ProductImageUploadModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const ProductImageUploadModal: React.FC<ProductImageUploadModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !product) return null;

  const currentImage = product.media?.[0]?.url || product.variants?.[0]?.imageUrl || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Maximum size is 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    setError(null);
    try {
      let finalImageUrl = '';

      if (activeTab === 'upload') {
        if (!previewUrl) {
          setError('Please select an image file from your gallery or camera.');
          setIsUploading(false);
          return;
        }
        // Upload base64 image to server uploads directory
        const uploadRes = await api.admin.uploadImage({
          image: previewUrl,
          filename: selectedFile?.name || `${product.sku}_photo.jpg`,
        });
        finalImageUrl = uploadRes.url;
      } else {
        if (!imageUrlInput.trim()) {
          setError('Please enter a valid image URL.');
          setIsUploading(false);
          return;
        }
        finalImageUrl = imageUrlInput.trim();
      }

      // Update product image in database
      const updated = await api.admin.updateProductImage(product.id, finalImageUrl);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update product picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight leading-none">
                Change Catalog Product Picture
              </h3>
              <p className="text-purple-100 text-xs mt-1">
                Upload from Gallery, Camera or Enter Link
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
          {/* Target Product Info */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
              <img
                src={previewUrl || currentImage || '/shop/shoe_placeholder.png'}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider block">
                {product.brand} • {product.department}
              </span>
              <p className="font-bold text-xs text-slate-900 truncate">{product.title}</p>
              <p className="text-[11px] font-mono text-slate-500">SKU: {product.sku} • ₹{product.price}</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'upload' ? 'bg-white text-[#5B21B6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Gallery / Device File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === 'url' ? 'bg-white text-[#5B21B6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: File Upload / Gallery */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl p-6 text-center cursor-pointer transition-colors group"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-36 h-36 object-contain mx-auto rounded-xl bg-white shadow-xs p-2 border border-purple-100"
                    />
                    <p className="text-xs font-bold text-[#5B21B6]">Click to choose a different picture</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Choose picture from Phone Gallery or Camera
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports JPG, PNG, WEBP up to 10MB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-xl bg-[#5B21B6] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Browse Files / Gallery
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Direct Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Product Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/shoe-photo.jpg"
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
                />
              </div>

              {imageUrlInput && (
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                  <p className="text-[11px] font-bold text-slate-500 mb-2">Live Image Preview:</p>
                  <img
                    src={imageUrlInput}
                    alt="Preview"
                    className="w-32 h-32 object-contain mx-auto rounded-xl bg-white p-2 border border-slate-200"
                    onError={() => setError('Image failed to load from provided URL.')}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Picture...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Product Picture</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageUploadModal;

