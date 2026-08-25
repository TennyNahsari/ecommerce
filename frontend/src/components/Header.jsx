import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Lock } from 'lucide-react';
import { apiService } from '../services/api';

export default function Header({ onOpenAdmin, onOpenOrderTracking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([
    { id: 1, label: 'Beranda', url: '#hero' },
    { id: 2, label: 'Katalog Produk', url: '#services' },
    { id: 3, label: 'Tentang Kami', url: '#about' },
    { id: 4, label: 'Artikel & Tips', url: '#blog' },
    { id: 5, label: 'Kontak', url: '#contact' },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    async function loadMenus() {
      try {
        const menus = await apiService.getMenus();
        if (menus && menus.length > 0) {
          setNavLinks(menus);
        }
      } catch (e) {}
    }
    loadMenus();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, link) => {
    const url = (link && (link.url || link.href)) || '';
    if (!url) return;
    const isAnchor = url.startsWith('#');
    const isCurrentHome = window.location.pathname === '/';

    if (url.startsWith('/')) {
      if (e) e.preventDefault();
      window.history.pushState({}, '', url);
      window.dispatchEvent(new Event('popstate'));
      setMobileMenuOpen(false);
      return;
    }

    if (isAnchor && !isCurrentHome) {
      if (e) e.preventDefault();
      window.history.pushState({}, '', '/' + url);
      window.dispatchEvent(new Event('popstate'));
      setMobileMenuOpen(false);
      setTimeout(() => {
        try {
          const element = document.querySelector(url);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {}
      }, 100);
      return;
    }

    if (isAnchor && isCurrentHome) {
      if (e) e.preventDefault();
      try {
        const element = document.querySelector(url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {}
      setMobileMenuOpen(false);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-4 shadow-2xl' : 'bg-transparent py-6'}`}>
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Column: Brand Logo */}
        <div className="flex-1 flex items-center justify-start">
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 text-decoration-none group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-400 p-[2px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Toko<span className="text-indigo-400">Listrik Jaya</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase -mt-1">Peralatan Listrik UMKM</span>
            </div>
          </a>
        </div>

        {/* Center Column: Dynamic Centered Navigation Links */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="glass-panel px-6 py-2 rounded-full border border-white/10 flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id || link.label}
                href={link.url || link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors py-1 whitespace-nowrap"
              >
                {link.label || link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Column: CTA */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          <button
            onClick={onOpenOrderTracking}
            className="btn-secondary py-2.5 px-4 text-xs font-bold whitespace-nowrap border border-white/10 hover:border-indigo-400/50"
          >
            Cek Status Pesanan
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel m-4 p-6 rounded-2xl border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <a
              key={link.id || link.label}
              href={link.url || link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-base font-semibold text-slate-200 hover:text-indigo-400 py-2 border-b border-white/5"
            >
              {link.label || link.name}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, { url: '#contact' })}
              className="w-full btn-primary text-center justify-center py-3 text-sm"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
