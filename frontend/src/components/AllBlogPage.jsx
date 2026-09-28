import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Calendar, Search, Tag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AllBlogPage({ onBack }) {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadAllPosts() {
      setLoading(true);
      try {
        const data = await apiService.getPosts();
        setPosts(data || []);
      } catch (e) {}
      setLoading(false);
    }
    loadAllPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const filteredPosts = posts.filter(p => {
    return !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));

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

  const handlePostDetailClick = (slug) => {
    const targetUrl = `/blog/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">
          {lang === 'en' ? 'Loading articles & guides...' : 'Memuat artikel & panduan kelistrikan...'}
        </p>
      </div>
    );
  }

  const startIndex = currentPage * itemsPerPage;
  const displayedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

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
          <div className="badge-glow mb-3 mx-auto">{t('blog_badge')}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {lang === 'en' ? 'All Electrical Articles & Guides' : 'Semua Artikel & Panduan Kelistrikan'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed mb-6">
            {t('blog_desc')}
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              placeholder={lang === 'en' ? 'Search article title or topic...' : 'Cari judul artikel, topik kabel, atau lampu LED...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-11 pr-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-10">
          {displayedPosts.map((post) => (
            <div 
              key={post.id || post.slug}
              onClick={() => handlePostDetailClick(post.slug)}
              className="glass-card blog-card-container group cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="blog-card-image-box">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 badge-glow text-[11px] bg-slate-950/80 backdrop-blur-md">
                  {post.category_name || (lang === 'en' ? 'Electrical Tips' : 'Edukasi Listrik')}
                </span>
              </div>

              <div className="blog-card-content">
                <div>
                  <div className="blog-card-date text-slate-400">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}</span>
                  </div>
                  <h3 className="blog-card-title text-white group-hover:text-indigo-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="blog-card-excerpt line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="blog-card-footer">
                  <span className="text-xs font-bold text-indigo-300 group-hover:text-white flex items-center gap-1.5 transition-colors">
                    <span>{t('btn_read_more')}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
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
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPosts.length)} dari {filteredPosts.length} artikel
              </span>
            </div>
          </div>
        )}

      </div>
    </article>
  );
}

