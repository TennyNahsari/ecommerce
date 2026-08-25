import React, { useState, useEffect } from 'react';
import { 
  FileText, FolderOpen, Sliders, Image, MessageSquare, 
  TrendingUp, Database, Server, CheckCircle2, Plus, Tag, Layers, Briefcase 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    servicesCount: 0,
    categoriesCount: 0,
    postsCount: 0,
    mediaCount: 0,
    inquiriesCount: 0,
    pagesCount: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [services, pCategories, posts, media, inquiries, pages] = await Promise.all([
          apiService.getServices(),
          apiService.getServiceCategories(),
          apiService.getPosts(),
          apiService.getMedia(),
          apiService.getInquiries(),
          apiService.getPages()
        ]);

        setStats({
          servicesCount: services.length,
          categoriesCount: pCategories.length,
          postsCount: posts.length,
          mediaCount: media.length,
          inquiriesCount: inquiries.length,
          pagesCount: pages.length
        });
      } catch (e) {}
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-10 cms-page-container">
      {/* Title Header */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl font-extrabold text-white">Dashboard UMKM Listrik</h1>
        <p className="text-xs text-slate-400 mt-2">Ringkasan Katalog Peralatan Listrik, Kategori, Artikel &amp; Pesanan Pelanggan</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        
        <div 
          onClick={() => onNavigate('services')}
          className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produk Listrik</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.servicesCount}</span>
          <span className="text-[11px] text-purple-400 font-semibold mt-2">Item Katalog</span>
        </div>

        <div 
          onClick={() => onNavigate('categories')}
          className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kategori</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.categoriesCount}</span>
          <span className="text-[11px] text-emerald-400 font-semibold mt-2">Kategori Produk</span>
        </div>

        <div 
          onClick={() => onNavigate('inquiries')}
          className="glass-panel p-6 rounded-2xl border border-rose-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pesanan &amp; Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.inquiriesCount}</span>
          <span className="text-[11px] text-rose-400 font-semibold mt-2">Pesan / Pesanan</span>
        </div>

        <div 
          onClick={() => onNavigate('posts')}
          className="glass-panel p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Artikel &amp; Tips</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.postsCount}</span>
          <span className="text-[11px] text-amber-400 font-semibold mt-2">Artikel Berita</span>
        </div>

        <div 
          onClick={() => onNavigate('media')}
          className="glass-panel p-6 rounded-2xl border border-sky-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Media</span>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Image className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-white">{stats.mediaCount}</span>
          <span className="text-[11px] text-sky-400 font-semibold mt-2">Asset Gambar</span>
        </div>

      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div 
          onClick={() => onNavigate('services')}
          className="glass-card p-8 rounded-2xl cursor-pointer group border border-white/10 hover:border-purple-500/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Kelola Katalog Produk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Kelola produk peralatan listrik, deskripsi, fitur spesifikasi, dan foto produk yang diunggah.</p>
        </div>

        <div 
          onClick={() => onNavigate('categories')}
          className="glass-card p-8 rounded-2xl cursor-pointer group border border-white/10 hover:border-emerald-500/50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Tag className="w-6 h-6" />
            </div>
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Kelola Kategori Produk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Kelola kategori peralatan listrik (Kabel, Sakelar, Lampu LED, Komponen Listrik).</p>
        </div>

      </div>

      {/* Infrastructure & Status Card */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Server className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2.5 mb-1">
              <span>CPanel Hosting Engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">Healthy</span>
            </h4>
            <p className="text-xs text-slate-400">Express.js API Node process running on port 5000 | PostgreSQL Pool Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>PostgreSQL DB Schema v1.0</span>
          </div>
        </div>
      </div>

    </div>
  );
}
