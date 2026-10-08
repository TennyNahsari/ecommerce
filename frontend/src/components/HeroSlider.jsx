import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider() {
  const { lang, t } = useLanguage();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadSliders() {
      const data = await apiService.getSliders();
      if (data && data.length > 0) {
        setSlides(data);
      }
    }
    loadSliders();
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const defaultSlide = {
    id: 1,
    title: t('hero_title_1'),
    subtitle: t('hero_sub_1'),
    badge_text: t('hero_badge_1'),
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
    cta_text: t('hero_cta_1'),
    cta_link: '#services'
  };

  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [defaultSlide];
  const currentSlide = safeSlides[currentIndex] || safeSlides[0] || defaultSlide;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? safeSlides.length - 1 : prev - 1));
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden w-full text-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-bleed background hero slider image (Keseluruhan Section Hero) */}
      {safeSlides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ backgroundImage: `url(${slide.image_url})` }}
        />
      ))}

      {/* Bright & Crisp Overlay for Text Legibility while keeping Hero Image vivid & bright */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#081425] via-[#081425]/30 to-[#081425]/20" />

      {/* Hero Content Overlay Container */}
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
        
        {/* Main Glassmorphic Text Card Overlaid on Full Hero Image */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-6 w-full glass-panel p-6 sm:p-12 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md">
          
          {/* Top Glowing Badge & Slide Counter */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="badge-glow flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-200">
                {currentSlide.badge_text || 'PROMO SPESIAL UMKM'}
              </span>
            </div>

            {safeSlides.length > 1 && (
              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold tracking-widest backdrop-blur-sm">
                0{currentIndex + 1} / 0{safeSlides.length}
              </div>
            )}
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] text-center w-full drop-shadow-lg">
            <span className="gradient-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              {currentSlide.title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed text-center drop-shadow">
            {currentSlide.subtitle}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 mx-auto">
            <a 
              href={currentSlide.cta_link || '#services'} 
              className="btn-primary py-3.5 px-8 text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{currentSlide.cta_text || t('hero_cta_1')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a 
              href="#contact" 
              className="btn-secondary py-3.5 px-8 text-sm font-semibold hover:bg-white/15 backdrop-blur-sm transition-all"
            >
              {lang === 'en' ? 'Contact & Wholesale Quote' : 'Konsultasi & Penawaran'}
            </a>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-3xl mx-auto bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400">99.4%</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mt-0.5 text-center">
                {lang === 'en' ? 'Client Satisfaction' : 'Kepuasan Pelanggan'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-purple-400">100%</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mt-0.5 text-center">
                {lang === 'en' ? 'SNI Certified' : 'Standar Mutu SNI'}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-400">5.000+</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider mt-0.5 text-center">
                {lang === 'en' ? 'Orders Shipped' : 'Pesanan Terkirim'}
              </span>
            </div>
          </div>

        </div>

        {/* Carousel Slide Controls (Left/Right Arrows & Indicators) */}
        {safeSlides.length > 1 && (
          <div className="flex items-center justify-between w-full max-w-4xl mt-8 px-4 relative z-20">
            {/* Previous Slide Button */}
            <button
              onClick={prevSlide}
              className="p-3 rounded-2xl bg-slate-900/70 hover:bg-indigo-600 border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
              title="Slide Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Slide Indicators / Dots */}
            <div className="flex items-center gap-2.5 bg-slate-950/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              {safeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  title={`Pindah ke Slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-9 bg-indigo-500 shadow-md shadow-indigo-500/50' 
                      : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Next Slide Button */}
            <button
              onClick={nextSlide}
              className="p-3 rounded-2xl bg-slate-900/70 hover:bg-indigo-600 border border-white/20 text-white transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md"
              title="Slide Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
