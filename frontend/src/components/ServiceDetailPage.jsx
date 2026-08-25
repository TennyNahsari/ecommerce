import React, { useState, useEffect } from 'react';
import { apiService, parseJSON } from '../services/api';
import { ArrowLeft, Layout, CheckCircle2, ArrowRight, ShieldCheck, Tag, ShoppingCart, Award } from 'lucide-react';

export default function ServiceDetailPage({ slug, onBack, onOrderProduct }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadServiceDetail() {
      setLoading(true);
      setError(null);
      try {
        const services = await apiService.getServices();
        const found = services.find(s => s.slug === slug || s.id === parseInt(slug));
        if (found) {
          setService(found);
          document.title = `${found.title} - Toko Listrik Jaya UMKM`;
        } else {
          setError('Produk peralatan listrik tidak ditemukan.');
        }
      } catch (e) {
        setError('Gagal memuat detail produk.');
      }
      setLoading(false);
    }
    loadServiceDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Memuat detail produk listrik...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto text-center border border-rose-500/30">
          <Layout className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-xs text-slate-400 mb-6">Halaman produk "/service/{slug}" tidak ditemukan.</p>
          <button onClick={onBack} className="btn-primary py-2.5 px-5 text-xs mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Katalog Produk
          </button>
        </div>
      </div>
    );
  }

  const features = parseJSON(service?.features, []);

  const handleOrderClick = () => {
    if (onOrderProduct && service) {
      onOrderProduct(service);
    }
  };

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl">
        
        {/* Back Button */}
        <div className="mb-8 flex items-center justify-start w-full">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Kembali ke Katalog Produk</span>
          </button>
        </div>

        {/* Hero Header Card with Product Image & Explicit !important Spacing */}
        <div className="glass-panel detail-hero-card border border-indigo-500/30 shadow-2xl w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Product Image Display */}
            <div className="lg:col-span-5 relative w-full detail-image-box overflow-hidden bg-slate-900 border border-white/15 shadow-xl shrink-0">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-500/10 text-indigo-400">
                  <Layout className="w-16 h-16 mb-2" />
                  <span className="text-xs text-slate-400">Toko Listrik Jaya UMKM</span>
                </div>
              )}
              {service.category_name && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs font-bold text-indigo-300 shadow-md">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{service.category_name}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Product Meta & Order CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h1 className="detail-product-title text-white">{service.title}</h1>

                {/* Formatted Price Display */}
                <div className="my-3">
                  {service.price && parseFloat(service.price) > 0 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">
                        Rp {Number(service.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ unit</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 inline-block">
                      Minta Penawaran Harga CS
                    </span>
                  )}
                </div>

                <p className="detail-product-summary">
                  {service.summary}
                </p>
              </div>

              {/* SNI & Guarantee Badge Box */}
              <div className="detail-badge-box bg-white/5 border border-white/10">
                <div className="detail-badge-item text-slate-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Jaminan Produk Original &amp; Lulus Uji Standar SNI</span>
                </div>
                <div className="detail-badge-item text-slate-200">
                  <Award className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Tersedia Pembelian Grosir &amp; Eceran Garansi Toko</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button onClick={handleOrderClick} className="btn-primary detail-cta-btn font-bold shadow-lg">
                  <ShoppingCart className="w-4.5 h-4.5 mr-2" />
                  <span>Pesan / Minta Penawaran Harga</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Deliverables & Features Grid with Explicit Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full detail-grid-section">
          
          <div className="lg:col-span-7 glass-panel detail-section-card border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="detail-section-title font-bold text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
                <span>Fitur &amp; Keunggulan Spesifikasi</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((feat, idx) => (
                  <div key={idx} className="detail-feature-pill bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-bold text-slate-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel detail-section-card border border-white/10 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-3">Toko Listrik Jaya UMKM</span>
              <h3 className="text-xl font-bold text-white mb-4">Mengapa Belanja Di Tempat Kami?</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Kami berkomitmen menyediakan peralatan listrik berkualitas dengan harga bersaing, pengiriman cepat, serta jaminan barang asli untuk kepuasan pelanggan.
              </p>
            </div>

            <button onClick={handleOrderClick} className="w-full btn-secondary text-center justify-center py-4 text-xs font-bold shadow-md">
              Hubungi Sales &amp; Tanya Stok
            </button>
          </div>

        </div>

        {/* Detailed Narrative Section */}
        {service.description && (
          <div className="glass-panel detail-section-card border border-white/10 w-full prose prose-invert max-w-none text-slate-300 leading-relaxed shadow-xl">
            <div dangerouslySetInnerHTML={{ __html: service.description }} />
          </div>
        )}

      </div>
    </article>
  );
}
