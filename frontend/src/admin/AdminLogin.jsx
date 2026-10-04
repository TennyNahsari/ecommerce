import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowRight, Home } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const { lang, setLang, t } = useLanguage();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await apiService.login(username, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message || (lang === 'en' ? 'Authentication failed. Please check your username and password.' : 'Autentikasi gagal. Periksa username dan password Anda.'));
    }
  };

  const handleGoToLandingPage = (e) => {
    if (e) e.preventDefault();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
      <div className="glass-panel login-modal-card border border-indigo-500/30 shadow-2xl relative">
        
        {/* Top Header Bar with Landing Page Link & Language Selector */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <a
            href="/"
            onClick={handleGoToLandingPage}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-800/60"
            title={lang === 'en' ? 'Back to Landing Page' : 'Kembali ke Landing Page'}
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span>{lang === 'en' ? 'Landing Page' : 'Beranda'}</span>
          </a>

          <div className="flex items-center bg-slate-900/80 rounded-xl p-1 border border-white/15">
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

        {/* Header */}
        <div className="text-center">
          <div className="login-modal-icon-box bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="login-modal-title text-white">Toko Listrik Jaya CMS</h2>
          <p className="login-modal-subtitle">
            {lang === 'en' ? 'Admin Access Panel for E-Commerce & Content' : 'Akses Panel Admin Pengelolaan Katalog & Konten'}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Notice */}
        <div className="login-modal-demo-box bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
          <span className="font-bold block mb-1">
            {lang === 'en' ? 'Default Admin Credentials:' : 'Kredensial Default Admin:'}
          </span>
          Username: <code className="bg-slate-900 px-2 py-0.5 rounded text-white font-mono">admin</code> | Password: <code className="bg-slate-900 px-2 py-0.5 rounded text-white font-mono">admin123</code>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-modal-form-group">
            <label className="login-modal-label font-bold uppercase">
              {lang === 'en' ? 'Username / Email *' : 'Username / Email *'}
            </label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input login-modal-input font-semibold"
            />
          </div>

          <div className="login-modal-form-group">
            <label className="login-modal-label font-bold uppercase">
              {lang === 'en' ? 'Password *' : 'Password Keamanan *'}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input login-modal-input font-mono"
            />
          </div>

          <div className="login-modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary login-modal-btn flex-1 justify-center font-bold"
            >
              {lang === 'en' ? 'Cancel' : 'Batal'}
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary login-modal-btn flex-1 justify-center font-bold"
            >
              <span>{loading ? (lang === 'en' ? 'Processing...' : 'Memproses...') : (lang === 'en' ? 'Sign In' : 'Masuk Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Landing Page Link Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
          <a
            href="/"
            onClick={handleGoToLandingPage}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'en' ? '← Back to Landing Page' : '← Kembali ke Halaman Utama (Landing Page)'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
