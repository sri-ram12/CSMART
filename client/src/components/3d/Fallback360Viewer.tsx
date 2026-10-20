import React, { useState, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

interface Fallback360ViewerProps {
  images: string[];
  title: string;
  height?: string;
}

export const Fallback360Viewer: React.FC<Fallback360ViewerProps> = ({
  images,
  title,
  height = 'h-[440px]',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // If only 1 image provided, repeat with simulated perspective zoom
  const activeImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 25) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev + 1) % activeImages.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
      }
      startXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      className={`relative w-full ${height} bg-white rounded-3xl shadow-sm border-none overflow-hidden flex items-center justify-center cursor-ew-resize select-none`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={activeImages[currentIndex]}
        alt={`${title} - angle ${currentIndex + 1}`}
        className="w-full h-full object-contain p-6 pointer-events-none transition-transform duration-200"
      />

      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border-none text-xs font-bold text-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-red-600" />
        <span>360° Studio Turn View</span>
      </div>

      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-sm border-none text-xs font-medium text-slate-700">
          <RotateCcw className="w-3.5 h-3.5 text-red-600" />
          <span>Drag left or right to rotate</span>
        </div>
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border-none text-xs font-mono font-bold text-slate-800">
          {currentIndex + 1} / {activeImages.length}
        </div>
      </div>
    </div>
  );
};

export default Fallback360Viewer;
