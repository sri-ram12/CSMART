import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Float,
  Center,
  Html,
  useProgress,
} from '@react-three/drei';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Loader2,
  Check,
  Camera,
  Boxes,
} from 'lucide-react';
import { Product } from '../../types';
import { Footwear3DModel, FootwearType } from './Footwear3DModels';
export type { FootwearType } from './Footwear3DModels';

export type CameraPreset = '3/4' | 'front' | 'profile' | 'soletread' | 'top' | 'heel';

function ModelProgressFallback({ title }: { title: string }) {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 text-xs font-bold text-slate-800 min-w-[200px]">
        <div className="flex items-center gap-2 text-red-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-extrabold">Loading {title}...</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-red-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(12, Math.min(100, progress))}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {progress > 0 ? `${progress.toFixed(0)}%` : 'Initializing Photorealistic 3D Model...'}
        </span>
      </div>
    </Html>
  );
}

// Curated authentic colorways based on footwear silhouette & category
export const FOOTWEAR_COLORWAYS: Record<
  FootwearType,
  Array<{ name: string; hex: string; label: string }>
> = {
  formal: [
    { name: 'Rich Tan Leather', hex: '#8B4513', label: 'Tan' },
    { name: 'Classic Oxford Black', hex: '#111827', label: 'Black' },
    { name: 'Dark Chocolate Brown', hex: '#3E2723', label: 'Dark Brown' },
    { name: 'Deep Burgundy Wine', hex: '#581C87', label: 'Burgundy' },
    { name: 'Cognac Saddle', hex: '#9A3412', label: 'Cognac' },
  ],
  slipper: [
    { name: 'Midnight Navy', hex: '#1E3A8A', label: 'Navy' },
    { name: 'Charcoal Smoke', hex: '#374151', label: 'Charcoal' },
    { name: 'Jet Black', hex: '#18181B', label: 'Black' },
    { name: 'Olive Army Green', hex: '#3F4F38', label: 'Olive' },
    { name: 'Scarlet Red', hex: '#DC2626', label: 'Red' },
    { name: 'Sand Camel', hex: '#D4A373', label: 'Sand' },
  ],
  sandal: [
    { name: 'Midnight Black', hex: '#18181B', label: 'Black' },
    { name: 'Earth Brown', hex: '#78350F', label: 'Brown' },
    { name: 'Forest Olive', hex: '#365314', label: 'Olive' },
    { name: 'Steel Slate', hex: '#475569', label: 'Slate' },
    { name: 'Desert Khaki', hex: '#B45309', label: 'Khaki' },
  ],
  boot: [
    { name: 'Camel Desert Wheat', hex: '#C19A6B', label: 'Wheat' },
    { name: 'Rugged Walnut Brown', hex: '#451A03', label: 'Brown' },
    { name: 'Matte Stealth Black', hex: '#1C1917', label: 'Black' },
    { name: 'Tactical Olive', hex: '#3F4F38', label: 'Olive' },
    { name: 'Oxblood Rust', hex: '#7C2D12', label: 'Oxblood' },
  ],
  loafer: [
    { name: 'Espresso Brown', hex: '#3E2723', label: 'Espresso' },
    { name: 'Italian Tan', hex: '#A0522D', label: 'Tan' },
    { name: 'Gloss Onyx Black', hex: '#0F172A', label: 'Black' },
    { name: 'Navy Suede', hex: '#1E293B', label: 'Navy' },
    { name: 'Cordovan Cherry', hex: '#7F1D1D', label: 'Cordovan' },
  ],
  clog: [
    { name: 'Ocean Teal', hex: '#0D9488', label: 'Teal' },
    { name: 'Classic Pure White', hex: '#F8FAFC', label: 'White' },
    { name: 'Berry Coral', hex: '#E11D48', label: 'Coral' },
    { name: 'Midnight Navy', hex: '#1E293B', label: 'Navy' },
    { name: 'Lime Volt', hex: '#84CC16', label: 'Volt' },
    { name: 'Lavender Mist', hex: '#A855F7', label: 'Lavender' },
  ],
  sneaker: [
    { name: 'Arctic Pure White', hex: '#FFFFFF', label: 'White' },
    { name: 'Stealth Triple Black', hex: '#18181B', label: 'Black' },
    { name: 'Royal Velocity Blue', hex: '#2563EB', label: 'Blue' },
    { name: 'Scarlet Hyper Red', hex: '#DC2626', label: 'Red' },
    { name: 'Emerald Volt Green', hex: '#059669', label: 'Green' },
    { name: 'Solar Gold', hex: '#EAB308', label: 'Gold' },
  ],
};

