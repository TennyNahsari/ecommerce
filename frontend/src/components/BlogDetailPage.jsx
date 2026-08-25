import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Calendar, Tag, User, Clock, ArrowRight } from 'lucide-react';

export default function BlogDetailPage({ slug, onBack }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPostDetail() {
      setLoading(true);
      setError(null);
      try {
        const posts = await apiService.getPosts();
        const found = posts.find(p => p.slug === slug || p.id === parseInt(slug));
        if (found) {
          setPost(found);
          document.title = `${found.meta_title || found.title} - Toko Listrik Jaya UMKM`;
        } else {
          setError('Artikel tidak ditemukan.');
        }
      } catch (e) {
        setError('Gagal memuat isi artikel.');
      }
      setLoading(false);
    }
    loadPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading article content...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto text-center border border-rose-500/30">
          <Calendar className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The article page "/blog/{slug}" does not exist.</p>
          <button onClick={onBack} className="btn-primary py-2.5 px-5 text-xs mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Insights
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-start w-full">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Insights</span>
          </button>
        </div>

        {/* Hero Header Banner */}
        <div className="mb-8 text-center flex flex-col items-center w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-glow">{post.category_name || 'Thought Leadership'}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center leading-tight max-w-4xl">
            {post.title}
          </h1>

          <p className="text-slate-300 text-base md:text-lg text-center leading-relaxed max-w-3xl mb-2">
            {post.excerpt}
          </p>
        </div>

        {/* Featured Image - Explicit 44px bottom clearance */}
        {post.featured_image && (
          <div className="w-full h-[360px] md:h-[480px] rounded-3xl overflow-hidden blog-detail-hero-gap border border-white/10 relative shadow-2xl">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* Narrative Article Content Render Area - Explicit 44px section clearance */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 blog-detail-section-gap w-full prose prose-invert max-w-none text-slate-300 leading-relaxed shadow-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content_html || `<p>${post.excerpt}</p>` }} />
        </div>

        {/* Bottom CTA Card - Explicit 44px top clearance */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 text-center flex flex-col items-center justify-center gap-6 w-full shadow-2xl mt-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">Want to Implement These Digital Insights?</h3>
          <p className="text-slate-300 text-sm max-w-xl text-center leading-relaxed">
            Partner with DigiAgency strategists to build high-converting React platforms, automated SEO systems, and futuristic brand identities.
          </p>
          <a href="#contact" className="btn-primary py-3.5 px-8 text-xs font-bold shadow-lg">
            <span>Schedule Strategy Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </article>
  );
}
