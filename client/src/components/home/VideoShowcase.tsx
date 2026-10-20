import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoReel {
  id: string;
  title: string;
  category: string;
  shoeTitle: string;
  shoeLink: string;
  videoUrl: string;
  poster: string;
  description: string;
}

export const VideoShowcase: React.FC = () => {
  const videoReels: VideoReel[] = [
    {
      id: 'reel-1',
      title: 'Nitro Propulsion & Energy Return',
      category: 'Performance Engineering',
      shoeTitle: 'Chandhana Apex Nitro Hyper-Speed Runner',
      shoeLink: '/product/chandhana-apex-nitro-hyper-speed-runner',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-legs-of-a-person-running-on-a-pavement-41484-large.mp4',
      poster: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
      description: 'Witness the compression and rebound dynamics of dual-density nitrogen foam on urban tarmac.',
    },
    {
      id: 'reel-2',
      title: 'Monarch Court Streetstyle Walk',
      category: 'Lifestyle & Heritage',
      shoeTitle: 'Chandhana Monarch Suede Heritage Sneaker',
      shoeLink: '/product/chandhana-monarch-suede-heritage-sneaker',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-feet-of-a-man-walking-with-sneakers-40087-large.mp4',
      poster: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=80',
      description: 'Supple suede overlays paired with honey gum rubber outsoles for timeless street aesthetics.',
    },
    {
      id: 'reel-3',
      title: 'CloudStrata High-Speed Treadmill Pace',
      category: "Women's Athletics",
      shoeTitle: 'Chandhana CloudStrata Women’s Trainer',
      shoeLink: '/product/chandhana-cloudstrata-womens-trainer',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-running-on-a-treadmill-41485-large.mp4',
      poster: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=80',
      description: 'Zoned FlexKnit upper flexing naturally with forefoot metatarsals during high-cadence strides.',
    },
    {
      id: 'reel-4',
      title: 'CloudStep Hydro-Tread Water Resistance',
      category: 'Slippers & Recovery',
      shoeTitle: 'Chandhana CloudStep Ultra-Cushion Slides',
      shoeLink: '/product/chandhana-cloudstep-ultra-cushion-slides',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-feet-of-a-person-walking-in-the-pool-42861-large.mp4',
      poster: 'https://images.unsplash.com/photo-1603808033176-9d134970ab36?w=1200&auto=format&fit=crop&q=80',
      description: '45mm bio-EVA platform dissipating surface water instantly with zero slip on wet porcelain tile.',
    },
  ];

  const [activeReel, setActiveReel] = useState<VideoReel>(videoReels[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSelectReel = (reel: VideoReel) => {
    setActiveReel(reel);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Footwear In Motion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Product Demonstration & Motion Gallery
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            High-definition video reels showcasing sole flexibility, cushioning compression, and real-world traction.
          </p>
        </div>

        {/* Video Player + Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Stage Video Player */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black group border-none">
            <video
              ref={videoRef}
              src={activeReel.videoUrl}
              poster={activeReel.poster}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Controls Bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              {/* Top status */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-red-600 px-3.5 py-1 rounded-full shadow-md border-none">
                  {activeReel.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="border-none p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 hover:text-red-600 transition-colors shadow-sm"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    className="border-none p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 hover:text-red-600 transition-colors shadow-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bottom information banner */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow">
                  {activeReel.title}
                </h3>
                <p className="text-xs text-slate-200 max-w-xl drop-shadow">
                  {activeReel.description}
                </p>

                <div className="pt-2">
                  <Link
                    to={activeReel.shoeLink}
                    className="btn-primary text-xs font-bold py-2.5 px-5 inline-flex items-center gap-2"
                  >
                    <span>View {activeReel.shoeTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Featured Footwear Reels (4)
            </h4>

            {videoReels.map((reel) => {
              const isActive = activeReel.id === reel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer flex gap-3.5 items-center border-none ${
                    isActive
                      ? 'bg-red-50 ring-2 ring-red-600 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 shadow-sm">
                    <img
                      src={reel.poster}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play
                        className={`w-4 h-4 ${
                          isActive ? 'text-red-500 fill-current' : 'text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-wider block">
                      {reel.category}
                    </span>
                    <h5
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-red-700' : 'text-slate-900'
                      }`}
                    >
                      {reel.title}
                    </h5>
                    <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                      {reel.shoeTitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
