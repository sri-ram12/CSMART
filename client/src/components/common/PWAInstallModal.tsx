import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallModal: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already running standalone PWA
    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isApp) {
      setIsStandalone(true);
      return;
    }

    // Check if dismissed in this browser session
    const dismissed = sessionStorage.getItem('csm_pwa_dismissed');
    if (dismissed) {
      return;
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIPhoneOrIPad);

    // Capture standard PWA beforeinstallprompt event (Android, Chrome, Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 2.5 seconds after page load before showing popup
      setTimeout(() => {
        setIsVisible(true);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS users, show banner after 3 seconds if not standalone
    if (isIPhoneOrIPad && !isApp) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('csm_pwa_dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Install App"
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:right-5 sm:left-auto sm:max-w-md z-50 animate-slideUp"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-200/90 p-4 sm:p-5 overflow-hidden text-slate-900 relative">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B00] via-[#7C3AED] to-[#5B21B6]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Dismiss app install"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center shrink-0 shadow-md border border-white">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Official WebApp
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900 mt-1 leading-tight">
              Install Chandhana Shoe Mart
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
              Fast 1-tap shopping, instant stock updates & full catalog on your phone!
            </p>
          </div>
        </div>

        {/* iOS Instruction Tip if opened */}
        {showIOSGuide && (
          <div className="mt-3 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 animate-fadeIn">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Share className="w-3.5 h-3.5 text-[#7C3AED]" />
              How to install on iPhone / iPad:
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-purple-800">
              <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
              <li>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Not Now
          </button>

          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-200 hover:shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PWAInstallModal;

