import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function BlogSection() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    async function loadPosts() {
      const data = await apiService.getPosts();
      setPosts(data || []);
    }
    loadPosts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / itemsPerPage));

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

  const handlePostClick = (slug) => {
    const targetUrl = `/blog/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAllBlog = () => {
    window.history.pushState({}, '', '/blog');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Paginated articles (3 items per page)
  const startIndex = currentPage * itemsPerPage;
  const displayedPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="blog" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">{t('blog_badge')}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {t('blog_title')}
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            {t('blog_desc')}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          {displayedPosts.map((post) => (
            <div 
              key={post.id || post.slug}
              onClick={() => handlePostClick(post.slug)}
              className="glass-card blog-card-container group cursor-pointer border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Image Banner */}
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

              {/* Content Area */}
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
                title="Artikel Sebelumnya"
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
                title="Artikel Selanjutnya"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Page Counter */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                Artikel {startIndex + 1}-{Math.min(startIndex + itemsPerPage, posts.length)} dari {posts.length}
              </span>
            </div>
          </div>
        )}

        {/* Explore All Insights CTA */}
        <div className="flex items-center justify-center">
          <button 
            onClick={handleExploreAllBlog}
            className="btn-secondary py-3.5 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>{t('btn_all_articles')} ({posts.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}

