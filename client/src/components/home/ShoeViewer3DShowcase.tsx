import React, { useState, Suspense, useRef } from 'react';
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
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  Check,
  ShieldCheck,
  MessageCircle,
  Play,
  Pause,
} from 'lucide-react';
import { CategoryGLBModel } from '../3d/Footwear3DModels';
import { openWhatsAppWithLog } from '../../utils/whatsapp';

// ─── 4 Curated Popular Brands & Authentic Customization Data ────────────────
export interface ColorwayOption {
  name: string;
  hex: string;
  label: string;
}

export interface BrandData {
  id: string;
  brand: string;
  title: string;
  sku: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discount: number;
  defaultTexture: string;
  colorways: ColorwayOption[];
  badgeBg: string;
  glowColor: string;
  gradient: string;
  logo: string;
  specs: {
    sole: string;
    upper: string;
    weight: string;
    usage: string;
  };
}

const BRANDS: BrandData[] = [
  {
    id: 'walkaroo',
    brand: 'Walkaroo',
    title: 'CloudStep Air Walking Sneaker',
    sku: 'WLK-AIR-2041',
    tagline: "India's #1 Everyday Walking & Ultra-Comfort Footwear",
    price: 899,
    originalPrice: 1099,
    discount: 18,
    defaultTexture: 'street_runner',
    badgeBg: 'bg-blue-600',
    glowColor: '#3B82F6',
    gradient: 'from-blue-950 via-slate-900 to-indigo-950',
    logo: '🥾',
    colorways: [
      { name: 'Royal Cobalt Blue', hex: '#2563EB', label: 'Cobalt' },
      { name: 'Sunset Amber Orange', hex: '#EA580C', label: 'Sunset' },
      { name: 'Arctic Pure White', hex: '#F8FAFC', label: 'White' },
      { name: 'Urban Slate Charcoal', hex: '#475569', label: 'Slate' },
    ],
    specs: {
      sole: 'Air-Cushioned EVA Foam',
      upper: 'Dual-Tone Breathable Air-Mesh',
      weight: '210g (Ultra Featherlight)',
      usage: 'Daily Walking & All-Day Comfort',
    },
  },
  {
    id: 'sparx',
    brand: 'Sparx',
    title: 'S-Strike Performance Running Shoe',
    sku: 'SPX-STR-1036',
    tagline: 'High-Grip Athletic Sports & Speed-Trained Runner',
    price: 1249,
    originalPrice: 1499,
    discount: 17,
    defaultTexture: 'beach_runner',
    badgeBg: 'bg-red-600',
    glowColor: '#EF4444',
    gradient: 'from-red-950 via-neutral-900 to-rose-950',
    logo: '⚡',
    colorways: [
      { name: 'Crimson Racing Red', hex: '#DC2626', label: 'Crimson' },
      { name: 'Electric Volt Lime', hex: '#84CC16', label: 'Volt' },
      { name: 'Sonic Velocity Cyan', hex: '#06B6D4', label: 'Cyan' },
      { name: 'Stealth Carbon Black', hex: '#18181B', label: 'Stealth' },
    ],
    specs: {
      sole: 'Anti-Skid Multi-Directional TPU',
      upper: 'Engineered Aerodynamic Sportmesh',
      weight: '240g (Speed Responsive)',
      usage: 'Running, Marathon & High-Intensity Sports',
    },
  },
  {
    id: 'vkc-pride',
    brand: 'VKC Pride',
    title: 'Royale Cushion Executive Sneaker',
    sku: 'VKC-ROY-409',
    tagline: 'Premium PU Sole • Kerala’s Most Trusted Durable Footwear',
    price: 749,
    originalPrice: 899,
    discount: 17,
    defaultTexture: 'midnight_runner',
    badgeBg: 'bg-violet-700',
    glowColor: '#8B5CF6',
    gradient: 'from-violet-950 via-stone-900 to-purple-950',
    logo: '👑',
    colorways: [
      { name: 'Royale Pride Purple', hex: '#7C3AED', label: 'Royale' },
      { name: 'Heritage Tan Leather', hex: '#B45309', label: 'Tan' },
      { name: 'Deep Burgundy Wine', hex: '#881337', label: 'Maroon' },
      { name: 'Executive Noir Black', hex: '#0F172A', label: 'Noir' },
    ],
    specs: {
      sole: 'High-Density Long-Life PU Compound',
      upper: 'Supple PU Leather & Contoured Arch',
      weight: '275g (Heavy-Duty Endurance)',
      usage: 'Office, Executive Casual & Daily Wear',
    },
  },
  {
    id: 'paragon',
    brand: 'Paragon',
    title: 'Vertex Rugged All-Terrain Sneaker',
    sku: 'PGN-VTX-552',
    tagline: 'Deep-Grip Skid-Proof Outsole • 50+ Years Indian Heritage',
    price: 699,
    originalPrice: 849,
    discount: 18,
    defaultTexture: 'street_runner',
    badgeBg: 'bg-emerald-700',
    glowColor: '#10B981',
    gradient: 'from-emerald-950 via-zinc-900 to-teal-950',
    logo: '✅',
    colorways: [
      { name: 'Heritage Emerald Green', hex: '#059669', label: 'Emerald' },
      { name: 'Outdoor Olive Trail', hex: '#4D7C0F', label: 'Olive' },
      { name: 'Deep Marine Navy', hex: '#1E40AF', label: 'Navy' },
      { name: 'Earth Trail Brown', hex: '#78350F', label: 'Earth' },
    ],
    specs: {
      sole: 'Vertex Heavy-Cleat Skid Resistant',
      upper: 'Reinforced Weatherproof Canvas & Trim',
      weight: '260g (All-Terrain Tough)',
      usage: 'Tough Outdoor, Rough Terrain & Daily Work',
    },
  },
];

