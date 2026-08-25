import React, { useState, useEffect } from 'react';
import { Layers, Plus, Save, Trash2, CheckCircle2, AlertCircle, Image, Upload } from 'lucide-react';
import { apiService, parseJSON } from '../services/api';

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(services.length / itemsPerPage) || 1;
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = async () => {
    const [sData, cData] = await Promise.all([
      apiService.getServices(),
      apiService.getServiceCategories()
    ]);
    setServices(sData || []);
    setCategories(cData || []);

    if (sData && sData.length > 0 && !activeService) {
      const first = sData[0];
      setActiveService({
        ...first,
        features: typeof first.features === 'string' ? JSON.parse(first.features) : (first.features || [])
      });
    }
  };

  const handleCreateNew = () => {
    setActiveService({
      title: 'Produk Peralatan Listrik Baru',
      slug: `produk-${Date.now()}`,
      category_id: categories[0]?.id || null,
      icon_name: 'Zap',
      summary: 'Ringkasan singkat produk peralatan listrik...',
      description: 'Deskripsi lengkap spesifikasi teknis dan garansi produk...',
      features: ['Berstandar SNI', 'Bahan Berkualitas Tahan Panas', 'Garansi Resmi Toko'],
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800'
    });
    setMsg('');
    setErrorMsg('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    try {
      const res = await apiService.uploadMedia(file);
      setUploading(false);
      if (res.success && res.data?.url) {
        setActiveService({
          ...activeService,
          image_url: res.data.url
        });
        setMsg('Foto produk berhasil diunggah!');
      } else {
        setErrorMsg(res.message || 'Gagal mengunggah foto.');
      }
    } catch (err) {
      setUploading(false);
      setErrorMsg('Gagal mengunggah file gambar.');
    }
  };

  const handleSave = async () => {
    if (!activeService || !activeService.title) return;
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    try {
      const res = await apiService.saveService(activeService);
      setSaving(false);

      if (res.success || res.data) {
        setMsg(`Produk "${activeService.title}" berhasil disimpan!`);
        if (res.data) {
          setActiveService({
            ...res.data,
            features: parseJSON(res.data.features, [])
          });
        }
        await loadServicesData();
      } else {
        setErrorMsg(res.message || 'Gagal menyimpan produk.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Terjadi kesalahan saat menyimpan produk.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini beserta foto yang diunggah?')) return;
    await apiService.deleteService(id);
    setActiveService(null);
    loadServicesData();
  };

  return (
    <div className="space-y-10 cms-page-container">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Kelola Produk &amp; Katalog Listrik</h1>
          <p className="text-xs text-slate-400 mt-2">Kelola Item Peralatan Listrik, Foto Produk, Kategori, dan Spesifikasi</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-3 px-5 text-xs">
          <Plus className="w-4 h-4 mr-1" />
          Tambah Produk Baru
        </button>
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
        
        {/* Left Services List */}
        <div className="lg:col-span-4 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Daftar Produk ({services.length})</h3>
            
            <div className="space-y-3">
              {paginatedServices.map((s) => (
                <div 
                  key={s.id || s.slug}
                  onClick={() => {
                    setMsg('');
                    setErrorMsg('');
                    setActiveService({
                      ...s,
                      features: parseJSON(s.features, [])
                    });
                  }}
                  className={`cms-list-item rounded-xl cursor-pointer border transition-all flex items-center justify-between gap-3 ${
                    activeService?.slug === s.slug 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-11 h-11 rounded-lg object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold truncate leading-snug">{s.title}</h4>
                      <span className="text-[11px] text-indigo-400 font-mono block truncate mt-1">/service/{s.slug}</span>
                    </div>
                  </div>
                  
                  {s.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} 
                      className="text-slate-500 hover:text-rose-400 p-1.5 shrink-0 transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Left List Pagination Bar */}
          {services.length > itemsPerPage && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-40 font-bold text-slate-300 transition-colors"
              >
                &larr; Prev
              </button>

              <span className="text-slate-400 font-bold">
                Hal {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-40 font-bold text-slate-300 transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right Service Editor Form */}
        <div className="lg:col-span-8 glass-panel cms-form-card rounded-2xl border border-white/10 space-y-8">
          {activeService ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span className="text-base font-bold text-white">Edit Produk: {activeService.title}</span>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-3 px-6 text-xs font-bold">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cms-form-row">
                <div>
                  <label className="cms-form-label font-bold text-slate-300 uppercase">Nama Produk *</label>
                  <input 
                    type="text" 
                    value={activeService.title || ''} 
                    onChange={(e) => setActiveService({ ...activeService, title: e.target.value })}
                    className="glass-input cms-input-field w-full text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="cms-form-label font-bold text-slate-300 uppercase">URL Slug *</label>
                  <input 
                    type="text" 
                    value={activeService.slug || ''} 
                    onChange={(e) => setActiveService({ ...activeService, slug: e.target.value })}
                    className="glass-input cms-input-field w-full text-xs font-mono text-indigo-300"
                  />
                </div>
              </div>

              {/* Product Image Upload & Field */}
              <div className="p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-4 cms-form-row">
                <label className="cms-form-label font-bold text-white uppercase flex items-center gap-2">
                  <Image className="w-4 h-4 text-indigo-400" />
                  <span>Foto Produk Listrik</span>
                </label>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {activeService.image_url ? (
                    <img 
                      src={activeService.image_url} 
                      alt="Preview" 
                      className="w-28 h-28 rounded-2xl object-cover border border-white/20 shadow-md shrink-0" 
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 text-xs shrink-0">
                      <Image className="w-6 h-6 mb-1" />
                      <span>Belum ada foto</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-3">
                    <input 
                      type="text" 
                      placeholder="Masukkan URL Foto (e.g. https://...)" 
                      value={activeService.image_url || ''} 
                      onChange={(e) => setActiveService({ ...activeService, image_url: e.target.value })}
                      className="glass-input cms-input-field w-full text-xs font-mono"
                    />

                    <div className="flex items-center gap-3 pt-1">
                      <label className="btn-secondary py-2.5 px-4 text-xs cursor-pointer inline-flex items-center gap-2 font-semibold">
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span>{uploading ? 'Mengunggah File...' : 'Upload File Foto'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          disabled={uploading} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">Atau tempelkan link URL gambar di atas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 cms-form-row">
                <div>
                  <label className="cms-form-label font-bold text-slate-300 uppercase">Kategori Produk</label>
                  <select
                    value={activeService.category_id || ''}
                    onChange={(e) => setActiveService({ ...activeService, category_id: parseInt(e.target.value) || null })}
                    className="glass-input cms-input-field w-full text-xs bg-slate-900 text-white"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="cms-form-label font-bold text-emerald-400 uppercase">Harga Produk (Rp) *</label>
                  <input 
                    type="number" 
                    min="0"
                    step="500"
                    placeholder="e.g. 45000"
                    value={activeService.price !== undefined ? activeService.price : 0} 
                    onChange={(e) => setActiveService({ ...activeService, price: parseFloat(e.target.value) || 0 })}
                    className="glass-input cms-input-field w-full text-xs font-bold text-emerald-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Masukkan 0 jika ingin menampilkan "Minta Penawaran Harga"</p>
                </div>
              </div>

              <div className="cms-form-row">
                <label className="cms-form-label font-bold text-slate-300 uppercase">Ringkasan Singkat Produk</label>
                <textarea 
                  rows="3"
                  value={activeService.summary || ''} 
                  onChange={(e) => setActiveService({ ...activeService, summary: e.target.value })}
                  className="glass-input cms-input-field w-full text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="cms-form-row">
                <label className="cms-form-label font-bold text-slate-300 uppercase">Deskripsi &amp; Spesifikasi Lengkap (HTML/Text)</label>
                <textarea 
                  rows="7"
                  value={activeService.description || ''} 
                  onChange={(e) => setActiveService({ ...activeService, description: e.target.value })}
                  className="glass-input cms-input-field w-full text-xs resize-none leading-relaxed font-mono"
                />
              </div>

              <div className="cms-form-row">
                <label className="cms-form-label font-bold text-slate-300 uppercase">Fitur &amp; Keunggulan Produk (Satu per baris)</label>
                <textarea 
                  rows="5"
                  value={Array.isArray(activeService.features) ? activeService.features.join('\n') : ''} 
                  onChange={(e) => setActiveService({ 
                    ...activeService, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  })}
                  placeholder="Standard Nasional Indonesia (SNI)&#10;Konduktor Tembaga Murni 99.9%&#10;Isolasi Double Layer Tahan Panas"
                  className="glass-input cms-input-field w-full text-xs resize-none font-mono"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs">
              Pilih produk dari daftar di sebelah kiri untuk mengedit atau klik "Tambah Produk Baru".
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
