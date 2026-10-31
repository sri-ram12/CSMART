import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  Star,
  CheckCircle2,
  Sparkles,
  Store,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { storeLocationDetails } from '../../data/storeLocationDetails';

export const StoreLocationShowcase: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { address, phone, openingHours, rating, photos, googleMaps, customerReviews } = storeLocationDetails;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#FAF7FD] to-white border-y border-purple-100/70 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            HEADER: STORE LOCATION & GOOGLE MAPS VERIFICATION
           ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-black tracking-wide shadow-2xs">
              <Store className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>VISIT OUR PHYSICAL STORE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                <span>Chandhana Shoe Mart</span>
                <span className="text-sm sm:text-base font-bold text-red-600 bg-red-50 border border-red-200/60 px-2.5 py-0.5 rounded-lg">
                  చందన షూమార్ట్
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#5B21B6] flex items-center gap-2">
                <span>పాదరక్షల బృందావనం • Quality First...</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">Opp. Tata Theatre, Main Road, Tagarapuvalasa</span>
              </p>
            </div>
          </div>

          {/* Google Maps Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={googleMaps.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-102 active:scale-98"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={`tel:${phone.tel}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold shadow-2xs transition-all hover:scale-102 active:scale-98"
            >
              <Phone className="w-4 h-4 text-[#7C3AED]" />
              <span>{phone.display}</span>
            </a>
          </div>
        </div>

        {/* ========================================================
            MAIN GRID: 5 REAL STORE PHOTOS + LIVE STORE DETAILS CARD
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT: 5 Authentic Storefront & Ambiance Photos */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Official Storefront & Real Ambiance
              </h3>
              <span className="text-xs font-bold text-[#5B21B6]">{photos.length} Verified Photos</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPhoto(p.localPath)}
                  className={`group relative rounded-2xl overflow-hidden bg-slate-100 border border-purple-100/80 shadow-xs hover:shadow-md transition-all cursor-pointer ${
                    idx === 0 ? 'col-span-2 aspect-[16/9]' : 'col-span-1 aspect-[4/3]'
                  }`}
                >
                  <img
                    src={p.localPath}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Flagship Storefront Badge for Hero Photo */}
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#5B21B6]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-purple-300/30">
                      <Store className="w-3.5 h-3.5 text-amber-300" />
                      <span>Official Store Signboard & Entrance</span>
                    </div>
                  )}

                  {/* Caption & Zoom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                    <div className="min-w-0 pr-2">
                      <p className={`font-bold leading-tight truncate ${idx === 0 ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs'}`}>
                        {p.title}
                      </p>
                      <p className={`text-white/80 truncate ${idx === 0 ? 'text-xs' : 'text-[9px]'}`}>
                        {p.description}
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Live Store Details Card with Hours & Reviews */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
              {/* Google Rating Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-slate-900">{rating.score}</span>
                      <span className="text-xs text-slate-400">/ {rating.maxScore}</span>
                      <div className="flex text-amber-400">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Based on {rating.totalReviews} Google Reviews
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                  {openingHours.currentStatus}
                </span>
              </div>

              {/* Exact Physical Address */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">
                      Opposite Tata Theatre, Main Road
                    </p>
                    <p className="text-slate-600">
                      Tagarapuvalasa, Visakhapatnam, Andhra Pradesh - 531162
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Coordinates: 17.9318° N, 83.4274° E
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours Table */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Store Hours</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {openingHours.dailySchedule.map((s) => (
                    <div
                      key={s.day}
                      className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                        s.day === 'Tuesday'
                          ? 'bg-amber-50/70 text-amber-800'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold">{s.day.slice(0, 3)}:</span>
                      <span className={s.day === 'Tuesday' ? 'font-bold' : ''}>
                        {s.day === 'Tuesday' ? 'Closed' : '9am - 9pm'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Reviews Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Customer Quotes from Google Maps
                </p>
                <div className="space-y-2">
                  {customerReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-[#FAF7FD] border border-purple-100/60 flex items-start gap-2.5"
                    >
                      <img
                        src={r.avatar}
                        alt={r.author}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 italic">
                          "{r.quote}"
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-medium">
                            {r.author}
                          </span>
                          <span className="text-[9px] text-amber-500 font-bold">
                            ★★★★☆
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Maps Action */}
              <a
                href={googleMaps.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF7FD] hover:bg-[#EDE9FE] text-[#5B21B6] font-bold text-xs border border-purple-200/80 transition-colors"
              >
                <span>View Live Location on Google Maps</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM: INTERACTIVE LIVE GOOGLE MAP EMBED
           ======================================================== */}
        <div className="mt-10 p-5 sm:p-7 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#5B21B6]">
                <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Interactive Live Google Map Location</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Find Chandana Shoe Mart on the Map
              </h4>
              <p className="text-xs text-slate-500">
                Opposite Tata Theatre, Main Road, Tagarapuvalasa, Visakhapatnam, Andhra Pradesh 531162
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={googleMaps.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map iframe with Pin */}
          <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden border border-purple-200/60 shadow-inner bg-slate-100">
            <iframe
              title="Chandana Shoe Mart Tagarapuvalasa Live Location Map"
              src="https://maps.google.com/maps?q=17.9318122,83.4274064+(Chandana+Shoe+Mart)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Quick Landmark & Store Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7FD] border border-purple-100/60">
              <Store className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Landmark</p>
                <p className="text-[11px] text-slate-500">Opposite Tata Theatre (Main Road)</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7FD] border border-purple-100/60">
              <Clock className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Business Hours</p>
                <p className="text-[11px] text-slate-500">9:00 AM – 9:00 PM (Tuesday Closed)</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7FD] border border-purple-100/60">
              <Phone className="w-4 h-4 text-[#7C3AED] shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Direct Contact</p>
                <a href={`tel:${phone.tel}`} className="text-[11px] text-[#5B21B6] font-semibold hover:underline">
                  {phone.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL-SCREEN PHOTO MODAL ON CLICK
         ======================================================== */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/10 text-white">
              <div className="min-w-0 pr-4">
                <h4 className="font-bold text-sm sm:text-base text-white truncate">
                  {photos.find((p) => p.localPath === selectedPhoto)?.title || 'Chandana Shoe Mart'}
                </h4>
                <p className="text-xs text-slate-300 truncate">
                  {photos.find((p) => p.localPath === selectedPhoto)?.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer border-none shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-5 flex items-center justify-center bg-black/60">
              <img
                src={selectedPhoto}
                alt="Enlarged Shop View"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StoreLocationShowcase;
