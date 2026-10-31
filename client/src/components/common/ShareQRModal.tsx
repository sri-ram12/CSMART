import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  X,
  Copy,
  Check,
  Share2,
  Download,
  Printer,
  Wifi,
  Globe,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
  subtitle?: string;
}

export const ShareQRModal: React.FC<ShareQRModalProps> = ({
  isOpen,
  onClose,
  url,
  title = 'Chandhana Shoe Mart',
  subtitle = 'Scan with your mobile camera to visit our store & install WebApp',
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [urlMode, setUrlMode] = useState<'wifi' | 'current' | 'custom'>('wifi');
  const [customUrl, setCustomUrl] = useState('');

  // Local Wi-Fi network address of this computer so phones on same Wi-Fi can open it
  const wifiNetworkIp = '192.168.0.178';
  const defaultWifiUrl = `http://${wifiNetworkIp}:5173?source=qr`;

  const currentBrowserOrigin =
    typeof window !== 'undefined'
      ? `${window.location.origin}?source=qr`
      : 'http://localhost:5173?source=qr';

  // Determine active target URL
  const targetUrl =
    urlMode === 'wifi'
      ? defaultWifiUrl
      : urlMode === 'custom'
      ? customUrl || defaultWifiUrl
      : url || currentBrowserOrigin;

  // Generate QR code locally in-memory with crisp high resolution
  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 420,
      margin: 1.5,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#4C1D95', // Rich brand purple
        light: '#FFFFFF',
      },
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error('Failed to generate QR code locally:', err);
      });
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `👟 *Chandhana Shoe Mart - Official Store*\nDiscover authorized footwear from Walkaroo, Sparx, VKC Pride, Paragon & more!\n\n👉 Open Store & Install WebApp: ${targetUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `CSMART_Store_QR_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chandhana Shoe Mart - Store QR Standee</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 30px; margin: 0; background: #faf5ff; }
            .card { border: 3px solid #5B21B6; border-radius: 28px; padding: 35px 25px; max-width: 420px; margin: auto; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            h1 { color: #5B21B6; margin: 0 0 6px 0; font-size: 26px; text-transform: uppercase; font-weight: 900; }
            .subtitle { color: #6B7280; font-size: 13px; margin: 0 0 20px 0; font-weight: bold; }
            img { width: 280px; height: 280px; border-radius: 16px; border: 1px solid #E9D5FF; }
            .scan-tip { color: #7C3AED; font-weight: 800; font-size: 13px; margin-top: 15px; }
            .url-text { font-family: monospace; font-size: 12px; color: #374151; margin-top: 6px; }
            .brands { margin-top: 22px; font-weight: 800; color: #1E293B; font-size: 11px; letter-spacing: 0.5px; border-top: 1px dashed #DDD6FE; padding-top: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>CHANDHANA SHOE MART</h1>
            <p class="subtitle">Scan with Mobile Camera to Shop &amp; Download App</p>
            <img src="${qrDataUrl}" alt="Store QR Code" />
            <p class="scan-tip">📲 Scan with Camera or Google Lens</p>
            <p class="url-text">${targetUrl}</p>
            <div class="brands">Walkaroo • Sparx • VKC Pride • Paragon • Doctor Choice • Sushma</div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-5 sm:p-6 text-center relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2 backdrop-blur-xs shadow-inner">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">{title}</h2>
          <p className="text-purple-100 text-xs mt-0.5 font-medium">{subtitle}</p>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* URL Mode Switcher Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Scan Target Link:</span>
              <span className="text-[#5B21B6] font-black">
                {urlMode === 'wifi' ? '📱 Mobile Scanner Ready' : '🔗 Custom Link'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setUrlMode('wifi')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition cursor-pointer text-[11px] ${
                  urlMode === 'wifi'
                    ? 'bg-white text-[#5B21B6] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Use Wi-Fi IP so phones on the same network can open the website"
              >
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Wi-Fi Phone</span>
              </button>

              <button
                type="button"
                onClick={() => setUrlMode('current')}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition cursor-pointer text-[11px] ${
                  urlMode === 'current'
                    ? 'bg-white text-[#5B21B6] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Current browser origin"
              >
                <Smartphone className="w-3 h-3" />
                <span>Browser</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrlMode('custom');
                  if (!customUrl) setCustomUrl(defaultWifiUrl);
                }}
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition cursor-pointer text-[11px] ${
                  urlMode === 'custom'
                    ? 'bg-white text-[#5B21B6] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Custom domain or ngrok link"
              >
                <Globe className="w-3 h-3" />
                <span>Custom</span>
              </button>
            </div>

            {/* Mobile Scan Help Hint */}
            {urlMode === 'wifi' && (
              <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2 leading-relaxed">
                ✅ <strong>Optimized for Phone Cameras:</strong> Phones on your Wi-Fi cannot open <code>localhost</code>. This QR code encodes your network IP (<code>{wifiNetworkIp}:5173</code>) so phones open the store &amp; show the PWA install prompt!
              </p>
            )}

            {urlMode === 'custom' && (
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://yourstore.com"
                className="w-full p-2 text-xs font-mono rounded-lg border border-purple-200 bg-slate-50 focus:border-[#5B21B6]"
              />
            )}
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center">
            <div className="relative p-3 rounded-2xl bg-white shadow-md border-2 border-purple-100 group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Website Store QR Code"
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              ) : (
                <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-xl bg-purple-50 flex items-center justify-center text-xs text-purple-600 font-bold animate-pulse">
                  Generating QR Code...
                </div>
              )}
              {/* Brand Logo Stamp in Center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-purple-300 flex items-center justify-center p-1 font-black text-xs text-[#5B21B6]">
                  CSM
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium text-center mt-2.5">
              Open Phone Camera or Google Lens to scan and install WebApp
            </p>
          </div>

          {/* Target URL Pill & Copy */}
          <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="truncate text-slate-700 font-mono text-[11px] flex-1">
              {targetUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-bold hover:text-[#5B21B6] transition-colors cursor-pointer shrink-0 shadow-2xs text-[11px]"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="w-full grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
              title="Share Link & QR on WhatsApp"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B21B6] font-bold text-[11px] transition-colors cursor-pointer"
              title="Download PNG to device"
            >
              <Download className="w-4 h-4 text-[#7C3AED]" />
              <span>Save Image</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
              title="Print Storefront Counter Standee"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Standee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareQRModal;
