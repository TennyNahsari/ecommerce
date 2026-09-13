import React, { useState, useEffect } from 'react';
import { Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // Touch Swipe state for mobile horizontal pagination
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    async function loadServices() {
      const data = await apiService.getServices();
      setServices(data || []);
    }
    loadServices();
  }, []);

  const totalPages = Math.max(1, Math.ceil(services.length / itemsPerPage));

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleGoToPage = (index) => {
    setCurrentPage(index);
  };

  // Touch Gesture Handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextPage();
    } else if (isRightSwipe) {
      handlePrevPage();
    }
  };

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

  // Paginated services subset (3 products per page = 3 rows on mobile)
  const startIndex = currentPage * itemsPerPage;
  const displayedServices = services.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="services" className="w-full section-padding relative flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">{t('section_services_badge')}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {t('section_services_title')}
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            {t('section_services_desc')}
          </p>
        </div>

        {/* Swipe Container for Mobile Horizontal Pagination */}
        <div 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="w-full relative touch-pan-y"
        >
          {/* Services Grid (3 Items / 3 Rows per page on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full mb-8 transition-opacity duration-300">
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
                  className="glass-card product-card-container group relative overflow-hidden cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
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
                      <h3 className="product-card-title text-white group-hover:text-indigo-300 transition-colors flex items-start justify-between gap-2 mt-4">
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
                      <p className="product-card-summary line-clamp-3 text-slate-400 text-xs md:text-sm">
                        {service.summary}
                      </p>
                    </div>

                    <div className="mt-4">
                      {/* Features Checklist */}
                      <div className="product-card-features-box mb-4">
                        {features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="product-card-feature-item text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer CTA Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleServiceClick(service.slug); }}
                          className="product-card-btn flex-1 py-2.5 text-center font-bold text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/5 transition-all flex items-center justify-center gap-1 text-[11px]"
                        >
                          <span>{t('btn_view_details')}</span>
                        </button>

                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (onOrderProduct) onOrderProduct(service); 
                          }}
                          className="product-card-btn flex-1 py-2.5 text-center font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all flex items-center justify-center gap-1 text-[11px]"
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
        </div>

        {/* Side Pagination Controls (Panah & Dot Indicators) */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 w-full mb-10">
            <div className="flex items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
              {/* Prev Button */}
              <button
                onClick={handlePrevPage}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Halaman Sebelumnya (Swipe Kanan)"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2 px-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const isActive = idx === currentPage;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleGoToPage(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        isActive
                          ? 'w-7 h-2.5 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                          : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
                      }`}
                      title={`Ke Halaman ${idx + 1}`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Halaman Selanjutnya (Swipe Kiri)"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Page Counter & Swipe Hint */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Produk {startIndex + 1}-{Math.min(startIndex + itemsPerPage, services.length)} dari {services.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400/90 hidden sm:inline">Geser/Swipe atau klik panah untuk melihat produk lainnya</span>
              <span className="text-indigo-400/90 sm:hidden">Swipe ◄ ► untuk scroll produk</span>
            </div>
          </div>
        )}

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

