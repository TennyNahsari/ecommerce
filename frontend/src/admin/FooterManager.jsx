import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle2, AlertCircle, Globe, Mail, Phone, MapPin, Instagram, Twitter, AtSign, Facebook, Linkedin, Youtube } from 'lucide-react';
import { apiService } from '../services/api';

export default function FooterManager() {
  const [footerData, setFooterData] = useState({
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

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const data = await apiService.getFooterSettings();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      setFooterData(prev => ({ ...prev, ...data }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    setErrorMsg('');
    try {
      const res = await apiService.saveFooterSettings(footerData);
      setSaving(false);
      if (res.success || res.data) {
        setMsg('Footer & Social Media settings saved successfully!');
      } else {
        setErrorMsg('Failed to save footer settings.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Error connecting to API server.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Footer & Contact Settings Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global website footer bio, address, email/phone, social links, and copyright text</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg">
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? 'Saving to Database...' : 'Save Footer Settings'}
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        
        {/* Company Bio Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Company Branding & Bio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Brand Name</label>
              <input 
                type="text"
                value={footerData.company_name || ''}
                onChange={(e) => setFooterData({ ...footerData, company_name: e.target.value })}
                className="glass-input w-full text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Copyright & Legal Text</label>
              <input 
                type="text"
                value={footerData.copyright_text || ''}
                onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                className="glass-input w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Footer Bio Paragraph</label>
            <textarea 
              rows="3"
              value={footerData.company_bio || ''}
              onChange={(e) => setFooterData({ ...footerData, company_bio: e.target.value })}
              className="glass-input w-full text-xs leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Office Address & Contact Info</h3>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HQ Office Location Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text"
                value={footerData.office_address || ''}
                onChange={(e) => setFooterData({ ...footerData, office_address: e.target.value })}
                className="glass-input w-full pl-10 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Inquiry Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email"
                  value={footerData.contact_email || ''}
                  onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  value={footerData.contact_phone || ''}
                  onChange={(e) => setFooterData({ ...footerData, contact_phone: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Social Media Handles & Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instagram URL</label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-pink-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://instagram.com/username"
                  value={footerData.social_instagram || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_instagram: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-pink-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Twitter / X URL</label>
              <div className="relative">
                <Twitter className="w-4 h-4 text-sky-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://twitter.com/username"
                  value={footerData.social_twitter || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_twitter: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-sky-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Threads URL</label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://threads.net/@username"
                  value={footerData.social_threads || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_threads: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-purple-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facebook URL</label>
              <div className="relative">
                <Facebook className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://facebook.com/page"
                  value={footerData.social_facebook || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_facebook: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://linkedin.com/company/name"
                  value={footerData.social_linkedin || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_linkedin: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-indigo-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">YouTube URL</label>
              <div className="relative">
                <Youtube className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="https://youtube.com/@channel"
                  value={footerData.social_youtube || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_youtube: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-red-300"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
