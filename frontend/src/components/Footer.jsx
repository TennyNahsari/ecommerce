import React, { useState, useEffect } from 'react';
import { Sparkles, Instagram, Twitter, Facebook, Linkedin, Youtube, AtSign, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, setLang, t } = useLanguage();
  const [footerSettings, setFooterSettings] = useState({
    company_name: 'Toko Listrik Jaya UMKM',
    company_bio: 'Pusat grosir & eceran peralatan listrik terpercaya untuk kebutuhan rumah tangga, instalasi gedung, toko, dan UMKM. Produk 100% berkualitas & berstandar SNI.',
    office_address: 'Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta',
    contact_email: 'sales@tokolistrikjaya.com',
    contact_phone: '+62 812-3456-7890',
    copyright_text: '© 2026 Toko Listrik Jaya UMKM. Seluruh Hak Cipta Dilindungi.',
    social_instagram: 'https://instagram.com',
    social_twitter: 'https://twitter.com',
    social_threads: 'https://threads.net',
    social_facebook: 'https://facebook.com',
    social_linkedin: 'https://linkedin.com',
    social_youtube: 'https://youtube.com'
  });

  useEffect(() => {
    async function loadFooterSettings() {
      const data = await apiService.getFooterSettings();
      if (data && typeof data === 'object') {
        setFooterSettings(prev => ({ ...prev, ...data }));
      }
    }
    loadFooterSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 footer-top-clearance pb-16 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 w-full">
          
          {/* Brand & Dynamic Bio */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-extrabold text-white">
                {footerSettings.company_name || 'Toko Listrik Jaya'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {lang === 'en' 
                ? 'Trusted wholesale & retail center for electrical equipment for households, building installations, shops, and MSMEs. 100% quality & SNI standard products.' 
                : footerSettings.company_bio}
            </p>

            {/* Language Switcher Pill */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Bahasa / Language:</span>
              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-white/15 shrink-0">
                <button
                  type="button"
                  onClick={() => setLang('id')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${lang === 'id' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🇮🇩 ID
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            {/* Address & Contact Info */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-400">
              {footerSettings.office_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{footerSettings.office_address}</span>
                </div>
              )}
              {footerSettings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <a href={`mailto:${footerSettings.contact_email}`} className="hover:text-white transition-colors">{footerSettings.contact_email}</a>
                </div>
              )}
              {footerSettings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{footerSettings.contact_phone}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center flex-wrap gap-2.5 pt-3">
              {footerSettings.social_instagram && (
                <a href={footerSettings.social_instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_twitter && (
                <a href={footerSettings.social_twitter} target="_blank" rel="noreferrer" title="Twitter / X" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_threads && (
                <a href={footerSettings.social_threads} target="_blank" rel="noreferrer" title="Threads" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors">
                  <AtSign className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_facebook && (
                <a href={footerSettings.social_facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_linkedin && (
                <a href={footerSettings.social_linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_youtube && (
                <a href={footerSettings.social_youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{t('footer_categories')}</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">{lang === 'en' ? 'Cables & Installation' : 'Kabel & Instalasi Listrik'}</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">{lang === 'en' ? 'Sockets & Switches' : 'Stop Kontak & Sakelar'}</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">{lang === 'en' ? 'Energy Efficient LED' : 'Lampu LED Hemat Energi'}</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">{lang === 'en' ? 'MCB & Safety Switches' : 'Komponen & Pengaman MCB'}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{t('footer_quick_links')}</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-indigo-400 transition-colors">{t('nav_home')}</a></li>
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">{t('nav_about')}</a></li>
              <li><a href="#blog" className="hover:text-indigo-400 transition-colors">{t('nav_blog')}</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">{t('nav_contact')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 w-full">
          <p>{lang === 'en' ? t('footer_copyright') : (footerSettings.copyright_text || t('footer_copyright'))}</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>{lang === 'en' ? 'Back to top' : 'Ke Atas'}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
