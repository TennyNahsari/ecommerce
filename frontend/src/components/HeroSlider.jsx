import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
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
      className="relative min-h-[90vh] pt-32 pb-16 flex flex-col items-center justify-center overflow-hidden w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel with High-Quality Contrast Overlay */}
      {safeSlides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-40 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ backgroundImage: `url(${slide.image_url})` }}
        />
      ))}

      {/* Modern Gradient Vignette for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#081425]/90 via-[#081425]/75 to-[#081425]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        {/* Main Hero Showcase Card */}
        <div className="w-full max-w-5xl mx-auto glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500">
          
          {/* Top Header Badge & Slide Counter */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="badge-glow flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-300">
                {currentSlide.badge_text || 'PROMO SPESIAL UMKM'}
              </span>
            </div>

            {safeSlides.length > 1 && (
              <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-bold tracking-widest">
                SLIDE 0{currentIndex + 1} / 0{safeSlides.length}
              </div>
            )}
          </div>

          {/* Dynamic Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Text & CTAs Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                <span className="gradient-text bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  {currentSlide.title}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                {currentSlide.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full">
                <a 
                  href={currentSlide.cta_link || '#services'} 
                  className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-transform"
                >
                  <span>{currentSlide.cta_text || t('hero_cta_1')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  href="#contact" 
                  className="btn-secondary py-3 px-6 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {lang === 'en' ? 'Contact & Wholesale Quote' : 'Konsultasi & Penawaran'}
                </a>
              </div>
            </div>

            {/* Slider Visual Banner Preview Column */}
            <div className="lg:col-span-5 relative w-full aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
              <img 
                src={currentSlide.image_url} 
                alt={currentSlide.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Standard Mutu SNI & Garansi Toko</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Slide Controls & Indicators */}
          {safeSlides.length > 1 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
              
              {/* Dots / Indicators */}
              <div className="flex items-center gap-2">
                {safeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'w-10 bg-indigo-500 shadow-lg shadow-indigo-500/50' 
                        : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-600/40 border border-white/15 text-white transition-all hover:scale-105 active:scale-95"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-600/40 border border-white/15 text-white transition-all hover:scale-105 active:scale-95"
                  title="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Key Metric Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-4xl mx-auto glass-panel p-5 rounded-2xl border border-white/10 text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">99.4%</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
              {lang === 'en' ? 'Client Satisfaction' : 'Kepuasan Pelanggan'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">100%</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
              {lang === 'en' ? 'SNI Certified' : 'Standar Mutu SNI'}
            </span>
          </div>
          <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-sky-400">5.000+</span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
              {lang === 'en' ? 'Orders Shipped' : 'Pesanan Terkirim'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
