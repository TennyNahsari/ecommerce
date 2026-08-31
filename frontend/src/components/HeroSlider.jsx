import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSlider() {
  const { lang, t } = useLanguage();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  return (
    <section id="hero" className="relative min-h-screen pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden w-full text-center">
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out opacity-25 filter blur-[2px]"
        style={{ backgroundImage: `url(${currentSlide.image_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#081425]/90 via-[#081425]/80 to-[#081425]" />

      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-6 w-full">
          
          {/* Glowing Badge */}
          <div className="badge-glow animate-pulse mx-auto">
            <span className="pulse-dot"></span>
            <span>{currentSlide.badge_text || 'NEXT-GEN DIGITAL AGENCY'}</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-center w-full">
            <span className="gradient-text">{currentSlide.title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-center">
            {currentSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 mx-auto">
            <a href={currentSlide.cta_link || '#services'} className="btn-primary">
              <span>{currentSlide.cta_text || t('hero_cta_1')}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#contact" className="btn-secondary">
              {lang === 'en' ? 'Contact & Wholesale Quote' : 'Konsultasi & Penawaran'}
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl mx-auto glass-panel p-6 rounded-2xl border border-white/10 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-extrabold text-indigo-400">99.4%</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
                {lang === 'en' ? 'Client Satisfaction' : 'Kepuasan Pelanggan'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-extrabold text-purple-400">100%</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
                {lang === 'en' ? 'SNI Certified' : 'Standar Mutu SNI'}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-extrabold text-sky-400">5.000+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">
                {lang === 'en' ? 'Orders Shipped' : 'Pesanan Terkirim'}
              </span>
            </div>
          </div>

        </div>

        {/* Slide Controls */}
        {safeSlides.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 mx-auto">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? safeSlides.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {safeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % safeSlides.length)}
              className="p-2 rounded-full bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
