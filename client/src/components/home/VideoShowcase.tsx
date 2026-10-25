import React from 'react';
import { Film, Sparkles } from 'lucide-react';

interface PinterestReel {
  id: string;
  pinUrl: string;
  videoUrl: string;
  poster: string;
  title: string;
  category: string;
  brand: string;
}

const PINTEREST_REELS: PinterestReel[] = [
  {
    id: 'pin-1',
    pinUrl: 'https://pin.it/2j1DZWwuB',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/46/4b/74/464b748b0b8f698d60d9c423d27e7a18_720w.mp4',
    poster: 'https://i.pinimg.com/736x/34/7b/22/347b22b79b43940703f90924820b4c07.jpg',
    title: 'Street Style Premium Sneaker',
    category: 'Men’s Performance',
    brand: 'Street Edition',
  },
  {
    id: 'pin-2',
    pinUrl: 'https://pin.it/5q7rnRCzO',
    videoUrl: 'https://v1.pinimg.com/videos/mc/expMp4/ef/7e/62/ef7e6264480c3130998fb23372e40b87_t1.mp4',
    poster: 'https://i.pinimg.com/736x/4b/47/61/4b47616d0e460266e69d57466228050b.jpg',
    title: 'Women’s Casual Fashion Kicks',
    category: 'Chic Lifestyle',
    brand: 'Urban Style',
  },
  {
    id: 'pin-3',
    pinUrl: 'https://pin.it/6s8S70QzT',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b5/74/a8/b574a8ac276fdf349d7ce80ccec76960_720w.mp4',
    poster: 'https://i.pinimg.com/736x/41/8a/f4/418af4b511557d392f0e701381e80adb.jpg',
    title: 'Supernova Velocity Runner',
    category: 'Pro Athletic',
    brand: 'Adidas Supernova',
  },
  {
    id: 'pin-4',
    pinUrl: 'https://pin.it/4CmW61Q7T',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b4/17/45/b41745e2a05dcc91fc513a1bbc0c7729_720w.mp4',
    poster: 'https://i.pinimg.com/736x/de/8e/23/de8e23545aeaacc357a06f463127d030.jpg',
    title: 'Aesthetic Pastel Lifestyle Sneaker',
    category: 'Casual Comfort',
    brand: 'Pastel Street',
  },
  {
    id: 'pin-5',
    pinUrl: 'https://pin.it/5GhVBccYM',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/ad/19/e1/ad19e187110de79c03b716190852dc8d_720w.mp4',
    poster: 'https://i.pinimg.com/736x/ce/da/13/ceda13dd05d3c9f958af31064fd5fa6a.jpg',
    title: 'Dynamic Air Athletic Stride',
    category: 'High-Impact Sprint',
    brand: 'Nike Dynamic',
  },
  {
    id: 'pin-6',
    pinUrl: 'https://pin.it/lCU2UfW6m',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/80/9d/f8/809df8c9ee1ef168a9ec4fb08516824d_720w.mp4',
    poster: 'https://i.pinimg.com/736x/71/09/23/7109238b487aa468e09ce79254cdc4e8.jpg',
    title: 'Kids Active Comfort & Play',
    category: 'Kids Athletic',
    brand: 'New Balance Kids',
  },
  {
    id: 'pin-7',
    pinUrl: 'https://pin.it/1i885PosO',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/fa/fb/d4/fafbd40f0e546bc76e681f7ac43a6aed_720w.mp4',
    poster: 'https://i.pinimg.com/736x/cd/e2/95/cde2958ed8b71fa8781b5401f824f4bf.jpg',
    title: 'Gel-Kayano Ergonomic Walk',
    category: 'Orthopedic Cushion',
    brand: 'ASICS Gel Pro',
  },
];

export const VideoShowcase: React.FC = () => {
  // Duplicated list for seamless infinite autoscroll loop
  const duplicatedReels = [...PINTEREST_REELS, ...PINTEREST_REELS];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF7FD] to-white overflow-hidden border-none select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* Clean Header without unnecessary buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold tracking-wider uppercase shadow-2xs border-none">
              <Film className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Pinterest Motion Gallery</span>
              <span className="text-purple-300">•</span>
              <span className="text-[10px] text-purple-900 font-black">Autoscroll Reels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-slate-900 tracking-tight">
              Footwear in Dynamic Motion
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Seamless borderless reels capturing real-world sole flexibility, cushioning rebound, and everyday comfort. Hover to pause.
          </p>
        </div>
      </div>

      {/* Infinite Seamless Autoscroll Ribbon of Borderless Videos */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-[#FAF7FD] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-[#FAF7FD] to-transparent z-10" />

        {/* Autoscrolling Track (no borders, no unnecessary buttons) */}
        <div className="animate-reels-scroll flex items-center gap-4 sm:gap-6 px-4">
          {duplicatedReels.map((reel, idx) => (
            <div
              key={`${reel.id}-${idx}`}
              className="relative w-56 sm:w-64 md:w-72 h-[360px] sm:h-[420px] md:h-[460px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-slate-900 shadow-xl group border-none shrink-0"
            >
              {/* HTML5 Native Muted Looping Video without borders or controls */}
              <video
                src={reel.videoUrl}
                poster={reel.poster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />

              {/* Seamless Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Minimalist Top Live Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/90 drop-shadow-sm">
                  {reel.brand}
                </span>
              </div>

              {/* Bottom Subtle Glass Tag */}
              <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border-none pointer-events-none">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#D8B4F8] mb-0.5">
                  {reel.category}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm">
                  {reel.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
