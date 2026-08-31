import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function BlogSection() {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const data = await apiService.getPosts();
      setPosts(data || []);
    }
    loadPosts();
  }, []);

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

  // Limit top 3 articles on Homepage
  const displayedPosts = posts.slice(0, 3);

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

        {/* Blog Posts Grid with Explicit !important Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
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
