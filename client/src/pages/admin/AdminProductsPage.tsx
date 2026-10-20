import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { Plus, Trash2, Sparkles, Film, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New product form fields
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Chandhana');
  const [sku, setSku] = useState('');
  const [department, setDepartment] = useState<'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS'>('MEN');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [has3D, setHas3D] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [upperMaterial, setUpperMaterial] = useState('');
  const [soleMaterial, setSoleMaterial] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.products.getAll({ limit: 50 }),
        api.categories.getAll(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      if (catRes.length > 0) setCategoryId(catRes[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const calcDiscount =
        originalPrice && parseFloat(originalPrice) > parseFloat(price)
          ? Math.round(
              ((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100
            )
          : 0;

      await api.admin.createProduct({
        title,
        brand,
        sku: sku || `CSM-${Date.now().toString().slice(-6)}`,
        department,
        categoryId: categoryId || categories[0]?.id,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        discountPercent: calcDiscount,
        description,
        has3D,
        videoUrl: videoUrl || undefined,
        upperMaterial: upperMaterial || 'Engineered Breathable Textile',
        soleMaterial: soleMaterial || 'High-Abrasion Rubber',
        media: [imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        variants: [
          { size: 'UK 7', colorName: 'Crimson White', colorHex: '#DC2626', inventory: 15 },
          { size: 'UK 8', colorName: 'Crimson White', colorHex: '#DC2626', inventory: 20 },
          { size: 'UK 9', colorName: 'Crimson White', colorHex: '#DC2626', inventory: 18 },
        ],
      });

      setIsModalOpen(false);
      loadData();
      // Reset form
      setTitle('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to create product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.admin.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-red-600 shadow-sm ring-1 ring-slate-200 border-none transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Footwear Catalog Management</h1>
              <p className="text-xs text-slate-500 font-medium">Total {products.length} products published</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-1.5 border-none shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Footwear Style</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Product</th>
                <th className="py-3 px-3.5">SKU</th>
                <th className="py-3 px-3.5">Dept</th>
                <th className="py-3 px-3.5">Price</th>
                <th className="py-3 px-3.5">3D / Video</th>
                <th className="py-3 px-3.5">Rating</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3 px-3.5 flex items-center gap-3">
                    <img
                      src={p.media?.[0]?.url || ''}
                      alt={p.title}
                      className="w-10 h-10 object-cover rounded-xl bg-slate-50 shrink-0 border-none"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="text-[10px] text-red-600 font-bold">{p.brand}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5 font-mono font-medium text-slate-600">{p.sku}</td>
                  <td className="py-3 px-3.5">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold border-none">
                      {p.department}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-black text-slate-900">
                    ₹{p.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex gap-1.5">
                      {p.has3D && (
                        <span className="text-[9px] bg-red-50 text-red-600 font-extrabold px-2 py-0.5 rounded-full border-none flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> 3D
                        </span>
                      )}
                      {p.videoUrl && (
                        <span className="text-[9px] bg-cyan-50 text-cyan-700 font-bold px-2 py-0.5 rounded-full border-none flex items-center gap-1">
                          <Film className="w-2.5 h-2.5" /> Reel
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 font-medium text-amber-600">
                    ★ {p.rating} ({p.reviewCount})
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl border-none">
              <h3 className="text-lg font-extrabold text-slate-900">Add New Footwear Style</h3>
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-slate-700 font-bold">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Chandhana Velocity Carbon Runner"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Brand</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    >
                      <option value="MEN">Men's Footwear</option>
                      <option value="WOMEN">Women's Footwear</option>
                      <option value="KIDS">Kids' Footwear</option>
                      <option value="SLIPPERS_SANDALS">Slippers & Sandals</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1999"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="2999"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-slate-700 font-bold">Primary Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-slate-700 font-bold">Product Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe cushioning, materials, and intended usage..."
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Upper Material</label>
                    <input
                      type="text"
                      value={upperMaterial}
                      onChange={(e) => setUpperMaterial(e.target.value)}
                      placeholder="e.g. Engineered Jacquard Mesh"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Sole Material</label>
                    <input
                      type="text"
                      value={soleMaterial}
                      onChange={(e) => setSoleMaterial(e.target.value)}
                      placeholder="e.g. Dual-Density Nitro EVA"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer pt-2 text-slate-800 font-bold">
                      <input
                        type="checkbox"
                        checked={has3D}
                        onChange={(e) => setHas3D(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Enable Interactive 3D WebGL Model Viewer</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-2.5 px-6 font-bold text-xs border-none shadow-md cursor-pointer">
                    Publish Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
