import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Float,
  Center,
  Html,
} from '@react-three/drei';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Loader2,
  Check,
} from 'lucide-react';
import { Product } from '../../types';
import { Footwear3DModel, FootwearType } from './Footwear3DModels';

export type CameraPreset = '3/4' | 'profile' | 'soletread' | 'top' | 'heel';

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
    { name: 'Scarlet Hyper Red', hex: '#DC2626', label: 'Red' },
    { name: 'Royal Velocity Blue', hex: '#2563EB', label: 'Blue' },
    { name: 'Stealth Triple Black', hex: '#18181B', label: 'Black' },
    { name: 'Arctic Pure White', hex: '#FFFFFF', label: 'White' },
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

  // 1. Clogs / Crocs
  if (combined.includes('clog') || combined.includes('croc') || combined.includes('mule')) {
    return 'clog';
  }

  // 2. Slippers, Slides, Flip-Flops, Chappals
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

  // 3. Sandals, Floaters, Strappy, Kolhapuri
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

  // 4. Formal shoes (Derby, Oxford, Brogue, Monk, Office dress shoe)
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

  // 5. Loafers, Moccasins, Boat shoes, Slip-on
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

  // 6. Boots (Hiking, Tactical, Chelsea, Winter, Woodland)
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

const FOOTWEAR_TITLES: Record<FootwearType, string> = {
  sneaker: 'Athletic Sneaker',
  slipper: 'Comfort Slide / Slipper',
  formal: 'Formal Leather Derby',
  loafer: 'Penny Loafer',
  boot: 'Trekker Ankle Boot',
  sandal: 'Outdoor Floater Sandal',
  clog: 'Ventilated Foam Clog',
};

export interface Shoe3DViewerProps {
  product?: Product | null;
  footwearType?: FootwearType;
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
  primaryColor = '#DC2626',
  accentColor = '#FFFFFF',
  soleColor = '#F8FAFC',
  modelType,
  className = '',
  height = 'h-[440px] md:h-[520px]',
  allowFullscreen = true,
  onColorChange,
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraPreset>('3/4');
  const controlsRef = useRef<any>(null);

  // Detect exact footwear type
  const detectedType = useMemo(
    () => explicitType || detectFootwearType(product, modelType),
    [explicitType, product, modelType]
  );

  // Active color state
  const [activeColor, setActiveColor] = useState(primaryColor);

  useEffect(() => {
    if (primaryColor) {
      setActiveColor(primaryColor);
    }
  }, [primaryColor]);

  // Default camera framing calibrated so the 3D model appears defaultly compact and well-proportioned
  const cameraPositions: Record<CameraPreset, [number, number, number]> = {
    '3/4': [1.9, 0.9, 1.9],
    profile: [2.5, 0.15, 0],
    soletread: [0.01, -2.5, 0.01],
    top: [0.01, 2.5, 0.01],
    heel: [-0.01, 0.55, -2.4],
  };

  const handleSetPreset = (preset: CameraPreset) => {
    setCurrentCameraPreset(preset);
    setAutoRotate(false);
    if (controlsRef.current) {
      const pos = cameraPositions[preset];
      controlsRef.current.object.position.set(...pos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    handleSetPreset('3/4');
    setAutoRotate(true);
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

    // 2. Augment with authentic category colorway options for this footwear type
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
    return match ? match.name : 'Custom Tint';
  }, [availableColorways, activeColor]);

  const handleColorSelect = (hex: string, name: string) => {
    setActiveColor(hex);
    onColorChange?.(hex, name);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-white shadow-card transition-all duration-300 ${height} ${className} ${
        isFullscreen ? '!fixed !inset-0 !z-50 !h-screen !w-screen !rounded-none bg-white' : ''
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: cameraPositions['3/4'], fov: 40 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'none' }}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-gradient-to-b from-slate-50 via-white to-red-50/20"
      >
        <ambientLight intensity={1.25} />
        <spotLight
          position={[6, 10, 6]}
          angle={0.4}
          penumbra={0.8}
          intensity={2.2}
          castShadow
          shadow-mapSize={2048}
        />
        <directionalLight position={[-6, 6, -4]} intensity={0.85} color="#FFFFFF" />
        <directionalLight position={[0, -4, 2]} intensity={0.4} color="#FEE2E2" />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border-none text-xs font-bold text-slate-700">
                <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                <span>Loading {FOOTWEAR_TITLES[detectedType]} 3D Model...</span>
              </div>
            </Html>
          }
        >
          <Float speed={autoRotate ? 1.3 : 0} rotationIntensity={0.12} floatIntensity={0.18}>
            <Center>
              <group scale={1.0}>
                <Footwear3DModel
                  type={detectedType}
                  primaryColor={activeColor}
                  accentColor={accentColor}
                  soleColor={soleColor}
                  wireframe={wireframe}
                  autoRotate={autoRotate}
                />
              </group>
            </Center>
          </Float>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.68, 0]}
            opacity={0.35}
            scale={5}
            blur={2.2}
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

      {/* TOP HEADER CONTROLS (Camera Angle Presets: 3/4, Profile, Sole Tread, Top, Heel at TOP) */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col gap-2 z-20 pointer-events-none">
        {/* Top Header Row: Model Type Badge & Action Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-800 border border-slate-100/80 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span className="font-extrabold">{FOOTWEAR_TITLES[detectedType]}</span>
            <span className="text-[10px] text-red-600 font-black uppercase tracking-wider ml-0.5">
              360°
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Wireframe toggle */}
            <button
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

            {/* Auto Rotate toggle */}
            <button
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

            {/* Fullscreen toggle */}
            {allowFullscreen && (
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen 3D'}
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

        {/* Top Header Row 2: Camera Presets (3/4, Profile, Sole Tread, Top, Heel) AT THE TOP */}
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

      {/* BOTTOM PROPERLY ALIGNED DYNAMIC FOOTWEAR COLOR SELECTOR */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-center pointer-events-none z-20">
        <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg border border-slate-100 pointer-events-auto max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-slate-400 hidden sm:inline">Color:</span>
            <span className="text-slate-900 font-extrabold max-w-[130px] truncate">
              {activeColorwayName}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />

          {/* Color Swatches properly aligned */}
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
