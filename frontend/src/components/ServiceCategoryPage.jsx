import React, { useState, useEffect } from 'react';
import { apiService, parseJSON } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck, Layers, ArrowRight } from 'lucide-react';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServiceCategoryPage({ categorySlug, onBack, onOrderProduct }) {
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryServices() {
      setLoading(true);
      try {
        const [catData, servData] = await Promise.all([
          apiService.getServiceCategories(),
          apiService.getServices()
        ]);

        const foundCat = catData.find(c => c.slug === categorySlug || c.id === parseInt(categorySlug));
        setCategory(foundCat || { name: categorySlug.replace(/-/g, ' '), slug: categorySlug });

        const filtered = servData.filter(s => 
          (s.category_slug && s.category_slug === categorySlug) ||
          (s.category_id && foundCat && s.category_id === foundCat.id) ||
          (s.category_name && foundCat && s.category_name.toLowerCase() === foundCat.name.toLowerCase())
        );
        setServices(filtered.length > 0 ? filtered : servData);
      } catch (e) {}
      setLoading(false);
    }
    loadCategoryServices();
  }, [categorySlug]);

  const handleServiceDetailClick = (slug) => {
    const targetUrl = `/service/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Memuat kategori produk...</p>
      </div>
    );
  }

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Kembali ke Katalog Utama</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl mb-12 w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow mb-3 mx-auto">Kategori Produk</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {category?.name || 'Kategori Peralatan Listrik'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed">
            {category?.description || `Pilihan produk peralatan listrik terbaik dalam kategori ${category?.name || ''} berstandar SNI.`}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{services.length} Produk Tersedia dalam Kategori Ini</span>
          </div>
        </div>

        {/* Services Grid for this Category with Explicit !important Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = parseJSON(service.features, []);

            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceDetailClick(service.slug)}
                className="glass-card product-card-container group relative overflow-hidden cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    {/* Product Image Header */}
                    <div className="relative w-full product-card-image-box bg-slate-900 border border-white/10 group-hover:border-indigo-500/40 transition-colors shrink-0">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={service.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                          <IconComponent className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Product Title */}
                    <h3 className="product-card-title text-white group-hover:text-indigo-300 transition-colors flex items-start justify-between gap-2">
                      <span>{service.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 mt-1 transition-colors" />
                    </h3>

                    {/* Price Badge */}
                    <div className="mt-2 mb-3">
                      {service.price && parseFloat(service.price) > 0 ? (
                        <span className="text-base font-extrabold text-emerald-400 font-mono">
                          Rp {Number(service.price).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                          Minta Penawaran Harga
                        </span>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="product-card-summary line-clamp-3">
                      {service.summary}
                    </p>
                  </div>

                  <div>
                    {/* Features Checklist */}
                    <div className="product-card-features-box">
                      {features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="product-card-feature-item text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleServiceDetailClick(service.slug); }}
                        className="product-card-btn flex-1 text-center font-bold text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-all flex items-center justify-center gap-1 text-[11px]"
                      >
                        <span>Detail</span>
                      </button>

                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (onOrderProduct) onOrderProduct(service); 
                        }}
                        className="product-card-btn flex-1 text-center font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center gap-1 text-[11px]"
                      >
                        <span>Pesan</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </article>
  );
}
