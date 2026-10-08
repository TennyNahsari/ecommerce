import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Trash2, Save, Image, Link, CheckCircle2 } from 'lucide-react';
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
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    const data = await apiService.getSliders();
    setSliders(data);
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
        <h1 className="text-3xl font-extrabold text-white">Hero Slider Customizer</h1>
        <p className="text-xs text-slate-400 mt-1">Manage Homepage Image Carousel, Badges, and Call-to-Action Links</p>
      </div>

      {msg && <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}

      {/* Add New Slide Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Add Hero Slide</span>
        </h3>

        <form onSubmit={handleAddSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headline Title *</label>
            <input 
              type="text" 
              required
              placeholder="Innovators Without Borders"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Badge Highlight</label>
            <input 
              type="text" 
              placeholder="NEXT-GEN DIGITAL AGENCY"
              value={newSlide.badge_text}
              onChange={(e) => setNewSlide({ ...newSlide, badge_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Background Image URL *</label>
            <input 
              type="text" 
              required
              placeholder="https://images.unsplash.com/..."
              value={newSlide.image_url}
              onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })}
              className="glass-input w-full text-xs font-mono text-indigo-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subtitle Overview</label>
            <textarea 
              rows="2"
              placeholder="We architect futuristic digital experiences..."
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              className="glass-input w-full text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Button Label</label>
            <input 
              type="text" 
              placeholder="Explore Work"
              value={newSlide.cta_text}
              onChange={(e) => setNewSlide({ ...newSlide, cta_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Button Target Link</label>
            <input 
              type="text" 
              placeholder="#portfolio"
              value={newSlide.cta_link}
              onChange={(e) => setNewSlide({ ...newSlide, cta_link: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary py-2.5 px-5 text-xs font-bold">
              Upload Slide
            </button>
          </div>
        </form>
      </div>

      {/* Slide List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sliders.map((slide) => (
          <div key={slide.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="relative h-40 rounded-lg overflow-hidden mb-3">
              <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/60 p-3 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">{slide.badge_text}</span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{slide.title}</h4>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs text-slate-400">CTA: {slide.cta_text} ({slide.cta_link})</span>
              <button onClick={() => handleDelete(slide.id)} className="text-rose-400 hover:text-rose-300 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
