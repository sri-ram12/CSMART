import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.products.getAll({ search: query.trim(), limit: 6 });
        setResults(res.products);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularTags = [
    { label: 'Running Shoes', link: '/shop?department=MEN' },
    { label: 'CloudStep Slides', link: '/slippers' },
    { label: 'Formal Leather', link: '/shop?department=MEN' },
    { label: 'Women Sneakers', link: '/shop?department=WOMEN' },
    { label: 'Kids Sports', link: '/shop?department=KIDS' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-none">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-red-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shoes, sneakers, slippers, sandals, SKU or brand..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base border-none font-medium"
          />
          {isLoading && <Loader2 className="w-5 h-5 text-red-600 animate-spin mr-2" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="border-none p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="border-none ml-2 text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Results or Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                Products ({results.length})
              </div>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    navigate(`/product/${product.slug}`);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-red-50/50 transition-all cursor-pointer group"
                >
                  <img
                    src={product.media[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-xl bg-slate-50 p-1 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-wider">
                        {product.brand}
                      </span>
                      {product.has3D && (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                          3D
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                      {product.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="text-slate-900 font-black">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}

          {query.trim() && results.length === 0 && !isLoading && (
            <div className="text-center py-10 text-slate-500">
              <p className="text-sm font-semibold text-slate-700">No footwear matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "running", "leather", "slides", or "sneakers".
              </p>
            </div>
          )}

          {/* Quick tags when query is empty */}
          {!query.trim() && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => {
                      navigate(tag.link);
                      onClose();
                    }}
                    className="border-none text-xs bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 px-3.5 py-2 rounded-xl font-bold transition-all"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
