import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Image, Sliders, Menu as MenuIcon, X,
  MessageSquare, FolderOpen, LogOut, Sparkles, Globe, ChevronRight, Tag, Layers, ShoppingBag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Dashboard from './Dashboard';
import PageBuilder from './PageBuilder';
import PostManager from './PostManager';
import SliderManager from './SliderManager';
import NavigationManager from './NavigationManager';
import MediaLibrary from './MediaLibrary';
import InquiryInbox from './InquiryInbox';
import CategoryManager from './CategoryManager';
import ServiceManager from './ServiceManager';
import OrderManager from './OrderManager';
import FooterManager from './FooterManager';

export default function AdminLayout({ user, onLogout, onCloseAdmin }) {
  const { lang, setLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: t('admin_nav_orders'), icon: ShoppingBag },
    { id: 'services', label: t('admin_nav_services'), icon: Layers },
    { id: 'categories', label: t('admin_nav_categories'), icon: Tag },
    { id: 'menus', label: lang === 'en' ? 'Header Navigation' : 'Header Navigation', icon: MenuIcon },
    { id: 'sliders', label: t('admin_nav_sliders'), icon: Sliders },
    { id: 'posts', label: t('admin_nav_posts'), icon: FolderOpen },
    { id: 'pages', label: lang === 'en' ? 'Page Builder (HTML/CSS)' : 'Page Builder (HTML/CSS)', icon: FileText },
    { id: 'media', label: t('admin_nav_media'), icon: Image },
    { id: 'footer', label: lang === 'en' ? 'Footer & Settings' : 'Footer & Pengaturan', icon: Globe },
    { id: 'inquiries', label: t('admin_nav_inquiries'), icon: MessageSquare },
  ];

  const activeItem = menuItems.find(i => i.id === activeTab) || menuItems[0];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#081425] text-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* Top Header Bar for Mobile Devices */}
      <header className="md:hidden bg-[#0b192e] border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-extrabold text-white">CMS Admin</h2>
            <span className="text-[10px] text-indigo-400 font-semibold block">{activeItem.label}</span>
          </div>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar & Mobile Sliding Drawer Overlay */}
      <aside className={`
        fixed md:static inset-0 z-50 bg-[#0b192e] border-r border-white/10 flex flex-col justify-between p-6 shrink-0 transition-transform duration-300 w-64
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="overflow-y-auto">
          {/* Logo Branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-extrabold text-white">CMS Admin</h2>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">CPanel Panel v1.0</span>
              </div>
            </div>

            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Language Switcher */}
          <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-white/10 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase pl-1">Language:</span>
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setLang('id')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${lang === 'id' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="cms-sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full cms-sidebar-item flex items-center justify-between px-4 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs font-bold">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user?.username || 'Admin'}</span>
              <span className="text-[10px] text-slate-400 block truncate">{user?.role || 'ADMIN'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={onCloseAdmin}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              title="Return to Public Website"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold"
              title="Log out of CMS"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto bg-[#081425] p-4 md:p-8 w-full">
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => handleTabClick(tab)} />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'menus' && <NavigationManager />}
        {activeTab === 'sliders' && <SliderManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'services' && <ServiceManager />}
        {activeTab === 'posts' && <PostManager />}
        {activeTab === 'pages' && <PageBuilder />}
        {activeTab === 'media' && <MediaLibrary />}
        {activeTab === 'footer' && <FooterManager />}
        {activeTab === 'inquiries' && <InquiryInbox />}
      </main>

    </div>
  );
}
