import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { VideoAd } from '../../types';
import {
  Film,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MessageCircle,
  Tag,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { openWhatsAppWithLog } from '../../utils/whatsapp';

// Fallback high-quality curated brand promotional reels in case DB is empty
const FALLBACK_ADS: VideoAd[] = [
  {
    id: 'fallback-1',
    title: 'Walkaroo CloudStep Comfort Fest - 25% OFF',
    tagline: 'Ultra-lightweight walking footwear designed for all-day comfort',
    brand: 'Walkaroo',
    videoUrl: 'https://v1.pinimg.com/videos/mc/expMp4/ef/7e/62/ef7e6264480c3130998fb23372e40b87_t1.mp4',
    posterUrl: 'https://i.pinimg.com/736x/4b/47/61/4b47616d0e460266e69d57466228050b.jpg',
    offerText: 'FLAT 25% OFF FESTIVE DEAL',
    linkUrl: '/shop?brand=Walkaroo',
    ctaText: 'Enquire on WhatsApp',
    isActive: true,
    order: 1,
    viewsCount: 142,
    clicksCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    title: 'Sparx High-Octane Athletic Stride',
    tagline: 'Engineered for speed, high-impact athletic performance & durability',
    brand: 'Sparx',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/46/4b/74/464b748b0b8f698d60d9c423d27e7a18_720w.mp4',
    posterUrl: 'https://i.pinimg.com/736x/34/7b/22/347b22b79b43940703f90924820b4c07.jpg',
    offerText: 'BUY 1 GET SPECIAL DISCOUNT',
    linkUrl: '/shop?brand=Sparx',
    ctaText: 'Enquire on WhatsApp',
    isActive: true,
    order: 2,
    viewsCount: 205,
    clicksCount: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    title: 'VKC Pride Royale PU Casual Collection',
    tagline: 'Long-life PU durability combined with classic executive styling',
    brand: 'VKC Pride',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b4/17/45/b41745e2a05dcc91fc513a1bbc0c7729_720w.mp4',
    posterUrl: 'https://i.pinimg.com/736x/de/8e/23/de8e23545aeaacc357a06f463127d030.jpg',
    offerText: 'LIMITED EDITION ARRIVAL',
    linkUrl: '/shop?brand=VKC+Pride',
    ctaText: 'Enquire on WhatsApp',
    isActive: true,
    order: 3,
    viewsCount: 98,
    clicksCount: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    title: 'Paragon Vertex All-Terrain Outdoor Sandal',
    tagline: 'Trusted skid-resistant grip for 50+ years of rugged Indian roads',
    brand: 'Paragon',
    videoUrl: 'https://v1.pinimg.com/videos/iht/expMp4/b5/74/a8/b574a8ac276fdf349d7ce80ccec76960_720w.mp4',
    posterUrl: 'https://i.pinimg.com/736x/41/8a/f4/418af4b511557d392f0e701381e80adb.jpg',
    offerText: 'STORE SPECIAL ₹699 ONLY',
    linkUrl: '/shop?brand=Paragon',
    ctaText: 'Enquire on WhatsApp',
    isActive: true,
    order: 4,
    viewsCount: 180,
    clicksCount: 37,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const VideoAdsShowcase: React.FC = () => {
  const [ads, setAds] = useState<VideoAd[]>(FALLBACK_ADS);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch live active ads from server
  useEffect(() => {
    api.videoAds
      .getActive()
      .then((data) => {
        if (data && data.length > 0) {
          setAds(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load live video ads, using fallback:', err);
      });
  }, []);

  const currentAd = ads[activeIdx] || FALLBACK_ADS[0];

  // When active ad changes, track view and restart play
  useEffect(() => {
    if (currentAd?.id && !currentAd.id.startsWith('fallback-')) {
      api.videoAds.trackView(currentAd.id).catch(() => {});
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeIdx, currentAd?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoEnded = () => {
    // Automatically transition to next video ad in loop
    setActiveIdx((prev) => (prev + 1) % ads.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % ads.length);
  };

  const handleWhatsAppEnquiry = () => {
    const text = `Hello Chandhana Shoe Mart! 👋\nI am watching your Video Ad on the website:\n🎬 *${currentAd.title}*\n🏷️ *Offer:* ${currentAd.offerText || 'Special Store Discount'}\n👟 *Brand:* ${currentAd.brand || 'Footwear'}\n\nPlease share more photos, available sizes, and store price!`;
    const url = `https://wa.me/919553536884?text=${encodeURIComponent(text)}`;
    openWhatsAppWithLog(url, {
      productTitle: `Video Ad: ${currentAd.title}`,
      brand: currentAd.brand,
      message: text,
      source: 'VIDEO_AD_REEL',
    });
  };

  if (!ads || ads.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-purple-50/40 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-[#5B21B6] text-xs font-black uppercase tracking-widest mb-3 shadow-2xs">
            <Film className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Store Video Ads &amp; Offer Reels</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Watch Fresh In-Store{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B21B6] to-[#7C3AED]">
              Video Ads &amp; Deals
            </span>
          </h2>
          <p className="mt-2.5 text-slate-500 text-xs sm:text-sm">
            Live promotions &amp; shoe video reels shared directly from our Tagarapuvalasa showroom. Tap below to inquire on WhatsApp!
          </p>
        </div>

        {/* Main Reel Player Layout: Big Video Card + Thumbnails List */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-center">
          {/* LEFT: Master Video Ad Player */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-purple-200/80 group">
            {/* The HTML5 Video Element */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/11] bg-black overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                src={currentAd.videoUrl}
                poster={currentAd.posterUrl}
                playsInline
                autoPlay
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />

              {/* Bottom Video Progress Scrubber */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Video Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

              {/* Top Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#5B21B6] text-white shadow-md">
                    {currentAd.brand || 'Featured'}
                  </span>
                  {currentAd.offerText && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {currentAd.offerText}
                    </span>
                  )}
                </div>

                {/* Sound & Playback Controls */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer border border-white/20 shadow-lg"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition cursor-pointer border border-white/20 shadow-lg"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 fill-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer border border-white/20 shadow-lg hover:scale-105 active:scale-95"
                title="Previous Video Ad"
                aria-label="Previous Video Ad"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer border border-white/20 shadow-lg hover:scale-105 active:scale-95"
                title="Next Video Ad"
                aria-label="Next Video Ad"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Video Ad Info & WhatsApp CTA */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white pointer-events-none">
                <div className="max-w-md space-y-1">
                  <h3 className="text-base sm:text-xl font-black leading-snug drop-shadow-md">
                    {currentAd.title}
                  </h3>
                  {currentAd.tagline && (
                    <p className="text-xs sm:text-sm text-slate-300 drop-shadow-sm line-clamp-2">
                      {currentAd.tagline}
                    </p>
                  )}
                </div>

                {/* WhatsApp Action Button */}
                <div className="pointer-events-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleWhatsAppEnquiry}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition hover:scale-105 active:scale-95 cursor-pointer border border-emerald-300/40"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{currentAd.ctaText || 'Enquire on WhatsApp'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Video Ads Playlist / Quick Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#5B21B6]" />
                Featured Video Ads ({ads.length})
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Tap to Watch
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 [scrollbar-width:thin]">
              {ads.map((ad, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={ad.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-3 ${
                      isActive
                        ? 'bg-purple-50/90 border-purple-400 shadow-md scale-[1.01]'
                        : 'bg-white border-purple-100/70 hover:border-purple-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    {/* Small Video Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      <video
                        src={ad.videoUrl}
                        poster={ad.posterUrl}
                        preload="metadata"
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center shadow-xs">
                            <Play className="w-3 h-3 fill-white ml-0.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/70 text-slate-900 flex items-center justify-center">
                            <Play className="w-3 h-3 fill-slate-900 ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ad Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#5B21B6] text-white">
                          {ad.brand}
                        </span>
                        {ad.offerText && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 truncate">
                            {ad.offerText}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">
                        {ad.title}
                      </h4>
                      {ad.tagline && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {ad.tagline}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct Shop Link Button */}
            <a
              href="/shop"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B21B6] font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
            >
              <span>Explore All Shoes &amp; Deals in Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAdsShowcase;

