import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { Shoe3DViewer } from '../3d/Shoe3DViewer';
import { FootwearType } from '../3d/Footwear3DModels';
import {
  X,
  Sparkles,
  Upload,
  Check,
  RefreshCw,
  Box,
  Palette,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface Admin3DModelStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated?: (updated: Product) => void;
}

const CATEGORY_PRESETS: Array<{
  id: FootwearType;
  label: string;
  defaultModelUrl: string;
  description: string;
}> = [
  {
    id: 'slipper',
    label: 'Slipper / Slide',
    defaultModelUrl: '/models/slipper.glb',
    description: 'Ergonomic contoured footbed, toe crest, wide arch strap',
  },
  {
    id: 'sandal',
    label: 'Sandal / Floater',
    defaultModelUrl: '/models/sandal.glb',
    description: 'Multi-strap buckle harness, textured grip sole, bumper',
  },
  {
    id: 'sneaker',
    label: 'Sneaker / Runner',
    defaultModelUrl: '/models/shoe.glb',
    description: 'Full athletic silhouette with tongue, collar & laces',
  },
  {
    id: 'formal',
    label: 'Formal / Oxford',
    defaultModelUrl: '/models/formal.glb',
    description: 'Welted dress sole, stacked heel, almond toe cap',
  },
  {
    id: 'loafer',
    label: 'Slip-on Loafer',
    defaultModelUrl: '/models/loafer.glb',
    description: 'Moccasin toe stitching with penny keeper saddle strap',
  },
  {
    id: 'boot',
    label: 'Lugged Boot',
    defaultModelUrl: '/models/boot.glb',
    description: 'High-ankle padded collar, heavy-duty lugged cleat outsole',
  },
];

