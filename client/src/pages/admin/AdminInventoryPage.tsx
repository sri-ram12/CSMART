import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminInventoryPage: React.FC = () => {
  const [variants, setVariants] = useState<any[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  const loadInventory = async () => {
    try {
      const data = await api.admin.getInventory(lowStockOnly);
      setVariants(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockOnly]);

  const handleSaveStock = async (variantId: string) => {
    try {
      await api.admin.updateInventory(variantId, editQty);
      setEditingId(null);
      loadInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
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
              <h1 className="text-2xl font-black text-slate-900">Variant Inventory & Stock Balances</h1>
              <p className="text-xs text-slate-500 font-medium">Manage real-time stock levels per size & colorway</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2.5 rounded-xl shadow-sm ring-1 ring-slate-200 text-xs font-bold border-none">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Show Low Stock (&lt; 5 units)
            </span>
          </label>
        </div>

        {/* Variants Inventory Table */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white shadow-sm border-none overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Shoe Style</th>
                <th className="py-3 px-3.5">Variant SKU</th>
                <th className="py-3 px-3.5">Size</th>
                <th className="py-3 px-3.5">Color</th>
                <th className="py-3 px-3.5">Current Stock</th>
                <th className="py-3 px-3.5 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {variants.map((v) => {
                const isEditing = editingId === v.id;
                const isLow = v.inventory <= 5;
                const isOut = v.inventory <= 0;

                return (
                  <tr key={v.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {v.product?.title}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-500 font-medium">{v.sku}</td>
                    <td className="py-3 px-3.5 font-extrabold text-slate-900">{v.size}</td>
                    <td className="py-3 px-3.5 flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-inner"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span className="font-medium">{v.colorName}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                          className="w-20 bg-slate-50 p-1.5 rounded-xl border-none ring-2 ring-red-600 text-slate-900 font-bold"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs border-none ${
                            isOut
                              ? 'bg-red-50 text-red-600'
                              : isLow
                              ? 'bg-amber-50 text-amber-700'
                              : 'text-slate-800'
                          }`}
                        >
                          {v.inventory} units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveStock(v.id)}
                          className="px-3.5 py-1.5 bg-red-600 text-white font-bold rounded-xl text-xs border-none shadow-sm cursor-pointer"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(v.id);
                            setEditQty(v.inventory);
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border-none text-xs transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