// ─── Material Finish Modes ──────────────────────────────────────────────────
type FinishMode = 'mesh' | 'gloss' | 'matte';

const FINISH_PRESETS: Record<
  FinishMode,
  { label: string; roughness: number; metalness: number; desc: string }
> = {
  mesh: {
    label: 'Breathable Mesh',
    roughness: 0.65,
    metalness: 0.08,
    desc: 'Soft woven texture with realistic matte reflections',
  },
  gloss: {
    label: 'Sport Sheen',
    roughness: 0.32,
    metalness: 0.3,
    desc: 'Polished aerodynamic sheen with bright highlights',
  },
  matte: {
    label: 'Stealth Matte',
    roughness: 0.85,
    metalness: 0.04,
    desc: 'Deep non-reflective finish for rugged aesthetics',
  },
};

// ─── Camera Angles ──────────────────────────────────────────────────────────
type CameraPreset = '3/4' | 'profile' | 'sole' | 'top';

const CAMERA_PRESETS: Record<CameraPreset, { label: string; pos: [number, number, number] }> = {
  '3/4': { label: '3/4 Angle', pos: [1.35, 0.52, 1.35] },
  profile: { label: 'Side Profile', pos: [1.85, 0.12, 0.01] },
  sole: { label: 'Sole Tread', pos: [0.01, -1.75, 0.01] },
  top: { label: 'Top Down', pos: [0.01, 1.8, 0.01] },
};

// ─── Model Loading Indicator ────────────────────────────────────────────────
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 px-5 py-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[200px] shadow-2xl">
        <div className="w-8 h-8 border-[3px] border-purple-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-white text-xs font-bold">
          {progress > 0 ? `Loading 3D Model… ${progress.toFixed(0)}%` : 'Initializing 3D Footwear…'}
        </span>
      </div>
    </Html>
  );
}

// ─── 3D Canvas Scene Component ──────────────────────────────────────────────
interface SceneProps {
  primaryColor: string;
  textureVariant: string;
  finish: FinishMode;
  autoRotate: boolean;
  orbitRef: React.RefObject<any>;
}