// Intelligently detect footwear type from catalog product metadata
export function detectFootwearType(product?: Product | null, modelType?: string): FootwearType {
  if (modelType) {
    const mt = modelType.toLowerCase();
    if (mt.includes('slipper') || mt.includes('slide') || mt.includes('flip')) return 'slipper';
    if (mt.includes('formal') || mt.includes('derby') || mt.includes('oxford')) return 'formal';
    if (mt.includes('loafer') || mt.includes('moccasin')) return 'loafer';
    if (mt.includes('boot')) return 'boot';
    if (mt.includes('sandal') || mt.includes('floater')) return 'sandal';
    if (mt.includes('clog') || mt.includes('croc')) return 'clog';
    if (mt.includes('sneaker') || mt.includes('runner') || mt.includes('sport')) return 'sneaker';
  }

  if (!product) return 'sneaker';

  const catSlug = (product.category?.slug || (product as any).categorySlug || '').toLowerCase();
  const catName = (product.category?.name || '').toLowerCase();
  const title = (product.title || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const dept = (product.department || '').toLowerCase();

  const combined = `${catSlug} ${catName} ${title} ${desc} ${dept}`;

  if (combined.includes('clog') || combined.includes('croc') || combined.includes('mule')) {
    return 'clog';
  }
  if (
    combined.includes('slipper') ||
    combined.includes('slide') ||
    combined.includes('flip-flop') ||
    combined.includes('flip flop') ||
    combined.includes('flipflop') ||
    combined.includes('chappal') ||
    combined.includes('bahamas') ||
    combined.includes('hawai') ||
    combined.includes('flite')
  ) {
    return 'slipper';
  }
  if (
    combined.includes('sandal') ||
    combined.includes('floater') ||
    combined.includes('strappy') ||
    combined.includes('gladiator') ||
    combined.includes('kolhapuri') ||
    combined.includes('ethnic-sandals') ||
    combined.includes('adjustable-strap')
  ) {
    return 'sandal';
  }
  if (
    combined.includes('formal') ||
    combined.includes('oxford') ||
    combined.includes('derby') ||
    combined.includes('brogue') ||
    combined.includes('monk') ||
    combined.includes('dress shoe')
  ) {
    return 'formal';
  }
  if (
    combined.includes('loafer') ||
    combined.includes('moccasin') ||
    combined.includes('boat shoe') ||
    combined.includes('penny loafer') ||
    (combined.includes('slip-on') && !combined.includes('slide')) ||
    (combined.includes('slip on') && !combined.includes('slide'))
  ) {
    return 'loafer';
  }
  if (
    combined.includes('boot') ||
    combined.includes('chelsea') ||
    combined.includes('hiking') ||
    combined.includes('trekking') ||
    combined.includes('combat')
  ) {
    return 'boot';
  }

  return 'sneaker';
}

function isDarkColor(hexColor: string): boolean {
  const clean = hexColor.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return false;
  const expanded = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(expanded, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 135;
}

export interface Shoe3DViewerProps {
  product?: Product | null;
  footwearType?: FootwearType;
  modelUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  soleColor?: string;
  modelType?: string;
  className?: string;
  height?: string;
  allowFullscreen?: boolean;
  onColorChange?: (colorHex: string, colorName?: string) => void;
}

export const Shoe3DViewer: React.FC<Shoe3DViewerProps> = ({
  product,
  footwearType: explicitType,
  modelUrl: explicitModelUrl,
  primaryColor,
  accentColor,
  soleColor,
  modelType,
  className = '',
  height = 'h-[440px] md:h-[520px]',
  allowFullscreen = true,
  onColorChange,
}) => {
  // Dual Inspection Mode: '3d' (WebGL Model) or 'real_photo' (Exact Physical Scanned Shoe)
  const [viewMode, setViewMode] = useState<'3d' | 'real_photo'>('3d');

  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraPreset>('3/4');
  const controlsRef = useRef<any>(null);

  // Photo turntable inspection state
  const [photoRotation, setPhotoRotation] = useState(0);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const photoStartXRef = useRef(0);

  // Parse product model3DConfig if available
  const parsedModelConfig = useMemo(() => {
    try {
      if (product?.model3DConfig) {
        return typeof product.model3DConfig === 'string'
          ? JSON.parse(product.model3DConfig)
          : product.model3DConfig;
      }
    } catch {}
    return null;
  }, [product?.model3DConfig]);

  // Extract modelUrl if stored in product model3DConfig
  const assignedModelUrl = useMemo(() => {
    if (explicitModelUrl) return explicitModelUrl;
    if (parsedModelConfig?.modelUrl) return parsedModelConfig.modelUrl;
    return undefined;
  }, [explicitModelUrl, parsedModelConfig]);

  // Real physical product image
  const realProductImage = useMemo(() => {
    if (parsedModelConfig?.realProductImage) return parsedModelConfig.realProductImage;
    if (product?.media?.[0]?.url) return product.media[0].url;
    return '/catalog/sparx_sm_1036_product.jpg';
  }, [parsedModelConfig, product]);

  // Texture variant for 3D model
  const shoeTextureVariant = parsedModelConfig?.shoeTextureVariant || 'white_street';

  // Detect exact footwear type
  const detectedType = useMemo(
    () => explicitType || detectFootwearType(product, modelType),
    [explicitType, product, modelType]
  );

  // Default color resolved from model config or variant
  const initialResolvedColor = useMemo(() => {
    if (primaryColor) return primaryColor;
    if (parsedModelConfig?.primaryColor) return parsedModelConfig.primaryColor;
    if (product?.variants?.[0]?.colorHex) return product.variants[0].colorHex;
    return '#FFFFFF';
  }, [primaryColor, parsedModelConfig, product]);

  // Active color state
  const [activeColor, setActiveColor] = useState(initialResolvedColor);

  useEffect(() => {
    if (initialResolvedColor) {
      setActiveColor(initialResolvedColor);
    }
  }, [initialResolvedColor]);

  // Calibrated camera positions
  const cameraPositions: Record<CameraPreset, [number, number, number]> = {
    '3/4': [1.9, 0.9, 1.9],
    front: [0, 0.22, 2.5],
    profile: [2.5, 0.15, 0],
    soletread: [0.01, -2.5, 0.01],
    top: [0.01, 2.5, 0.01],
    heel: [-0.01, 0.55, -2.4],
  };

  const handleSetPreset = (preset: CameraPreset) => {
    setCurrentCameraPreset(preset);
    setAutoRotate(false);

    if (viewMode === '3d' && controlsRef.current) {
      const pos = cameraPositions[preset];
      controlsRef.current.object.position.set(...pos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    } else if (viewMode === 'real_photo') {
      switch (preset) {
        case '3/4':
          setPhotoRotation(0);
          break;
        case 'front':
          setPhotoRotation(-15);
          break;
        case 'profile':
          setPhotoRotation(25);
          break;
        case 'soletread':
          setPhotoRotation(180);
          break;
        case 'top':
          setPhotoRotation(-35);
          break;
        case 'heel':
          setPhotoRotation(45);
          break;
      }
    }
  };

  const handleResetCamera = () => {
    handleSetPreset('3/4');
    setAutoRotate(true);
    setPhotoRotation(0);
    setPhotoZoom(1);
  };

  const handleZoomIn = () => {
    if (viewMode === '3d' && controlsRef.current) {
      controlsRef.current.dollyIn(1.25);
      controlsRef.current.update();
    } else if (viewMode === 'real_photo') {
      setPhotoZoom((prev) => Math.min(2.5, prev + 0.15));
    }
  };

  const handleZoomOut = () => {
    if (viewMode === '3d' && controlsRef.current) {
      controlsRef.current.dollyOut(1.25);
      controlsRef.current.update();
    } else if (viewMode === 'real_photo') {
      setPhotoZoom((prev) => Math.max(0.75, prev - 0.15));
    }
  };

  // Real photo drag-to-rotate handlers
  const handlePhotoMouseDown = (e: React.MouseEvent) => {
    setIsPhotoDragging(true);
    photoStartXRef.current = e.clientX;
  };

  const handlePhotoMouseMove = (e: React.MouseEvent) => {
    if (!isPhotoDragging) return;
    const deltaX = e.clientX - photoStartXRef.current;
    setPhotoRotation((prev) => prev + deltaX * 0.4);
    photoStartXRef.current = e.clientX;
  };

  const handlePhotoMouseUp = () => setIsPhotoDragging(false);

  const handlePhotoTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPhotoDragging(true);
      photoStartXRef.current = e.touches[0].clientX;
    }
  };

  const handlePhotoTouchMove = (e: React.TouchEvent) => {
    if (!isPhotoDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - photoStartXRef.current;
    setPhotoRotation((prev) => prev + deltaX * 0.4);
    photoStartXRef.current = e.touches[0].clientX;
  };

  // Dynamically compute colorways: product variants first, followed by category-tailored palette
  const availableColorways = useMemo(() => {
    const list: Array<{ name: string; hex: string; label: string }> = [];
    const seenHex = new Set<string>();

    // 1. If catalog product has variants with colors, inject them first
    if (product?.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        if (v.colorHex && !seenHex.has(v.colorHex.toLowerCase())) {
          seenHex.add(v.colorHex.toLowerCase());
          list.push({
            name: v.colorName || 'Catalog Color',
            hex: v.colorHex,
            label: v.colorName || 'Variant',
          });
        }
      });
    }

    // 2. Augment with authentic category colorway options
    const categoryPalette = FOOTWEAR_COLORWAYS[detectedType] || FOOTWEAR_COLORWAYS.sneaker;
    categoryPalette.forEach((c) => {
      if (!seenHex.has(c.hex.toLowerCase())) {
        seenHex.add(c.hex.toLowerCase());
        list.push(c);
      }
    });

    return list;
  }, [product, detectedType]);

  const activeColorwayName = useMemo(() => {
    const match = availableColorways.find(
      (c) => c.hex.toLowerCase() === activeColor.toLowerCase()
    );
    return match ? match.name : 'Authentic Color';
  }, [availableColorways, activeColor]);

  const handleColorSelect = (hex: string, name: string) => {
    setActiveColor(hex);
    onColorChange?.(hex, name);
  };

  // Clean presentation title and SKU
  const productDisplayTitle = product?.title ? product.title.split('(')[0].trim() : 'Catalog Footwear';
  const productSku = product?.sku || 'CSM-SHOES';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-white shadow-card transition-all duration-300 ${height} ${className} ${
        isFullscreen ? '!fixed !inset-0 !z-50 !h-screen !w-screen !rounded-none bg-white' : ''
      }`}
    >
      {/* 3D WebGL Canvas Mode */}
      {viewMode === '3d' && (
        <Canvas
          shadows
          camera={{ position: cameraPositions['3/4'], fov: 40 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-50 via-white to-red-50/20"
        >
          <ambientLight intensity={1.3} />
          <spotLight
            position={[6, 10, 6]}
            angle={0.4}
            penumbra={0.8}
            intensity={2.2}
            castShadow
            shadow-mapSize={2048}
          />
          <directionalLight position={[-6, 6, -4]} intensity={0.9} color="#FFFFFF" />
          <directionalLight position={[0, -4, 2]} intensity={0.4} color="#FEE2E2" />

          <Suspense fallback={<ModelProgressFallback title={productDisplayTitle} />}>
            <Float speed={autoRotate ? 1.3 : 0} rotationIntensity={0.1} floatIntensity={0.16}>
              <Center>
                <group scale={1.0}>
                  <Footwear3DModel
                    type={detectedType}
                    modelUrl={assignedModelUrl}
                    shoeTextureVariant={shoeTextureVariant}
                    primaryColor={activeColor}
                    accentColor={accentColor}
                    soleColor={soleColor}
                    wireframe={wireframe}
                    autoRotate={autoRotate}
                  />
                </group>
              </Center>
            </Float>

            {/* Ground Contact Shadow */}
            <ContactShadows
              position={[0, -0.68, 0]}
              opacity={0.4}
              scale={5.5}
              blur={2.4}
              far={3}
              color="#0F172A"
            />

            <Environment preset="studio" />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            minDistance={1.1}
            maxDistance={5.5}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      )}

      {/* Exact Physical Scanned Product Turntable Mode */}
      {viewMode === 'real_photo' && (
        <div
          className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 p-6 select-none cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handlePhotoMouseDown}
          onMouseMove={handlePhotoMouseMove}
          onMouseUp={handlePhotoMouseUp}
          onMouseLeave={handlePhotoMouseUp}
          onTouchStart={handlePhotoTouchStart}
          onTouchMove={handlePhotoTouchMove}
          onTouchEnd={handlePhotoMouseUp}
        >
          <div
            className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
            }}
          >
            <img
              src={realProductImage}
              alt={productDisplayTitle}
              className="max-h-[280px] sm:max-h-[350px] w-auto object-contain drop-shadow-2xl pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/catalog/sparx_sm_1036_product.jpg';
              }}
            />
          </div>

          {/* Genuine store article badge */}
          <div className="absolute bottom-16 sm:bottom-4 left-3 sm:left-4 z-10 pointer-events-none flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[10px] sm:text-[11px] font-bold shadow-lg">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Authentic Store Catalog Scanned Article</span>
          </div>
        </div>
      )}

      {/* TOP HEADER CONTROLS */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-col gap-2 z-20 pointer-events-none">
        {/* Top Header Row 1: Product Title & SKU Badge + Inspection Mode Toggle + View Actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Authentic Product Identity Badge */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-800 border border-slate-100/80 pointer-events-auto max-w-[240px] sm:max-w-xs truncate">
            <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
            <span className="font-extrabold truncate text-slate-900">{productDisplayTitle}</span>
            <span className="text-[10px] bg-red-50 text-red-600 font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
              {productSku}
            </span>
          </div>

          {/* Dual Mode Switcher: 3D WebGL Model vs Real Physical Article */}
          <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-100 pointer-events-auto">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-none transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>3D Model</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('real_photo')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border-none transition-all cursor-pointer ${
                viewMode === 'real_photo'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Exact Catalog Photo</span>
            </button>
          </div>

          {/* Action buttons (Wireframe, AutoRotate, Fullscreen) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {viewMode === '3d' && (
              <>
                <button
                  type="button"
                  onClick={() => setWireframe(!wireframe)}
                  title="Toggle Wireframe Inspection"
                  className={`p-2 sm:p-2.5 rounded-xl border-none backdrop-blur-md shadow-sm transition-all cursor-pointer ${
                    wireframe
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  title={autoRotate ? 'Pause Turntable' : 'Play Turntable'}
                  className={`p-2 sm:p-2.5 rounded-xl border-none backdrop-blur-md shadow-sm transition-all cursor-pointer ${
                    autoRotate
                      ? 'bg-red-50 text-red-600'
                      : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
                  }`}
                >
                  <RotateCcw
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      autoRotate ? 'animate-spin-slow text-red-600' : ''
                    }`}
                  />
                </button>
              </>
            )}

            {allowFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                className="p-2 sm:p-2.5 rounded-xl border-none bg-white/90 backdrop-blur-md text-slate-700 hover:text-red-600 hover:bg-white shadow-sm transition-all cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Top Header Row 2: Camera Presets (3/4, Front, Profile, Sole Tread, Top, Heel) */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl shadow-md border border-slate-100/70 pointer-events-auto overflow-x-auto max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold px-1.5 hidden md:inline">
              Angle:
            </span>
            <button
              type="button"
              onClick={() => handleSetPreset('3/4')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === '3/4'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              3/4 View
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('front')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === 'front'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('profile')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === 'profile'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('soletread')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === 'soletread'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Sole Tread
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('top')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === 'top'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Top
            </button>
            <button
              type="button"
              onClick={() => handleSetPreset('heel')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xl font-bold border-none transition-all shrink-0 cursor-pointer ${
                currentCameraPreset === 'heel'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Heel
            </button>
            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset Angle"
              className="p-1 sm:p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border-none transition-colors ml-0.5 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FLOATING ZOOM CONTROLS (+ / - / Reset) */}
      <div className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-slate-700 hover:text-red-600 hover:bg-white flex items-center justify-center border border-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base font-black"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-slate-700 hover:text-red-600 hover:bg-white flex items-center justify-center border border-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer text-base font-black"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset View"
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-slate-500 hover:text-red-600 hover:bg-white flex items-center justify-center border border-slate-100 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* USER GUIDANCE HINT BADGE */}
      {viewMode === '3d' && (
        <div className="absolute bottom-16 sm:bottom-4 left-3 sm:left-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md text-white/90 text-[10px] font-semibold">
          <span>Drag to rotate 3D model · Scroll to zoom</span>
        </div>
      )}

      {/* BOTTOM DYNAMIC FOOTWEAR COLOR SELECTOR */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex justify-center pointer-events-none z-20">
        <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-slate-400 hidden sm:inline">Color:</span>
            <span className="text-slate-900 font-extrabold max-w-[120px] sm:max-w-[140px] truncate">
              {activeColorwayName}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {availableColorways.map((cw) => {
              const isSelected = activeColor.toLowerCase() === cw.hex.toLowerCase();
              return (
                <button
                  key={cw.hex + cw.name}
                  type="button"
                  onClick={() => handleColorSelect(cw.hex, cw.name)}
                  title={`${cw.name} (${cw.label})`}
                  className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-red-600 scale-110 shadow-md ring-2 ring-red-300'
                      : 'border-slate-300/80 hover:scale-105'
                  }`}
                  style={{ backgroundColor: cw.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        isDarkColor(cw.hex) ? 'text-white' : 'text-slate-900'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shoe3DViewer;
