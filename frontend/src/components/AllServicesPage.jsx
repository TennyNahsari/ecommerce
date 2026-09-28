import React, { useState, useEffect } from 'react';
import { apiService, parseJSON } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, Layers, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function AllServicesPage({ onBack, onOrderProduct }) {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([{ name: lang === 'en' ? 'ALL' : 'SEMUA', slug: 'all' }]);
  const [filter, setFilter] = useState('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadAllServices() {
      setLoading(true);
      try {
        const [servData, catData] = await Promise.all([
          apiService.getServices(),
          apiService.getServiceCategories()
        ]);
        setServices(servData || []);
        if (catData && catData.length > 0) {
          setCategories([{ name: lang === 'en' ? 'ALL' : 'SEMUA', slug: 'all' }, ...catData]);
        }
      } catch (e) {}
      setLoading(false);
    }
    loadAllServices();
  }, [lang]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filter, searchQuery]);

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'SEMUA' || filter === 'ALL' || 
      (s.category_name && s.category_name.toLowerCase().includes(filter.toLowerCase())) ||
      (s.category_slug && s.category_slug === filter.toLowerCase());
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / itemsPerPage));

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleGoToPage = (index) => {
    setCurrentPage(index);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const pages = [];
    const current = currentPage;

    pages.push(0, 1);
    if (current > 2) {
      pages.push('ellipsis-1');
    }
    if (current > 1 && current < totalPages - 2) {
      pages.push(current);
    }
    if (current < totalPages - 3) {
      pages.push('ellipsis-2');
    }
    pages.push(totalPages - 2, totalPages - 1);

    return pages.filter((item, idx, self) => self.indexOf(item) === idx);
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

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">
          {lang === 'en' ? 'Loading product catalog...' : 'Memuat katalog produk peralatan listrik...'}
        </p>
      </div>
    );
  }

  const startIndex = currentPage * itemsPerPage;
  const displayedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

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
            <span>{lang === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}</span>
          </button>
        </div>

        {/* Directory Header Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl mb-12 w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow mb-3 mx-auto">{t('section_services_badge')}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {lang === 'en' ? 'All Electrical Products' : 'Semua Produk Peralatan Listrik'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed mb-6">
            {t('section_services_desc')}
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              placeholder={lang === 'en' ? 'Search cables, LED lights, sockets, switches...' : 'Cari kabel, lampu LED, stop kontak, sakelar...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-11 pr-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === cat.name
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-10">
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
                      {features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="product-card-feature-item text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
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

        {/* Pagination Controls (Prev, beberapa awal, ..., beberapa akhir, Next) */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 w-full mb-10">
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg">
              {/* Prev Button */}
              <button
                onClick={handlePrevPage}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Halaman Sebelumnya"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Number Buttons (Beberapa Halaman Awal & Beberapa Halaman Akhir) */}
              <div className="flex items-center gap-1.5 px-1">
                {getPageNumbers().map((item) => {
                  if (typeof item === 'string') {
                    return (
                      <span key={item} className="text-slate-500 text-xs px-1 select-none">
                        ...
                      </span>
                    );
                  }
                  const isActive = item === currentPage;
                  return (
                    <button
                      key={item}
                      onClick={() => handleGoToPage(item)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400'
                          : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-white/10'
                      }`}
                      title={`Ke Halaman ${item + 1}`}
                      aria-label={`Go to page ${item + 1}`}
                    >
                      {item + 1}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Halaman Selanjutnya"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Page Counter */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredServices.length)} dari {filteredServices.length} produk
              </span>
            </div>
          </div>
        )}

      </div>
    </article>
  );
}

