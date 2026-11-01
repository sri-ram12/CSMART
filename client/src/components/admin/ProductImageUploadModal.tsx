import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductMedia } from '../../types';
import { api } from '../../services/api';
import {
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Camera,
  RefreshCw,
  Trash2,
  Star,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface ProductImageUploadModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

interface QueuedFile {
  file: File;
  previewUrl: string;
}

export const ProductImageUploadModal: React.FC<ProductImageUploadModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mediaList, setMediaList] = useState<ProductMedia[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync media list when product opens
  useEffect(() => {
    if (product) {
      const existing = (product.media && product.media.length > 0)
        ? [...product.media].sort((a, b) => a.order - b.order)
        : product.variants?.[0]?.imageUrl
        ? [
            {
              id: 'initial-fallback',
              productId: product.id,
              url: product.variants[0].imageUrl,
              type: 'IMAGE' as const,
              order: 0,
            },
          ]
        : [];
      setMediaList(existing);
      setQueuedFiles([]);
      setImageUrlInput('');
      setError(null);
      setSuccessMsg(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Handle multiple file selection from device gallery or camera
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const validQueued: QueuedFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        setError(`File "${file.name}" is too large (max 15MB).`);
        return;
      }
      const preview = URL.createObjectURL(file);
      validQueued.push({ file, previewUrl: preview });
    });

    setQueuedFiles((prev) => [...prev, ...validQueued]);
  };

  const removeQueuedFile = (idx: number) => {
    setQueuedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Convert File to base64 Data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload queued files and add them to the product
  const handleUploadQueued = async () => {
    if (queuedFiles.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setUploadProgress(`Uploading 1 of ${queuedFiles.length} photos...`);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < queuedFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${queuedFiles.length} photos...`);
        const qf = queuedFiles[i];
        const dataUrl = await fileToDataUrl(qf.file);
        const res = await api.admin.uploadImage({
          image: dataUrl,
          filename: `${product.sku}_photo_${Date.now()}_${i}.jpg`,
        });
        uploadedUrls.push(res.url);
      }

      setUploadProgress('Saving photos to product...');
      const currentUrls = mediaList.map((m) => m.url);
      const allUrls = [...currentUrls, ...uploadedUrls];

      const updated = await api.admin.updateProductMedia(product.id, allUrls);
      setMediaList(updated.media || []);
      setQueuedFiles([]);
      setSuccessMsg(`Added ${uploadedUrls.length} photo(s) successfully!`);
      onSuccess(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload pictures. Please try again.');
    } finally {
      setIsProcessing(false);
      setUploadProgress('');
    }
  };

  // Add photo via Image URL
  const handleAddUrl = async () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      setError('Please enter a valid image URL.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const currentUrls = mediaList.map((m) => m.url);
      const allUrls = [...currentUrls, trimmed];

      const updated = await api.admin.updateProductMedia(product.id, allUrls);
      setMediaList(updated.media || []);
      setImageUrlInput('');
      setSuccessMsg('Photo added from URL successfully!');
      onSuccess(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to add image URL.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Set an image as primary / cover (moves to index 0)
  const handleSetPrimary = async (targetIdx: number) => {
    if (targetIdx === 0 || mediaList.length <= 1) return;

    setIsProcessing(true);
    setError(null);
    try {
      const reordered = [...mediaList];
      const [moved] = reordered.splice(targetIdx, 1);
      reordered.unshift(moved);

      const allUrls = reordered.map((m) => m.url);
      const updated = await api.admin.updateProductMedia(product.id, allUrls);
      setMediaList(updated.media || []);
      setSuccessMsg('Set as primary cover photo!');
      onSuccess(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to update primary photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reorder left / right
  const handleMovePhoto = async (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mediaList.length) return;

    setIsProcessing(true);
    setError(null);
    try {
      const reordered = [...mediaList];
      const temp = reordered[index];
      reordered[index] = reordered[targetIdx];
      reordered[targetIdx] = temp;

      const allUrls = reordered.map((m) => m.url);
      const updated = await api.admin.updateProductMedia(product.id, allUrls);
      setMediaList(updated.media || []);
      onSuccess(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to reorder photos.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete an existing photo from the product
  const handleDeletePhoto = async (index: number) => {
    if (mediaList.length <= 1) {
      setError('A product must have at least one picture.');
      return;
    }

    if (!window.confirm('Delete this photo from the product?')) return;

    setIsProcessing(true);
    setError(null);
    try {
      const remainingUrls = mediaList.filter((_, i) => i !== index).map((m) => m.url);
      const updated = await api.admin.updateProductMedia(product.id, remainingUrls);
      setMediaList(updated.media || []);
      setSuccessMsg('Photo removed successfully!');
      onSuccess(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base tracking-tight leading-none">
                  Product Photo Gallery Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 text-white">
                  {mediaList.length} {mediaList.length === 1 ? 'Pic' : 'Pics'}
                </span>
              </div>
              <p className="text-purple-100 text-xs mt-1">
                Manage multiple photos for {product.title} (SKU: {product.sku})
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 [scrollbar-width:thin]">
          {/* Notifications */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* SECTION 1: Current Attached Photos Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span>Existing Product Pictures</span>
                <span className="text-[#5B21B6] font-bold">({mediaList.length})</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">
                ★ 1st photo is customer cover/catalog card
              </span>
            </div>

            {mediaList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No photos added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Upload photos below to showcase this shoe!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {mediaList.map((m, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={m.id || idx}
                      className={`relative rounded-2xl overflow-hidden border p-1.5 transition-all group ${
                        isPrimary
                          ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/30 bg-purple-50/50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-purple-300 shadow-2xs'
                      }`}
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center p-1">
                        <img
                          src={m.url}
                          alt={`Product photo ${idx + 1}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />

                        {/* Order & Primary Badge */}
                        <div className="absolute top-1 left-1 flex items-center gap-1">
                          {isPrimary ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#5B21B6] text-white shadow-xs flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                              Cover
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/70 text-white backdrop-blur-xs">
                              #{idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Top Right Quick Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(idx)}
                          disabled={isProcessing}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Card Action Strip */}
                      <div className="mt-1.5 flex items-center justify-between gap-1 pt-1 border-t border-slate-100 text-[10px]">
                        {!isPrimary ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            disabled={isProcessing}
                            className="flex-1 py-1 px-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5B21B6] font-bold text-center transition flex items-center justify-center gap-1 cursor-pointer"
                            title="Make this photo the primary cover image"
                          >
                            <Star className="w-3 h-3" />
                            <span>Make Cover</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#5B21B6] px-1 py-0.5">
                            Primary Cover
                          </span>
                        )}

                        <div className="flex items-center gap-0.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(idx, 'left')}
                              disabled={isProcessing}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Move left"
                            >
                              <ArrowLeft className="w-2.5 h-2.5" />
                            </button>
                          )}
                          {idx < mediaList.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(idx, 'right')}
                              disabled={isProcessing}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Move right"
                            >
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 2: Add More Photos to Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#5B21B6]" />
              <span>Add More Pictures to this Product</span>
            </h4>

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold max-w-sm">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'upload' ? 'bg-white text-[#5B21B6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Gallery / Files (Multiple)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'url' ? 'bg-white text-[#5B21B6] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image Link</span>
              </button>
            </div>

            {/* TAB 1: Multiple Device File / Gallery Picker */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFiles}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl p-5 text-center cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Tap to Choose Multiple Photos from Phone Gallery or Camera
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select 1, 2, 5 or more photos at once (JPG, PNG, WEBP)
                  </p>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#5B21B6] text-white text-xs font-bold shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      Browse Device Gallery
                    </span>
                  </div>
                </div>

                {/* Previews of Queued Files */}
                {queuedFiles.length > 0 && (
                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5B21B6]">
                        {queuedFiles.length} New {queuedFiles.length === 1 ? 'Photo' : 'Photos'} Ready to Upload:
                      </span>
                      <button
                        type="button"
                        onClick={() => setQueuedFiles([])}
                        className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {queuedFiles.map((qf, i) => (
                        <div
                          key={i}
                          className="relative w-16 h-16 rounded-xl bg-white border border-purple-200 shrink-0 overflow-hidden shadow-2xs group"
                        >
                          <img
                            src={qf.previewUrl}
                            alt="Upload preview"
                            className="w-full h-full object-contain p-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeQueuedFile(i)}
                            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition cursor-pointer"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleUploadQueued}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{uploadProgress || 'Uploading Photos...'}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Upload &amp; Add {queuedFiles.length} Photos to Product</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Direct Image URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/shoe-side-view.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={isProcessing || !imageUrlInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {imageUrlInput && (
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                    <p className="text-[11px] font-bold text-slate-500 mb-2">Live Image Preview:</p>
                    <img
                      src={imageUrlInput}
                      alt="Preview"
                      className="w-28 h-28 object-contain mx-auto rounded-xl bg-white p-2 border border-slate-200"
                      onError={() => setError('Image failed to load from provided URL.')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Total Pictures: <strong className="text-slate-800">{mediaList.length}</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageUploadModal;
