import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Trash2, Save, Image, Link, CheckCircle2, Upload, FileImage, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function SliderManager() {
  const [sliders, setSliders] = useState([]);
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    badge_text: 'PROMO SPESIAL UMKM',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
    cta_text: 'Lihat Katalog Produk',
    cta_link: '#services'
  });
  
  const [imageMode, setImageMode] = useState('file'); // 'file' or 'url'
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    const data = await apiService.getSliders();
    setSliders(data);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
      setNewSlide((prev) => ({ ...prev, image_url: event.target.result }));
    };
    reader.readAsDataURL(file);

    // Upload to backend API
    setUploading(true);
    try {
      const res = await apiService.uploadMedia(file);
      if (res && res.data && res.data.url) {
        setNewSlide((prev) => ({ ...prev, image_url: res.data.url }));
        setPreviewUrl(res.data.url);
      }
    } catch (err) {
      console.warn('Backend upload failed, using local file preview:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.image_url) return;

    const res = await apiService.addSlider(newSlide);
    if (res.success) {
      setMsg('Slide berhasil ditambahkan dan disimpan!');
      setNewSlide({
        title: '',
        subtitle: '',
        badge_text: 'PROMO SPESIAL UMKM',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
        cta_text: 'Lihat Katalog Produk',
        cta_link: '#services'
      });
      setPreviewUrl('');
      loadSliders();
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    await apiService.deleteSlider(id);
    loadSliders();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Sliders className="w-8 h-8 text-indigo-400" />
          <span>Hero Slider Customizer</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola Carousel Banner Beranda, Gambar Promo, Judul Headline, & Tombol Aksi
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Add New Slide Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Tambah Slide Hero Baru</span>
        </h3>

        <form onSubmit={handleAddSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Headline Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Judul Headline Utama *
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Pusat Peralatan Listrik UMKM Terlengkap"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          {/* Badge Highlight */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Teks Badge Promo / Tagline
            </label>
            <input 
              type="text" 
              placeholder="PROMO SPESIAL UMKM"
              value={newSlide.badge_text}
              onChange={(e) => setNewSlide({ ...newSlide, badge_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          {/* Image Input Selection Mode */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Gambar Slide Hero *
              </label>
              
              <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                    imageMode === 'file' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                    imageMode === 'url' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Input URL</span>
                </button>
              </div>
            </div>

            {imageMode === 'file' ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-dashed border-white/20">
                <label className="cursor-pointer flex-1 w-full flex flex-col items-center justify-center p-4 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 transition-colors">
                  <FileImage className="w-6 h-6 mb-1 text-indigo-400" />
                  <span className="text-xs font-bold">Pilih File Gambar dari Komputer / HP</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP (Max 5MB)</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {(previewUrl || newSlide.image_url) && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/20 shrink-0">
                    <img 
                      src={previewUrl || newSlide.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input 
                  type="text" 
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newSlide.image_url}
                  onChange={(e) => {
                    setNewSlide({ ...newSlide, image_url: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  className="glass-input w-full text-xs font-mono text-indigo-300"
                />
              </div>
            )}
          </div>

          {/* Subtitle Overview */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Deskripsi Subtitle
            </label>
            <textarea 
              rows="2"
              placeholder="Solusi kebutuhan kabel, stop kontak, sakelar, dan lampu LED berkualitas..."
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              className="glass-input w-full text-xs resize-none"
            />
          </div>

          {/* CTA Text */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Label Tombol Aksi (CTA)
            </label>
            <input 
              type="text" 
              placeholder="Lihat Katalog Produk"
              value={newSlide.cta_text}
              onChange={(e) => setNewSlide({ ...newSlide, cta_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          {/* CTA Link */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Link Tombol (#services, #contact, dll)
            </label>
            <input 
              type="text" 
              placeholder="#services"
              value={newSlide.cta_link}
              onChange={(e) => setNewSlide({ ...newSlide, cta_link: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={uploading}
              className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Slide Hero</span>
            </button>
          </div>

        </form>
      </div>

      {/* Existing Slide List Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Daftar Slide Aktif ({sliders.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sliders.map((slide, idx) => (
            <div key={slide.id || idx} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3">
              <div className="relative h-44 rounded-lg overflow-hidden border border-white/10">
                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{slide.badge_text}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{slide.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{slide.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                <span>Tombol: <strong className="text-slate-200">{slide.cta_text || 'Lihat Katalog'}</strong> ({slide.cta_link || '#services'})</span>
                <button 
                  onClick={() => handleDelete(slide.id)} 
                  className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="Hapus Slide"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
