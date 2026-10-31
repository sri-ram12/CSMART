import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  Share,
  CheckCircle2,
  Sparkles,
  Zap,
  ChevronRight,
  PlusSquare,
  MoreVertical,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isFromQR, setIsFromQR] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already running inside standalone PWA mode
    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isApp) {
      setIsStandalone(true);
      return;
    }

    // 2. Check if coming from QR scan
    const urlParams = new URLSearchParams(window.location.search);
    const fromQR = urlParams.get('source') === 'qr' || urlParams.get('pwa') === 'true';
    setIsFromQR(fromQR);

    // 3. Detect operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIPhoneOrIPad);
    setIsAndroid(isAndroidDevice);

    // 4. Capture native beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Always display the install banner after a short delay
    // If from QR scan: pop up after 600ms; otherwise after 1.8s
    const delay = fromQR ? 600 : 1800;
    const timer = setTimeout(() => {
      // Check if user dismissed it in this session (unless they came from QR scan)
      const dismissed = sessionStorage.getItem('csm_pwa_dismissed');
      if (dismissed && !fromQR) {
        setIsMinimized(true);
      } else {
        setIsVisible(true);
      }
    }, delay);

    // 6. Listen for manual trigger events from Navbar / Footer
    const handleOpenTrigger = () => {
      setIsVisible(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-pwa-install', handleOpenTrigger);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open-pwa-install', handleOpenTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsVisible(false);
          setIsMinimized(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Native install prompt failed, showing manual guide:', err);
        setShowManualGuide(true);
      }
    } else {
      // If deferredPrompt is not ready yet, expand manual step-by-step guide
      setShowManualGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsMinimized(true);
    sessionStorage.setItem('csm_pwa_dismissed', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* ── MINIMIZED FLOATING PILL (Shows when dismissed or ready) ── */}
      {isMinimized && !isVisible && (
        <button
          type="button"
          onClick={() => {
            setIsVisible(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white shadow-xl hover:shadow-2xl flex items-center gap-2 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer border border-purple-300/40 animate-bounce"
          title="Install Chandhana Shoe Mart App"
        >
          <Smartphone className="w-4 h-4 text-amber-300" />
          <span>Install WebApp 📲</span>
        </button>
      )}

      {/* ── FULL INSTALL POPUP MODAL / BANNER ── */}
      {isVisible && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Install App"
          className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md z-50 animate-slideUp select-none"
        >
          <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-purple-300 p-5 overflow-hidden text-slate-900 relative">
            {/* Top Rainbow Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F59E0B] via-[#7C3AED] to-[#5B21B6]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Dismiss app install"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / App Identity */}
            <div className="flex items-start gap-3.5 pr-6">
              {/* App Icon */}
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center shrink-0 shadow-lg border-2 border-white">
                <Smartphone className="w-7 h-7 text-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#5B21B6] bg-purple-100 px-2.5 py-0.5 rounded-full">
                    {isFromQR ? '⚡ QR Scan Launch' : '📱 Official WebApp'}
                  </span>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Fast &amp; Free
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1 leading-tight">
                  Install Chandhana Shoe Mart
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Add to your home screen for 1-tap shopping, instant stock updates &amp; fast offline browsing!
                </p>
              </div>
            </div>

            {/* Features Checkpoints */}
            <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-[10px] font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1-Tap Phone Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant New Arrivals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Storage Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WhatsApp Enquiries</span>
              </div>
            </div>

            {/* ── MANUAL INSTALLATION GUIDE (For iOS Safari or Android when prompt isn't automated) ── */}
            {showManualGuide && (
              <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 animate-fadeIn">
                <p className="font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {isIOS
                    ? 'How to Add on iPhone / iPad (Safari):'
                    : isAndroid
                    ? 'How to Install on Android Phone:'
                    : 'How to Install on Your Computer:'}
                </p>

                {isIOS ? (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 font-medium">
                    <li>
                      Tap the <strong>Share</strong> button <Share className="inline w-3 h-3 text-[#5B21B6]" /> at the bottom bar of Safari.
                    </li>
                    <li>
                      Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> <PlusSquare className="inline w-3 h-3 text-emerald-700" />.
                    </li>
                    <li>
                      Tap <strong>&ldquo;Add&rdquo;</strong> at the top right to finish!
                    </li>
                  </ol>
                ) : isAndroid ? (
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 font-medium">
                    <li>
                      Tap the <strong>3-Dots Menu</strong> <MoreVertical className="inline w-3 h-3 text-slate-800" /> at top-right in Chrome.
                    </li>
                    <li>
                      Tap <strong>&ldquo;Install App&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </li>
                    <li>
                      Confirm by tapping <strong>&ldquo;Install&rdquo;</strong>!
                    </li>
                  </ol>
                ) : (
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    Click the <strong>Install App icon (⊕)</strong> on the right side of your browser address bar, or tap <strong>Menu (⋮) → &ldquo;Install Chandhana Shoe Mart&rdquo;</strong>.
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              >
                Maybe Later
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer border border-purple-300/40"
              >
                <Download className="w-4 h-4 text-amber-300 stroke-[3]" />
                <span>{deferredPrompt ? 'Install App Now' : showManualGuide ? 'Got It!' : 'Install WebApp 📲'}</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default PWAInstallModal;
