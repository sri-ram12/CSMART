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
import { Sparkles, RotateCcw, ChevronLeft, ChevronRight, Zap, Eye } from 'lucide-react';
import { CategoryGLBModel } from '../3d/Footwear3DModels';

// ─── Brand Data ────────────────────────────────────────────────────────────────
// All 4 brands use the same sneaker GLB (shoe.glb) for a sharp, photorealistic result.
// Each has distinct brand colorway.
const BRANDS = [
  {
    id: 'walkaroo',
    brand: 'Walkaroo',
    title: 'Air Cushion Sports Sneaker',
    tagline: "India's #1 Comfort Footwear",
    primaryColor: '#1D4ED8',      // Deep Blue upper
    accentColor: '#FFFFFF',
    soleColor: '#111827',
    shoeTextureVariant: 'street_runner',
    badgeBg: 'bg-blue-600',
    glowColor: '#3B82F6',
    gradient: 'from-blue-950 via-blue-900 to-indigo-950',
    logo: '🥾',
  },
  {
    id: 'sparx',
    brand: 'Sparx',
    title: 'Pro-Flex Running Shoe',
    tagline: 'High-Performance Athletic',
    primaryColor: '#DC2626',      // Sparx signature red
    accentColor: '#FFFFFF',
    soleColor: '#1F2937',
    shoeTextureVariant: 'beach_runner',
    badgeBg: 'bg-red-600',
    glowColor: '#EF4444',
    gradient: 'from-red-950 via-red-900 to-rose-950',
    logo: '⚡',
  },
  {
    id: 'vkc-pride',
    brand: 'VKC Pride',
    title: 'Comfort Casual Sneaker',
    tagline: 'Premium Kerala Craftsmanship',
    primaryColor: '#7C3AED',      // VKC signature purple
    accentColor: '#EDE9FE',
    soleColor: '#18181B',
    shoeTextureVariant: 'midnight_runner',
    badgeBg: 'bg-violet-700',
    glowColor: '#8B5CF6',
    gradient: 'from-violet-950 via-purple-900 to-indigo-950',
    logo: '👑',
  },
  {
    id: 'paragon',
    brand: 'Paragon',
    title: 'Classic Everyday Sneaker',
    tagline: 'Trusted for 50+ Years',
    primaryColor: '#065F46',      // Paragon heritage green
    accentColor: '#D1FAE5',
    soleColor: '#052E16',
    shoeTextureVariant: 'street_runner',
    badgeBg: 'bg-emerald-700',
    glowColor: '#10B981',
    gradient: 'from-emerald-950 via-green-900 to-teal-950',
    logo: '✅',
  },
];

// ─── Model Loading Fallback ────────────────────────────────────────────────────
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 px-5 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[180px]">
        <div className="w-7 h-7 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-white/80 text-xs font-bold">
          {progress > 0 ? `Loading… ${progress.toFixed(0)}%` : 'Preparing 3D model…'}
        </span>
      </div>
    </Html>
  );
}

// ─── Single 3D Canvas Scene ────────────────────────────────────────────────────
interface SceneProps {
  brand: (typeof BRANDS)[0];
}

function ShoeScene({ brand }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.4, 0.55, 1.4], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }}
      style={{ touchAction: 'none', borderRadius: '0' }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      {/* Lighting */}
      <ambientLight intensity={1.4} />
      <spotLight
        position={[5, 9, 5]}
        angle={0.45}
        penumbra={0.8}
        intensity={2.5}
        castShadow
        shadow-mapSize={2048}
      />
      <directionalLight position={[-5, 6, -4]} intensity={0.9} color="#FFFFFF" />
      <directionalLight position={[0, -3, 2]} intensity={0.35} color="#E0E7FF" />

      <Suspense fallback={<ModelLoader />}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.14}>
          <Center>
            <group scale={1.0}>
              <CategoryGLBModel
                type="sneaker"
                primaryColor={brand.primaryColor}
                accentColor={brand.accentColor}
                soleColor={brand.soleColor}
                shoeTextureVariant={brand.shoeTextureVariant}
                wireframe={false}
                autoRotate={true}
              />
            </group>
          </Center>
        </Float>

        <ContactShadows
          position={[0, -0.72, 0]}
          opacity={0.45}
          scale={5}
          blur={2.2}
          far={3}
          color="#0F172A"
        />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.0}
        maxDistance={3.5}
        maxPolarAngle={Math.PI / 1.75}
        autoRotate={false}
      />
    </Canvas>
  );
}

