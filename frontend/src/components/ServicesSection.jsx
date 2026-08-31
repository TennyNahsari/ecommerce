import React, { useState, useEffect } from 'react';
import { Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, ArrowRight } from 'lucide-react';
import { apiService, parseJSON } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServicesSection({ onOrderProduct }) {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadServices() {
      const data = await apiService.getServices();
      setServices(data || []);
    }
    loadServices();
  }, []);

  const handleServiceClick = (slug) => {
    const targetUrl = `/service/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (e, catSlug) => {
    e.stopPropagation();
    if (!catSlug) return;
    const targetUrl = `/service/category/${catSlug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAllServices = () => {
    window.history.pushState({}, '', '/services');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Limit to top 4 featured services on Homepage
  const displayedServices = services.slice(0, 4);

  return (
    <section id="services" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">{t('section_services_badge')}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {t('section_services_title')}
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            {t('section_services_desc')}
          </p>
        </div>

        {/* Services Grid (Spacious Product Cards with Explicit !important Spacing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-16">
          {displayedServices.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = parseJSON(service.features, []);
            const hasCategory = Boolean(service.category_name);
            const catName = service.category_name;
            const catSlug = service.category_slug || service.slug;

            return (
              <div 
                key={service.id || service.slug} 
                onClick={() => handleServiceClick(service.slug)}
                className="glass-card product-card-container group relative overflow-hidden cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Background Accent Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all" />

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

                      {hasCategory && (
                        <div className="absolute top-3 left-3">
                          <button
                            onClick={(e) => handleCategoryClick(e, catSlug)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors shadow-md"
                            title={`Lihat produk dalam kategori "${catName}"`}
                          >
                            <Tag className="w-3 h-3 text-indigo-400" />
                            <span>{catName}</span>
                          </button>
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
                          {t('ask_offer')}
                        </span>
                      )}
                    </div>

                    {/* Product Summary */}
                    <p className="product-card-summary line-clamp-3">
                      {service.summary}
                    </p>
                  </div>

                  <div>
                    {/* Features Checklist */}
                    <div className="product-card-features-box">
                      {features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="product-card-feature-item text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer CTA Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleServiceClick(service.slug); }}
                        className="product-card-btn flex-1 text-center font-bold text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-all flex items-center justify-center gap-1 text-[11px]"
                      >
                        <span>{t('btn_view_details')}</span>
                      </button>

                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (onOrderProduct) onOrderProduct(service); 
                        }}
                        className="product-card-btn flex-1 text-center font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center gap-1 text-[11px]"
                      >
                        <span>{t('btn_buy_now')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All Services CTA */}
        <div className="flex items-center justify-center">
          <button 
            onClick={handleExploreAllServices}
            className="btn-secondary py-3.5 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>{t('btn_view_all_products')} ({services.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
