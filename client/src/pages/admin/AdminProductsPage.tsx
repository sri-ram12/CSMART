import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { Plus, Trash2, Sparkles, Film, ArrowLeft, Edit3, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Admin3DModelStudioModal } from '../../components/admin/Admin3DModelStudioModal';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [selected3DProduct, setSelected3DProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
  const [colorName, setColorName] = useState('Crimson Black');
  const [colorHex, setColorHex] = useState('#DC2626');

  // Edit product fields
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editHas3D, setEditHas3D] = useState(true);
  const [editDepartment, setEditDepartment] = useState<'MEN' | 'WOMEN' | 'KIDS' | 'SLIPPERS_SANDALS'>('MEN');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.products.getAll({ limit: 60 }),
        api.categories.getAll(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes);
      if (catRes.length > 0 && !categoryId) setCategoryId(catRes[0].id);
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

      const generatedSku = sku || `CSM-${Date.now().toString().slice(-6)}`;

      await api.admin.createProduct({
        title,
        brand,
        sku: generatedSku,
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
          { size: 'UK 6', colorName: colorName || 'Standard', colorHex: colorHex || '#DC2626', inventory: 15 },
          { size: 'UK 7', colorName: colorName || 'Standard', colorHex: colorHex || '#DC2626', inventory: 20 },
          { size: 'UK 8', colorName: colorName || 'Standard', colorHex: colorHex || '#DC2626', inventory: 25 },
          { size: 'UK 9', colorName: colorName || 'Standard', colorHex: colorHex || '#DC2626', inventory: 20 },
          { size: 'UK 10', colorName: colorName || 'Standard', colorHex: colorHex || '#DC2626', inventory: 15 },
        ],
      });

      setIsModalOpen(false);
      showNotification('success', `Product "${title}" published successfully!`);
      loadData();
      // Reset form
      setTitle('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create product.');
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditPrice(String(p.price));
    setEditOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setEditDescription(p.description || '');
    setEditHas3D(p.has3D);
    setEditDepartment(p.department);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const calcDiscount =
        editOriginalPrice && parseFloat(editOriginalPrice) > parseFloat(editPrice)
          ? Math.round(
              ((parseFloat(editOriginalPrice) - parseFloat(editPrice)) / parseFloat(editOriginalPrice)) * 100
            )
          : 0;

      await api.admin.updateProduct(editingProduct.id, {
        title: editTitle,
        price: parseFloat(editPrice),
        originalPrice: editOriginalPrice ? parseFloat(editOriginalPrice) : null,
        discountPercent: calcDiscount,
        description: editDescription,
        has3D: editHas3D,
      });

      setIsEditModalOpen(false);
      showNotification('success', `Product "${editTitle}" updated successfully!`);
      loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.admin.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification('success', 'Product removed from catalog.');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to delete product.');
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
              <p className="text-xs text-slate-500 font-medium">Total {products.length} products published • Tagarapuvalasa Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (products.length > 0) {
                  setSelected3DProduct(products[0]);
                  setIs3DStudioOpen(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer border-none"
              title="Launch 3D Footwear Asset Studio"
            >
              <Sparkles className="w-4 h-4" />
              <span>3D Model Studio</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-1.5 border-none shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Footwear Style</span>
            </button>
          </div>
        </div>

        {notification && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border-none flex items-center justify-between ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-600'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        )}

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
                    <div className="flex items-center gap-1.5">
                      {p.has3D ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected3DProduct(p);
                            setIs3DStudioOpen(true);
                          }}
                          className="text-[9px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-full border border-purple-200/80 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Open 3D Model Studio"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          <span>{((p.model3DConfig as any)?.modelType || '3D').toUpperCase()}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelected3DProduct(p);
                            setIs3DStudioOpen(true);
                          }}
                          className="text-[9px] bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold px-2 py-0.5 rounded-full border-none flex items-center gap-1 cursor-pointer"
                          title="Configure 3D Model"
                        >
                          <span>+ 3D</span>
                        </button>
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
                  <td className="py-3 px-3.5 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelected3DProduct(p);
                        setIs3DStudioOpen(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 p-1.5 rounded-lg hover:bg-purple-50 transition-colors border-none bg-transparent cursor-pointer"
                      title="Launch 3D Asset Studio"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="text-slate-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors border-none bg-transparent cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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

                  {/* Category Dropdown (Fixed missing dropdown bug) */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.department})
                        </option>
                      ))}
                    </select>
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

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Color Name</label>
                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="e.g. Crimson Black"
                      className="w-full bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Color Hex Code</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                      />
                      <input
                        type="text"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="flex-1 bg-slate-50 p-3 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-mono"
                      />
                    </div>
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

        {/* Edit Product Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-7 space-y-4 my-8 shadow-2xl border-none">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Product: <span className="text-red-600">{editingProduct.title}</span>
              </h3>

              <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Product Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl text-slate-900 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-red-600 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editHas3D}
                      onChange={(e) => setEditHas3D(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Enable 3D WebGL Inspection Viewer</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border-none bg-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary py-2 px-5 font-bold text-xs border-none shadow-md cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3D Model Studio Modal */}
        <Admin3DModelStudioModal
          isOpen={is3DStudioOpen}
          onClose={() => setIs3DStudioOpen(false)}
          product={selected3DProduct}
          onProductUpdated={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            showNotification('success', `3D model configuration saved for "${updated.title}"`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
