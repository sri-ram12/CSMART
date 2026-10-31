import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { VideoAd } from '../../types';
import {
  ArrowLeft,
  Plus,
  Play,
  Pause,
  Trash2,
  Eye,
  Film,
  Upload,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Tag,
  MessageCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const POPULAR_BRANDS = [
  'Walkaroo',
  'Sparx',
  'VKC Pride',
  'Paragon',
  'Doctor Choice',
  'Airpistha',
  'Walkmate',
  'Striker',
  'Brano',
  'Redfort',
  'Zaguaar',
  'Hison',
  'Poster Shoes',
  'Lancer',
  'Jockey',
  'Sushma',
  'TR Selections',
  'ZM Selections',
  'Chandhana Special',
];

export const AdminVideoAdsPage: React.FC = () => {
  const [ads, setAds] = useState<VideoAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<VideoAd | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [brand, setBrand] = useState('Walkaroo');
  const [offerText, setOfferText] = useState('FLAT 25% OFF FESTIVE DEAL');
  const [ctaText, setCtaText] = useState('Enquire on WhatsApp');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [videoSourceType, setVideoSourceType] = useState<'gallery' | 'url'>('gallery');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Video preview modal
  const [previewAd, setPreviewAd] = useState<VideoAd | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAds = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getVideoAds();
      setAds(data || []);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to load video ads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingAd(null);
    setTitle('');
    setTagline('');
    setBrand('Walkaroo');
    setOfferText('FLAT 25% OFF FESTIVE DEAL');
    setCtaText('Enquire on WhatsApp');
    setLinkUrl('/shop');
    setVideoUrl('');
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoSourceType('gallery');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ad: VideoAd) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setTagline(ad.tagline || '');
    setBrand(ad.brand || 'Walkaroo');
    setOfferText(ad.offerText || '');
    setCtaText(ad.ctaText || 'Enquire on WhatsApp');
    setLinkUrl(ad.linkUrl || '/shop');
    setVideoUrl(ad.videoUrl);
    setVideoPreviewUrl(ad.videoUrl);
    setVideoFile(null);
    setVideoSourceType('url');
    setIsModalOpen(true);
  };

  // Pick video file from device gallery / camera / file picker
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showNotification('error', 'Please select a valid video file from your gallery');
      return;
    }

    // Max 100MB check
    if (file.size > 100 * 1024 * 1024) {
      showNotification('error', 'Video file size must be under 100MB');
      return;
    }

    setVideoFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(localUrl);

    // Auto-fill title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showNotification('error', 'Please enter an Ad Title');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      let finalVideoUrl = videoUrl;

      // If user picked a file from gallery, read and upload it
      if (videoSourceType === 'gallery' && videoFile) {
        setUploadProgress(35);
        const reader = new FileReader();

        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read video from gallery'));
          reader.readAsDataURL(videoFile);
        });

        setUploadProgress(65);
        const uploadRes = await api.admin.uploadVideo({
          video: base64Data,
          filename: videoFile.name,
        });

        finalVideoUrl = uploadRes.url;
        setUploadProgress(85);
      }

      if (!finalVideoUrl) {
        showNotification('error', 'Please provide a video file from gallery or a video link');
        setIsUploading(false);
        return;
      }

      if (editingAd) {
        await api.admin.updateVideoAd(editingAd.id, {
          title,
          tagline,
          brand,
          offerText,
          ctaText,
          linkUrl,
          videoUrl: finalVideoUrl,
        });
        showNotification('success', 'Video Ad updated successfully!');
      } else {
        await api.admin.createVideoAd({
          title,
          tagline,
          brand,
          offerText,
          ctaText,
          linkUrl,
          videoUrl: finalVideoUrl,
          isActive: true,
          order: ads.length + 1,
        });
        showNotification('success', 'Video Ad published to customer storefront!');
      }

      setIsModalOpen(false);
      loadAds();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save video ad');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleToggleActive = async (ad: VideoAd) => {
    try {
      await api.admin.updateVideoAd(ad.id, { isActive: !ad.isActive });
      setAds((prev) =>
        prev.map((item) =>
          item.id === ad.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      showNotification('success', `Ad "${ad.title}" set to ${!ad.isActive ? 'Active' : 'Hidden'}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle ad status');
    }
  };

  const handleDelete = async (id: string, adTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete video ad "${adTitle}"?`)) return;

    try {
      await api.admin.deleteVideoAd(id);
      setAds((prev) => prev.filter((item) => item.id !== id));
      showNotification('success', `Ad "${adTitle}" removed`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete video ad');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FD] text-slate-800 pb-16">
      {/* ── Top Header Navigation Bar ── */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2 rounded-xl bg-purple-50 text-[#5B21B6] hover:bg-purple-100 transition shadow-xs"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Film className="w-6 h-6 text-[#7C3AED]" />
                    Video Ads &amp; Promotional Reels
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-[#5B21B6]">
                    {ads.length} Ads
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Share promotional videos from your gallery to play on the customer storefront
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadAds}
                className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-[#5B21B6] border border-purple-100 hover:border-purple-300 transition shadow-xs cursor-pointer"
                title="Refresh Ads"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-900/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Video Ad</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Notification Banner ── */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Instructions & Stats Bar */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              Direct Customer Storefront Broadcast
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Showcase Footwear Videos &amp; Festive Deals
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Record a video on your phone or pick from your device gallery. Once published, your video ad automatically loops on the customer homepage with a direct 1-click WhatsApp enquiry button!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-white text-[#5B21B6] hover:bg-purple-50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Share Video From Gallery</span>
            </button>
          </div>
        </div>

        {/* Video Ads Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900">
              Active Video Ads ({ads.filter((a) => a.isActive).length} Playing on Storefront)
            </h3>
            <span className="text-xs text-slate-500">
              Total {ads.length} Ads in Library
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-72 rounded-3xl bg-white shadow-xs animate-pulse border border-purple-100" />
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 space-y-4">
              <Film className="w-12 h-12 text-purple-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">No promotional video ads yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the button below to upload your first footwear video from your phone gallery or camera.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Video Ad</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col shadow-xs hover:shadow-lg ${
                    ad.isActive ? 'border-purple-200' : 'border-slate-200 opacity-60'
                  }`}
                >
                  {/* Video Thumbnail Box */}
                  <div className="relative aspect-[9/12] bg-slate-900 overflow-hidden group">
                    <video
                      src={ad.videoUrl}
                      poster={ad.posterUrl}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

                    {/* Top Left: Brand Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#5B21B6] text-white shadow-xs">
                        {ad.brand}
                      </span>
                      {ad.offerText && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-400 text-slate-900 shadow-xs">
                          {ad.offerText}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Status Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(ad)}
                      className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer shadow-xs ${
                        ad.isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700/80 text-slate-300'
                      }`}
                      title="Click to toggle Active / Inactive on Storefront"
                    >
                      {ad.isActive ? 'Playing Live' : 'Hidden'}
                    </button>

                    {/* Center Play Button (opens preview) */}
                    <button
                      type="button"
                      onClick={() => setPreviewAd(ad)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 border border-white/50 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer hover:scale-110 active:scale-95"
                      title="Preview Video Ad"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>

                    {/* Bottom: Ad Title */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                      <h4 className="font-black text-xs sm:text-sm line-clamp-2 leading-snug drop-shadow-md">
                        {ad.title}
                      </h4>
                      {ad.tagline && (
                        <p className="text-[10px] text-slate-300 truncate mt-0.5">
                          {ad.tagline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 bg-slate-50 border-t border-purple-100 flex items-center justify-between gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewAd(ad)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B21B6] font-bold flex items-center gap-1 transition cursor-pointer"
                      title="Watch Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(ad)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                        title="Edit Details"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(ad.id, ad.title)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Ad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── CREATE / EDIT VIDEO AD MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-8">
            <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-300" />
                  {editingAd ? 'Edit Video Ad' : 'Share Video Ad From Gallery'}
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  The video will automatically broadcast on the customer storefront
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Video Source Tabs: From Phone Gallery vs Direct URL */}
              <div className="space-y-2">
                <label className="font-black text-slate-700 uppercase tracking-wider block">
                  1. Video Source
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('gallery')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      videoSourceType === 'gallery'
                        ? 'bg-white text-[#5B21B6] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>From Phone Gallery / Files</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('url')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      videoSourceType === 'url'
                        ? 'bg-white text-[#5B21B6] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Paste Video URL</span>
                  </button>
                </div>
              </div>

              {/* Source A: Phone Gallery Upload Area */}
              {videoSourceType === 'gallery' && (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-[#5B21B6] flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm">
                        {videoFile ? videoFile.name : 'Tap to Pick Video from Gallery / Camera'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports MP4, MOV, WebM videos up to 100MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Source B: Direct URL Input */}
              {videoSourceType === 'url' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Video Link / URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoPreviewUrl(e.target.value);
                    }}
                    placeholder="https://.../video.mp4"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>
              )}

              {/* Live Video Preview Box */}
              {videoPreviewUrl && (
                <div className="p-3 rounded-2xl bg-slate-900 overflow-hidden">
                  <p className="text-[10px] text-purple-300 font-bold mb-1.5 flex items-center gap-1">
                    <Play className="w-3 h-3" /> Video Preview:
                  </p>
                  <video
                    src={videoPreviewUrl}
                    controls
                    playsInline
                    className="w-full max-h-48 rounded-xl object-contain bg-black"
                  />
                </div>
              )}

              {/* Ad Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Walkaroo CloudStep Festive Offer"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Featured Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-bold"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Offer Text & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-500" />
                    Offer Badge Text
                  </label>
                  <input
                    type="text"
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    placeholder="e.g. FLAT 25% OFF FESTIVE DEAL"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Tagline / Brief Description</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Ultra lightweight memory foam sole"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>
              </div>

              {/* Call to Action & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Action Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Enquire on WhatsApp"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Storefront Link</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/shop or /shop?brand=Walkaroo"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#5B21B6] font-medium"
                  />
                </div>
              </div>

              {/* Upload Progress Bar if uploading */}
              {isUploading && (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      Uploading video from gallery to server...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#5B21B6] h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-black flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Broadcasting Video...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{editingAd ? 'Save Changes' : 'Broadcast to Storefront'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOMER PREVIEW MODAL ── */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/20">
            <button
              type="button"
              onClick={() => setPreviewAd(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
            >
              ✕
            </button>

            {/* Video Player */}
            <div className="relative aspect-[9/16] bg-black">
              <video
                src={previewAd.videoUrl}
                poster={previewAd.posterUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Floating Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#5B21B6] text-white shadow-xs">
                    {previewAd.brand}
                  </span>
                  {previewAd.offerText && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-400 text-slate-900 shadow-xs">
                      {previewAd.offerText}
                    </span>
                  )}
                </div>

                <h3 className="font-black text-white text-base leading-snug drop-shadow-md">
                  {previewAd.title}
                </h3>
                {previewAd.tagline && (
                  <p className="text-slate-300 text-xs drop-shadow-sm">
                    {previewAd.tagline}
                  </p>
                )}

                <div className="pt-2 pointer-events-auto">
                  <a
                    href={`https://wa.me/919553536884?text=${encodeURIComponent(
                      `Hello Chandhana Shoe Mart! 👋 I saw your Video Ad: "${previewAd.title}" (${previewAd.offerText || ''}). Please share more details and availability!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{previewAd.ctaText || 'Enquire on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideoAdsPage;
