import React, { useState, Suspense, lazy } from 'react';
import { Sparkles, RotateCcw, Eye, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

// Lazy-load the heavy 3D viewer so it doesn't block initial page paint
const Shoe3DViewer = lazy(() =>
  import('../3d/Shoe3DViewer').then((m) => ({ default: m.Shoe3DViewer }))
);

// Popular flagship brand showcase items
const POPULAR_BRAND_MODELS = [
  {
    id: 'walkaroo-air',
    brand: 'Walkaroo',
    title: 'Air Cushion Sports Sneaker',
    tagline: "India's #1 Comfort Footwear",
    type: 'sneaker' as const,
    primaryColor: '#1E40AF',
    accentColor: '#FFFFFF',
    soleColor: '#18181B',
    badgeColor: 'bg-blue-600',
    gradient: 'from-blue-900 via-blue-800 to-indigo-900',
    accentGlow: 'shadow-blue-500/40',
    logo: '🥾',
  },
  {
    id: 'sparx-runner',
    brand: 'Sparx',
    title: 'Pro-Flex Running Shoe',
    tagline: 'High-Performance Athletic',
    type: 'sneaker' as const,
    primaryColor: '#DC2626',
    accentColor: '#FFFFFF',
    soleColor: '#1F2937',
    badgeColor: 'bg-red-600',
    gradient: 'from-red-900 via-red-800 to-rose-900',
    accentGlow: 'shadow-red-500/40',
    logo: '⚡',
  },
  {
    id: 'vkc-pride-formal',
    brand: 'VKC Pride',
    title: 'Comfort Formal Classic',
    tagline: 'Premium Kerala Craftsmanship',
    type: 'formal' as const,
    primaryColor: '#1C1917',
    accentColor: '#D4A373',
    soleColor: '#0C0A09',
    badgeColor: 'bg-amber-700',
    gradient: 'from-stone-900 via-amber-950 to-stone-900',
    accentGlow: 'shadow-amber-500/40',
    logo: '👞',
  },
  {
    id: 'paragon-sandal',
    brand: 'Paragon',
    title: 'Slick Floater Sandal',
    tagline: 'Trusted for 50+ Years',
    type: 'slipper' as const,
    primaryColor: '#065F46',
    accentColor: '#D1FAE5',
    soleColor: '#064E3B',
    badgeColor: 'bg-emerald-700',
    gradient: 'from-emerald-900 via-green-900 to-teal-900',
    accentGlow: 'shadow-emerald-500/40',
    logo: '🩴',
  },
];

// Mini spinner for 3D canvas load
function ViewerLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl z-10">
      <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-white/80 text-xs font-bold">Loading 3D Model…</span>
    </div>
  );
}

// Minimal stub product for Shoe3DViewer compatibility
function makeStubProduct(item: (typeof POPULAR_BRAND_MODELS)[0]) {
  return {
    id: item.id,
    title: item.title,
    brand: item.brand,
    has3D: true,
    model3DConfig: JSON.stringify({
      type: item.type,
      primaryColor: item.primaryColor,
      accentColor: item.accentColor,
      soleColor: item.soleColor,
      autoRotate: true,
      wireframe: false,
      scale: 1,
    }),
  };
}

export const ShoeViewer3DShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewerKey, setViewerKey] = useState(0); // force re-mount on brand switch

  const current = POPULAR_BRAND_MODELS[activeIdx];

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setViewerKey((k) => k + 1);
  };

  const handlePrev = () => handleSelect((activeIdx - 1 + POPULAR_BRAND_MODELS.length) % POPULAR_BRAND_MODELS.length);
  const handleNext = () => handleSelect((activeIdx + 1) % POPULAR_BRAND_MODELS.length);

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-[#0D0621]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-80px] left-[-60px] w-[420px] h-[420px] rounded-full opacity-20 blur-3xl transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${current.primaryColor} 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full opacity-15 blur-3xl transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${current.accentColor} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
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
            Rotate, inspect, and explore top brand shoes in stunning interactive 3D — just like holding them in your hands.
          </p>
        </div>

        {/* Main Layout: Viewer + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-center">
          {/* 3D Canvas Viewer */}
          <div className="relative">
            <div
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${current.gradient} shadow-2xl ${current.accentGlow} shadow-2xl`}
              style={{ minHeight: '380px' }}
            >
              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition backdrop-blur-sm cursor-pointer"
                aria-label="Previous brand"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition backdrop-blur-sm cursor-pointer"
                aria-label="Next brand"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Viewer */}
              <div className="relative" style={{ height: '420px' }}>
                <Suspense fallback={<ViewerLoader />}>
                  <Shoe3DViewer
                    key={viewerKey}
                    product={makeStubProduct(current) as any}
                    footwearType={current.type}
                    primaryColor={current.primaryColor}
                    accentColor={current.accentColor}
                    soleColor={current.soleColor}
                    height="h-[420px]"
                    allowFullscreen={false}
                  />
                </Suspense>
              </div>

              {/* Brand Badge Overlay */}
              <div className="absolute top-4 left-4 z-20">
                <span className={`${current.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg`}>
                  {current.logo} {current.brand}
                </span>
              </div>

              {/* Drag hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/70 text-[10px] font-bold">
                <RotateCcw className="w-3 h-3" />
                Drag to rotate • Scroll to zoom
              </div>
            </div>

            {/* Brand Dots Navigation */}
            <div className="flex items-center justify-center gap-2.5 mt-5">
              {POPULAR_BRAND_MODELS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIdx
                      ? 'w-8 h-2.5 bg-purple-400'
                      : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`View ${m.brand}`}
                />
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-5">
            {/* Current Brand Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-3">
              <div className={`inline-block ${current.badgeColor} text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider`}>
                {current.brand}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">{current.title}</h3>
              <p className="text-slate-400 text-sm">{current.tagline}</p>
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                <Eye className="w-3.5 h-3.5" />
                Interactive 3D WebGL Model
              </div>
            </div>

            {/* Feature Points */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3">
              <h4 className="text-white font-black text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Why 3D Viewing?
              </h4>
              {[
                'Inspect every angle — sole, heel, toe box',
                'See true colors & material texture',
                'Zoom in on stitching & sole grip patterns',
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

            {/* Brand Selector Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {POPULAR_BRAND_MODELS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(i)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    i === activeIdx
                      ? 'bg-white/15 border-purple-400/60 scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg">{m.logo}</span>
                  <p className="text-white font-black text-xs mt-1">{m.brand}</p>
                  <p className="text-slate-500 text-[10px] truncate">{m.title}</p>
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
