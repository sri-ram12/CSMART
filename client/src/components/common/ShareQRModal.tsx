import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Share2, Download, Printer, ExternalLink } from 'lucide-react';

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
  subtitle = 'Scan with your mobile camera to visit our store',
}) => {
  const [copied, setCopied] = useState(false);
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://chandhanashoemart.com');

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(targetUrl)}&margin=10&color=4c1d95`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `👟 *Chandhana Shoe Mart*\nDiscover authorized footwear from Walkaroo, Sparx, VKC Pride, Paragon, Doctor Choice & more!\n\n👉 Visit Store: ${targetUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `CSM_Store_QR_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrImageUrl, '_blank');
    }
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
            body { font-family: sans-serif; text-align: center; padding: 40px; margin: 0; }
            .card { border: 3px solid #5B21B6; border-radius: 24px; padding: 30px; max-width: 400px; margin: auto; }
            h1 { color: #5B21B6; margin: 0 0 8px 0; font-size: 24px; text-transform: uppercase; }
            p { color: #64748B; font-size: 14px; margin: 0 0 20px 0; }
            img { width: 280px; height: 280px; border-radius: 12px; }
            .brands { margin-top: 20px; font-weight: bold; color: #1E293B; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>CHANDHANA SHOE MART</h1>
            <p>Scan to Browse Our Complete Footwear Catalog</p>
            <img src="${qrImageUrl}" alt="Store QR" />
            <div class="brands">Walkaroo • Sparx • VKC Pride • Paragon • Doctor Choice • Sushma</div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#5B21B6] text-white p-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-2.5 backdrop-blur-xs">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">{title}</h2>
          <p className="text-purple-100 text-xs mt-1 font-medium">{subtitle}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative p-3 rounded-2xl bg-white shadow-lg border-2 border-purple-100 group">
            <img
              src={qrImageUrl}
              alt="Website Store QR Code"
              className="w-56 h-56 object-contain rounded-xl"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-purple-200 flex items-center justify-center p-1 font-black text-xs text-[#5B21B6]">
                CSM
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium text-center mt-3">
            Open camera or Google Lens to scan and shop instantly on any smartphone
          </p>

          {/* Target URL Pill */}
          <div className="w-full mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="truncate text-slate-600 font-mono flex-1">{targetUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 font-bold hover:text-[#5B21B6] transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons Grid */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5B21B6] font-bold text-[11px] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7C3AED]" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
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

