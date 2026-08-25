import React, { useState } from 'react';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminLogin({ onLoginSuccess, onClose }) {
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
      setError(res.message || 'Autentikasi gagal. Periksa username dan password Anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
      <div className="glass-panel login-modal-card border border-indigo-500/30 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center">
          <div className="login-modal-icon-box bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="login-modal-title text-white">Toko Listrik Jaya CMS</h2>
          <p className="login-modal-subtitle">Akses Panel Admin Pengelolaan Katalog &amp; Konten</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Notice */}
        <div className="login-modal-demo-box bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
          <span className="font-bold block mb-1">Kredensial Default Admin:</span>
          Username: <code className="bg-slate-900 px-2 py-0.5 rounded text-white font-mono">admin</code> | Password: <code className="bg-slate-900 px-2 py-0.5 rounded text-white font-mono">admin123</code>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-modal-form-group">
            <label className="login-modal-label font-bold uppercase">Username / Email *</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input login-modal-input font-semibold"
            />
          </div>

          <div className="login-modal-form-group">
            <label className="login-modal-label font-bold uppercase">Password Keamanan *</label>
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
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary login-modal-btn flex-1 justify-center font-bold"
            >
              <span>{loading ? 'Memproses...' : 'Masuk Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
