import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { apiService } from '../services/api';

export default function CategoryManager() {
  const [serviceCats, setServiceCats] = useState([]);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const sData = await apiService.getServiceCategories();
      setServiceCats(Array.isArray(sData) ? sData : []);
    } catch (e) {
      setServiceCats([]);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMsg('');
    setErrorMsg('');
    setLoading(true);

    const payload = {
      name: newName.trim(),
      slug: newSlug.trim() || newName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    };

    try {
      const res = await apiService.addServiceCategory(payload);
      setLoading(false);
      if (res.success || res.data) {
        setMsg(`Kategori produk "${newName}" berhasil dibuat!`);
        setNewName('');
        setNewSlug('');
        loadCategories();
      } else {
        setErrorMsg(res.message || 'Gagal membuat kategori produk.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Terjadi kesalahan saat menghubungkan ke database.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    setMsg('');
    setErrorMsg('');

    await apiService.deleteServiceCategory(id);
    loadCategories();
  };

  return (
    <div className="space-y-10 cms-page-container">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Kelola Kategori Produk Listrik</h1>
          <p className="text-xs text-slate-400 mt-2">Kelola Kategori Peralatan Listrik (Kabel, Sakelar, Lampu LED, Komponen Listrik)</p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-3 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-3 border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Create Form */}
        <div className="lg:col-span-5 glass-panel cms-form-card rounded-2xl border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Tambah Kategori Produk Baru</span>
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-5">
            <div>
              <label className="cms-form-label font-bold text-slate-300 uppercase">Nama Kategori *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Alat Teknik &amp; Tester"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="glass-input cms-input-field w-full text-xs font-semibold"
              />
            </div>

            <div>
              <label className="cms-form-label font-bold text-slate-300 uppercase">URL Slug</label>
              <input 
                type="text" 
                placeholder="e.g. alat-teknik-tester"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="glass-input cms-input-field w-full text-xs font-mono text-indigo-300"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 text-xs font-bold mt-2">
              {loading ? 'Memproses...' : 'Tambah Kategori Produk'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6">
            Kategori Produk Listrik Aktif ({serviceCats.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceCats.map((cat) => (
              <div key={cat.id || cat.slug} className="p-4.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between shadow-md">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{cat.name}</h4>
                  <span className="text-[11px] text-indigo-400 font-mono">/{cat.slug}</span>
                </div>
                {cat.id && (
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)} 
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