function ShoeScene({
  primaryColor,
  textureVariant,
  finish,
  autoRotate,
  orbitRef,
}: SceneProps) {
  const { roughness, metalness } = FINISH_PRESETS[finish];

  return (
    <Canvas
      shadows
      camera={{ position: [1.35, 0.52, 1.35], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }}
      style={{ touchAction: 'none' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={1.5} />
      <spotLight
        position={[6, 10, 6]}
        angle={0.45}
        penumbra={0.8}
        intensity={2.6}
        castShadow
        shadow-mapSize={2048}
      />
      <directionalLight position={[-5, 6, -4]} intensity={1.0} color="#FFFFFF" />
      <directionalLight position={[0, -3, 2]} intensity={0.4} color="#E0E7FF" />

      <Suspense fallback={<ModelLoader />}>
        <Float speed={autoRotate ? 1.4 : 0} rotationIntensity={0.06} floatIntensity={0.12}>
          <Center>
            <group scale={1.0}>
              <CategoryGLBModel
                type="sneaker"
                primaryColor={primaryColor}
                accentColor="#FFFFFF"
                soleColor="#111827"
                shoeTextureVariant={textureVariant}
                roughness={roughness}
                metalness={metalness}
                wireframe={false}
                autoRotate={autoRotate}
              />
            </group>
          </Center>
        </Float>

        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.5}
          scale={5.2}
          blur={2.2}
          far={3}
          color="#000000"
        />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        enableZoom={true}
        minDistance={1.0}
        maxDistance={3.5}
        maxPolarAngle={Math.PI / 1.72}
        autoRotate={false}
      />
    </Canvas>
  );
}

// ─── Main Showcase Component ────────────────────────────────────────────────
export const ShoeViewer3DShowcase: React.FC = () => {
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  // Color customized per brand (stores hex for each brand id)
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    walkaroo: BRANDS[0].colorways[0].hex,
    sparx: BRANDS[1].colorways[0].hex,
    'vkc-pride': BRANDS[2].colorways[0].hex,
    paragon: BRANDS[3].colorways[0].hex,
  });

  const [activeFinish, setActiveFinish] = useState<FinishMode>('mesh');
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>('3/4');

  const orbitRef = useRef<any>(null);

  const currentBrand = BRANDS[activeBrandIdx];
  const activeColorHex =
    selectedColors[currentBrand.id] || currentBrand.colorways[0].hex;

  const activeColorwayObj =
    currentBrand.colorways.find(
      (c) => c.hex.toLowerCase() === activeColorHex.toLowerCase()
    ) || currentBrand.colorways[0];

  const handleBrandChange = (newIdx: number) => {
    setActiveBrandIdx(newIdx);
  };

  const handlePrevBrand = () => {
    const nextIdx = (activeBrandIdx - 1 + BRANDS.length) % BRANDS.length;
    handleBrandChange(nextIdx);
  };

  const handleNextBrand = () => {
    const nextIdx = (activeBrandIdx + 1) % BRANDS.length;
    handleBrandChange(nextIdx);
  };

  const handleColorChange = (hex: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [currentBrand.id]: hex,
    }));
  };

  const handleCameraSnap = (preset: CameraPreset) => {
    setActiveCamera(preset);
    setAutoRotate(false);
    if (orbitRef.current) {
      const pos = CAMERA_PRESETS[preset].pos;
      orbitRef.current.object.position.set(...pos);
      orbitRef.current.target.set(0, 0, 0);
      orbitRef.current.update();
    }
  };

  const handleResetView = () => {
    handleCameraSnap('3/4');
    setAutoRotate(true);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello CSMART Shoe Mart! 👋\nI'm viewing the *${currentBrand.brand} 3D Showcase* on your website.\n\n*Product:* ${currentBrand.title}\n*SKU:* ${currentBrand.sku}\n*Customized Color:* ${activeColorwayObj.name}\n*Price:* ₹${currentBrand.price.toLocaleString('en-IN')}\n\nDo you have this article in my size in stock at your Tagarapuvalasa store?`;
    const url = `https://wa.me/919553536884?text=${encodeURIComponent(text)}`;
    openWhatsAppWithLog(url, {
      productTitle: `${currentBrand.brand} ${currentBrand.title} (${activeColorwayObj.name})`,
      sku: currentBrand.sku,
      brand: currentBrand.brand,
      price: currentBrand.price,
      color: activeColorwayObj.name,
      message: text,
      source: '3D_SHOWCASE',
    });
  };

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-[#070314] text-white select-none">
      {/* Dynamic Ambient Glow Shifted to Brand Color */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-full opacity-[0.22] blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activeColorHex} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[450px] h-[450px] rounded-full opacity-[0.16] blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${currentBrand.glowColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-widest mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
            <span>Interactive 3D Shoe Studio</span>
            <Sparkles className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Explore Popular Brands{' '}
            <span
              className="text-transparent bg-clip-text transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to right, #A855F7, ${currentBrand.glowColor}, #60A5FA)`,
              }}
            >
              in Interactive 3D
            </span>
          </h2>
          <p className="mt-2.5 text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Rotate 360°, inspect sole grip &amp; live-customize colors for each flagship brand shoe.
          </p>
        </div>

        {/* ── Brand Selection Tabs Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          {BRANDS.map((b, i) => {
            const isSelected = i === activeBrandIdx;
            const brandColor = selectedColors[b.id] || b.colorways[0].hex;

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleBrandChange(i)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-white/15 border-purple-400/80 shadow-xl scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Top Accent Bar */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1 transition-all"
                    style={{ backgroundColor: brandColor }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl">{b.logo}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-white/40 shadow-xs"
                    style={{ backgroundColor: brandColor }}
                    title={`Customized: ${b.brand}`}
                  />
                </div>
                <p className="text-white font-black text-sm mt-1.5 tracking-wide">
                  {b.brand}
                </p>
                <p className="text-slate-400 text-[10px] truncate leading-tight mt-0.5">
                  {b.title.split(' ')[0]} {b.title.split(' ')[1]}
                </p>
              </button>
            );
          })}
        </div>

        {/* ── Main 3D Canvas Box + Customizer Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* LEFT: 3D WebGL Canvas Card */}
          <div className="flex flex-col gap-3">
            <div
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentBrand.gradient} border border-white/15 shadow-2xl transition-all duration-500`}
              style={{
                boxShadow: `0 0 70px 0 ${currentBrand.glowColor}25, 0 25px 50px -12px rgba(0,0,0,0.7)`,
              }}
            >
              {/* Top Bar inside Canvas: Brand Pill + Live Price Tag */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
                {/* Brand Badge */}
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-lg pointer-events-auto">
                  <span className={`${currentBrand.badgeBg} text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase`}>
                    {currentBrand.logo} {currentBrand.brand}
                  </span>
                  <span className="text-[11px] font-bold text-slate-200 hidden sm:inline">
                    {currentBrand.title}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-lg pointer-events-auto">
                  <span className="text-emerald-400 font-black text-sm sm:text-base">
                    ₹{currentBrand.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 line-through text-[11px]">
                    ₹{currentBrand.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.5 rounded border border-emerald-400/30">
                    {currentBrand.discount}% OFF
                  </span>
                </div>
              </div>

              {/* Prev / Next Nav Arrows */}
              <button
                type="button"
                onClick={handlePrevBrand}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                title="Previous Brand"
                aria-label="Previous Brand"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextBrand}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                title="Next Brand"
                aria-label="Next Brand"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* The 3D Canvas Scene */}
              <div style={{ height: '420px' }}>
                <ShoeScene
                  key={`${currentBrand.id}-${activeBrandIdx}`}
                  primaryColor={activeColorHex}
                  textureVariant={currentBrand.defaultTexture}
                  finish={activeFinish}
                  autoRotate={autoRotate}
                  orbitRef={orbitRef}
                />
              </div>

              {/* Drag to rotate hint badge */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/70 text-[10px] font-semibold pointer-events-none border border-white/10">
                <RotateCcw className="w-3 h-3 text-purple-300 animate-spin-slow" />
                <span>Drag to Rotate 360° · Pinch / Scroll to Zoom</span>
              </div>

              {/* BOTTOM FLOATING CONTROLS BAR: Brand Color Swatches + Turntable + Angle Snaps */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 bg-black/65 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/15">
                {/* 1. Live Brand Color Swatches */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full animate-ping"
                      style={{ backgroundColor: activeColorHex }}
                    />
                    Color:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {currentBrand.colorways.map((cw) => {
                      const isColorActive =
                        activeColorHex.toLowerCase() === cw.hex.toLowerCase();
                      return (
                        <button
                          key={cw.hex}
                          type="button"
                          onClick={() => handleColorChange(cw.hex)}
                          className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                            isColorActive
                              ? 'border-white scale-110 shadow-lg ring-2 ring-purple-400'
                              : 'border-white/40 hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: cw.hex }}
                          title={`${cw.name} (${cw.label})`}
                        >
                          {isColorActive && (
                            <Check className="w-3 h-3 text-white drop-shadow-md stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] font-bold text-white max-w-[110px] truncate hidden sm:inline">
                    {activeColorwayObj.label}
                  </span>
                </div>

                {/* 2. Camera Angle Quick-Snaps + Turntable Toggle */}
                <div className="flex items-center gap-1">
                  {/* Turntable Pause / Play */}
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                      autoRotate
                        ? 'bg-purple-600/60 border-purple-400/80 text-white'
                        : 'bg-white/10 border-white/15 text-slate-300 hover:bg-white/20'
                    }`}
                    title={autoRotate ? 'Pause 360° Turntable' : 'Play 360° Turntable'}
                  >
                    {autoRotate ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">
                      {autoRotate ? 'Spin' : 'Paused'}
                    </span>
                  </button>

                  {/* Camera Angles */}
                  {(['3/4', 'profile', 'sole', 'top'] as CameraPreset[]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleCameraSnap(preset)}
                      className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                        activeCamera === preset
                          ? 'bg-white text-slate-900 border-white shadow-xs'
                          : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/20'
                      }`}
                      title={`View ${CAMERA_PRESETS[preset].label}`}
                    >
                      {preset === '3/4'
                        ? '3/4'
                        : preset === 'profile'
                        ? 'Side'
                        : preset === 'sole'
                        ? 'Sole'
                        : 'Top'}
                    </button>
                  ))}

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleResetView}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Reset Camera & Angle"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Brand Switcher Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleBrandChange(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeBrandIdx
                      ? 'w-7 h-2 bg-purple-400'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`View ${b.brand}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Live Customization & Technical Specs Panel */}
          <div className="space-y-4">
            {/* 1. Active Footwear Identity Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className={`${currentBrand.badgeBg} text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider`}>
                  {currentBrand.logo} {currentBrand.brand}
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-md">
                  SKU: {currentBrand.sku}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white leading-snug">
                  {currentBrand.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {currentBrand.tagline}
                </p>
              </div>

              {/* Active Colorway Highlight Pill */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span
                  className="w-4 h-4 rounded-full border border-white/50 shadow-xs shrink-0"
                  style={{ backgroundColor: activeColorHex }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Customized Colorway
                  </span>
                  <span className="text-xs font-black text-white block truncate">
                    {activeColorwayObj.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-md border border-purple-400/30 shrink-0">
                  3D Active
                </span>
              </div>
            </div>

            {/* 2. Material Finish Customizer Mode */}
            <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Material Surface Finish
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {FINISH_PRESETS[activeFinish].label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['mesh', 'gloss', 'matte'] as FinishMode[]).map((mode) => {
                  const preset = FINISH_PRESETS[mode];
                  const isModeActive = activeFinish === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setActiveFinish(mode)}
                      className={`px-2.5 py-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                        isModeActive
                          ? 'bg-purple-600/80 border-purple-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-[11px] leading-tight">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                {FINISH_PRESETS[activeFinish].desc}
              </p>
            </div>

            {/* 3. Authentic Brand Technical Specs */}
            <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2.5 shadow-xl">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Footwear Specifications
              </h4>

              <div className="space-y-1.5 text-xs divide-y divide-white/10">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 text-[11px]">Sole Tech:</span>
                  <span className="text-white font-bold text-[11px] text-right">
                    {currentBrand.specs.sole}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 text-[11px]">Upper Body:</span>
                  <span className="text-white font-bold text-[11px] text-right">
                    {currentBrand.specs.upper}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 text-[11px]">Net Weight:</span>
                  <span className="text-emerald-400 font-black text-[11px]">
                    {currentBrand.specs.weight}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 text-[11px]">Best For:</span>
                  <span className="text-slate-200 font-medium text-[11px] text-right">
                    {currentBrand.specs.usage}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. WhatsApp Inquiry Action Button */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enquire This {currentBrand.brand} on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoeViewer3DShowcase;