// ─── Main Showcase Component ───────────────────────────────────────────────────
export const ShoeViewer3DShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  // Key forces Canvas remount on brand switch (avoids stale GLB state)
  const [canvasKey, setCanvasKey] = useState(0);

  const current = BRANDS[activeIdx];

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setCanvasKey((k) => k + 1);
  };

  const handlePrev = () =>
    handleSelect((activeIdx - 1 + BRANDS.length) % BRANDS.length);
  const handleNext = () =>
    handleSelect((activeIdx + 1) % BRANDS.length);

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-[#080418]">
      {/* Ambient color orbs that shift per brand */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-16 w-[500px] h-[500px] rounded-full opacity-[0.18] blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${current.glowColor} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-[400px] h-[400px] rounded-full opacity-[0.12] blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${current.primaryColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 fill-purple-400" />
            Interactive 3D Showcase
            <Sparkles className="w-3.5 h-3.5 fill-purple-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            View Our Footwear{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400">
              in 3D
            </span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Rotate &amp; inspect top brand shoes in stunning interactive 3D — just like holding them in your hands.
          </p>
        </div>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Left: 3D Canvas */}
          <div>
            <div
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${current.gradient} shadow-2xl`}
              style={{
                boxShadow: `0 0 60px 0 ${current.glowColor}30, 0 25px 50px -12px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Nav arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white transition backdrop-blur-sm cursor-pointer"
                aria-label="Previous brand"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/15 text-white transition backdrop-blur-sm cursor-pointer"
                aria-label="Next brand"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* The 3D Canvas */}
              <div style={{ height: '430px' }}>
                <ShoeScene key={canvasKey} brand={current} />
              </div>

              {/* Brand badge — top left */}
              <div className="absolute top-4 left-14 z-20">
                <span
                  className={`${current.badgeBg} text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg`}
                >
                  {current.logo} {current.brand}
                </span>
              </div>

              {/* Drag hint — bottom center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/65 text-[10px] font-semibold pointer-events-none">
                <RotateCcw className="w-3 h-3" />
                Drag to rotate · Scroll to zoom
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIdx
                      ? 'w-8 h-2.5 bg-purple-400'
                      : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`View ${b.brand}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-4">
            {/* Current brand card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              <span
                className={`inline-block ${current.badgeBg} text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider`}
              >
                {current.logo} {current.brand}
              </span>
              <h3 className="text-xl font-black text-white leading-snug">
                {current.title}
              </h3>
              <p className="text-slate-400 text-sm">{current.tagline}</p>
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold pt-1">
                <Eye className="w-3.5 h-3.5" />
                Interactive 3D WebGL Model
              </div>
            </div>

            {/* Why 3D */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-white font-black text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Why 3D Viewing?
              </h4>
              {[
                'Inspect every angle — sole, heel, toe box',
                'See true colors & material texture',
                'Zoom in on stitching & sole grip',
                'Make confident buying decisions',
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-slate-400 text-xs">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-purple-800/60 border border-purple-600/40 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 block" />
                  </span>
                  {feat}
                </div>
              ))}
            </div>

            {/* Brand selector grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {BRANDS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(i)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    i === activeIdx
                      ? 'bg-white/12 border-purple-400/50 scale-[1.02] shadow-lg'
                      : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15'
                  }`}
                >
                  <span className="text-xl">{b.logo}</span>
                  <p className="text-white font-black text-xs mt-1.5">{b.brand}</p>
                  <p className="text-slate-500 text-[10px] truncate leading-tight">
                    {b.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoeViewer3DShowcase;