export const Admin3DModelStudioModal: React.FC<Admin3DModelStudioModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}) => {
  if (!isOpen || !product) return null;

  // Existing product 3D config or defaults
  let existingConfig: any = {};
  try {
    if (typeof product.model3DConfig === 'string') {
      existingConfig = JSON.parse(product.model3DConfig);
    } else if (product.model3DConfig) {
      existingConfig = product.model3DConfig;
    }
  } catch {
    existingConfig = {};
  }

  const [has3D, setHas3D] = useState<boolean>(product.has3D ?? true);
  const [modelType, setModelType] = useState<FootwearType>(
    (existingConfig.modelType as FootwearType) ||
      (product.department === 'SLIPPERS_SANDALS' ? 'slipper' : 'sneaker')
  );
  const [modelUrl, setModelUrl] = useState<string>(
    existingConfig.modelUrl ||
      (modelType === 'slipper'
        ? '/models/slipper.glb'
        : modelType === 'sandal'
        ? '/models/sandal.glb'
        : '/models/shoe.glb')
  );

  const [upperColor, setUpperColor] = useState<string>(
    existingConfig.upperColor || '#2563EB'
  );
  const [soleColor, setSoleColor] = useState<string>(
    existingConfig.soleColor || '#F3F4F6'
  );
  const [accentColor, setAccentColor] = useState<string>(
    existingConfig.accentColor || '#EA580C'
  );
  const [roughness, setRoughness] = useState<number>(
    existingConfig.roughness ?? 0.4
  );
  const [metalness, setMetalness] = useState<number>(
    existingConfig.metalness ?? 0.1
  );

  const [availableModels, setAvailableModels] = useState<
    Array<{ name: string; url: string; sizeBytes: number; isBuiltIn: boolean }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available GLB models from server
  useEffect(() => {
    api.admin
      .getAvailableModels()
      .then(setAvailableModels)
      .catch((err) => console.error('Failed to load available 3D models', err));
  }, []);

  const handleSelectPreset = (preset: (typeof CATEGORY_PRESETS)[0]) => {
    setModelType(preset.id);
    setModelUrl(preset.defaultModelUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      setStatusMessage({
        type: 'error',
        text: 'Only binary glTF (.glb) files are supported.',
      });
      return;
    }

    if (file.size > 35 * 1024 * 1024) {
      setStatusMessage({
        type: 'error',
        text: 'Model size exceeds 35MB limit.',
      });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    try {
      const res = await api.admin.uploadModel(file);
      setModelUrl(res.url);
      setStatusMessage({
        type: 'success',
        text: `Uploaded "${res.filename}" successfully! Set as active model.`,
      });
      // Refresh available models list
      const freshList = await api.admin.getAvailableModels();
      setAvailableModels(freshList);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'GLB upload failed. Ensure valid binary glTF file.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    const updatedConfig = {
      modelType,
      modelUrl,
      upperColor,
      soleColor,
      accentColor,
      roughness,
      metalness,
      updatedAt: new Date().toISOString(),
    };

    try {
      const updated = await api.admin.updateProductModel(product.id, {
        has3D,
        model3DConfig: updatedConfig,
      });

      setStatusMessage({
        type: 'success',
        text: '3D model configuration saved to catalog successfully!',
      });

      if (onProductUpdated) {
        onProductUpdated(updated);
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save 3D model configuration.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview mock product with currently active configuration
  const previewProduct: Product = {
    ...product,
    has3D,
    model3DConfig: JSON.stringify({
      modelType,
      modelUrl,
      upperColor,
      soleColor,
      accentColor,
      roughness,
      metalness,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-black tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span>3D Footwear Asset Studio</span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase shrink-0">
                  glTF 2.0 Binary
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-purple-200/80 truncate max-w-xs sm:max-w-md">
                Assign category models, customize materials & test live Three.js viewport
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border-none shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body: Split Layout (Left: Live 3D Preview, Right: Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Interactive 3D Canvas Preview (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-slate-100/70 border-b lg:border-b-0 lg:border-r border-slate-200/70 flex flex-col justify-between gap-4">
            <div>
              {/* Product Info Mini Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs mb-3">
                <img
                  src={product.media?.[0]?.url || ''}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                    {product.brand} • {product.department}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold text-slate-600">
                    <span>₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      SKU: {product.sku}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live 3D Canvas Container */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-gradient-to-b from-white via-slate-50/50 to-purple-50/20">
                <Shoe3DViewer
                  product={previewProduct}
                  footwearType={modelType}
                  modelUrl={modelUrl}
                  primaryColor={upperColor}
                  soleColor={soleColor}
                  accentColor={accentColor}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Currently Active Model URL Pill */}
            <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between gap-2">
              <span className="font-bold text-slate-500">Asset:</span>
              <span className="truncate font-semibold text-purple-700">
                {modelUrl}
              </span>
            </div>
          </div>

          {/* Right Column: Controls & Material Studio (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-5 overflow-y-auto">
            {/* 1. 3D Inspection Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-purple-950">
                    Enable 3D Customer Inspection
                  </h4>
                  <p className="text-[11px] text-purple-800/80">
                    Display 3D interactive viewer on catalog & product detail page
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHas3D(!has3D)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border-none p-0.5 ${
                  has3D ? 'bg-[#7C3AED]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    has3D ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Category Model Preset Picker */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>1. Select Category 3D Footwear Geometry</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_PRESETS.map((preset) => {
                  const isSelected =
                    modelType === preset.id && modelUrl === preset.defaultModelUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-50 text-purple-950 border-purple-500 ring-2 ring-purple-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black">{preset.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Upload Custom GLB Binary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>2. Upload Custom .GLB Binary Asset</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  Max 35MB • Binary glTF 2.0
                </span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-4 text-center bg-purple-50/20 hover:bg-purple-50/40 transition-colors cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".glb"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isUploading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    {isUploading
                      ? 'Validating glTF header & uploading...'
                      : 'Click to Browse or Drag & Drop GLB file'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Automatically validates 0x46546C67 binary header before storage
                  </span>
                </div>
              </div>

              {/* Available models dropdown selector */}
              {availableModels.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-600 shrink-0">
                    Or pick from stored assets:
                  </span>
                  <select
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    {availableModels.map((m) => (
                      <option key={m.url} value={m.url}>
                        {m.name} ({(m.sizeBytes / 1024).toFixed(0)} KB){' '}
                        {m.isBuiltIn ? '• Built-in' : '• Custom'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 4. Colorway Swatches Customizer */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Customize Colors & PBR Surface Finishes</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Upper Color */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Upper Body
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={upperColor}
                      onChange={(e) => setUpperColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                    />
                    <input
                      type="text"
                      value={upperColor}
                      onChange={(e) => setUpperColor(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 uppercase"
                    />
                  </div>
                </div>

                {/* Sole Color */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Outsole / Tread
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={soleColor}
                      onChange={(e) => setSoleColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                    />
                    <input
                      type="text"
                      value={soleColor}
                      onChange={(e) => setSoleColor(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 uppercase"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Accents / Trim
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Surface Sliders: Roughness & Metalness */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Roughness (Matte vs Glossy)</span>
                    <span className="font-mono">{roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Metalness (Dielectric vs Metallic)</span>
                    <span className="font-mono">{metalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.05"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>WebGL Three.js Canvas Ready</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer border-none disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Catalog...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply & Save 3D Model</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin3DModelStudioModal;
