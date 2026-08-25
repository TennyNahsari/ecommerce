import React, { useState, useEffect } from 'react';
import { Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServicesSection() {
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

  // Option B: Limit to top 4 featured services on Homepage
  const displayedServices = services.slice(0, 4);

  return (
    <section id="services" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">Katalog Peralatan Listrik</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            Pilihan Produk Listrik <span className="gradient-text-accent">Terbaik & SNI</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            Menyediakan kabel tembaga murni, stop kontak tahan panas, sakelar modern, lampu LED hemat energi, dan pengaman listrik bergaransi resmi.
          </p>
        </div>

        {/* Services Grid (Showcase 4 Featured) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-14">
          {displayedServices.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);
            const hasCategory = Boolean(service.category_name);
            const catName = service.category_name;
            const catSlug = service.category_slug || service.slug;

            return (
              <div 
                key={service.id || service.slug} 
                onClick={() => handleServiceClick(service.slug)}
                className="glass-card p-7 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
              >
                {/* Background Accent Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all" />

                <div>
                  {hasCategory && (
                    <div className="mb-4">
                      <button
                        onClick={(e) => handleCategoryClick(e, catSlug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                        title={`View all services in category "${catName}"`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{catName}</span>
                      </button>
                    </div>
                  )}

                  <div className="w-13 h-13 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-300 mb-5 line-clamp-3 leading-relaxed">
                    {service.summary}
                  </p>

                  <div className="space-y-2 mb-6">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceClick(service.slug); }}
                  className="w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-2.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all"
                >
                  View Detail Page &rarr;
                </button>
              </div>
            );
          })}
        </div>

        {/* Option B: Explore All Services CTA */}
        <div className="flex items-center justify-center">
          <button 
            onClick={handleExploreAllServices}
            className="btn-secondary py-3.5 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>Lihat Seluruh Katalog Produk Listrik ({services.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
