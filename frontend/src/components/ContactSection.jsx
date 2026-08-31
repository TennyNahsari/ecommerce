import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: 'Eceran (Rumah Tangga)',
    service_interest: 'Kabel & Instalasi Listrik',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    const res = await apiService.sendInquiry(formData);
    setLoading(false);

    if (res.success) {
      setResponseMsg({
        type: 'success',
        text: lang === 'en' 
          ? 'Your message / inquiry has been sent successfully. Our team will contact you shortly!' 
          : 'Pesan / Permintaan Penawaran Anda berhasil terkirim. Tim kami akan segera menghubungi Anda!'
      });
      setFormData({ name: '', email: '', company: '', budget: 'Eceran (Rumah Tangga)', service_interest: 'Kabel & Instalasi Listrik', message: '' });
    } else {
      setResponseMsg({ type: 'error', text: res.message || 'Error sending inquiry.' });
    }
  };

  return (
    <section id="contact" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="contact-left-box">
              <div className="badge-glow contact-badge">{t('contact_badge')}</div>
              <h2 className="contact-title text-white">
                {t('contact_title')}
              </h2>
              <p className="contact-subtitle">
                {t('contact_desc')}
              </p>
            </div>

            {/* HQ Contact Details */}
            <div className="contact-info-list">
              <div className="contact-info-item glass-panel border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Alamat Toko &amp; Gudang</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta</p>
                </div>
              </div>

              <div className="contact-info-item glass-panel border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Email Penawaran &amp; Pemesanan</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">sales@tokolistrikjaya.com | info@tokolistrikjaya.com</p>
                </div>
              </div>

              <div className="contact-info-item glass-panel border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">WhatsApp &amp; Telepon Fast Response</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">+62 812-3456-7890 (Senin - Sabtu: 08.00 - 17.00 WIB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 glass-panel contact-form-card border border-indigo-500/30 shadow-2xl relative w-full">
            <h3 className="contact-form-title text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span>Formulir Pesanan &amp; Tanya Harga</span>
            </h3>

            {responseMsg && (
              <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 text-xs font-semibold ${
                responseMsg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{responseMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
                <div>
                  <label className="contact-form-label font-bold uppercase">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Budi Prasetyo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input contact-form-input font-semibold"
                  />
                </div>

                <div>
                  <label className="contact-form-label font-bold uppercase">Alamat Email / No. WA *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="budi@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input contact-form-input font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-form-row">
                <div>
                  <label className="contact-form-label font-bold uppercase">Nama Usaha / Kota</label>
                  <input 
                    type="text" 
                    placeholder="Toko Listrik Sejahtera / Jakarta"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glass-input contact-form-input font-semibold"
                  />
                </div>

                <div>
                  <label className="contact-form-label font-bold uppercase">Kategori Produk Diminati</label>
                  <select 
                    value={formData.service_interest}
                    onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                    className="glass-input contact-form-input bg-slate-900 text-slate-200"
                  >
                    <option value="Kabel & Instalasi Listrik">Kabel &amp; Instalasi Listrik</option>
                    <option value="Stop Kontak, Sakelar & Steker">Stop Kontak, Sakelar &amp; Steker</option>
                    <option value="Lampu & Penghemat Energi">Lampu &amp; Penghemat Energi</option>
                    <option value="Komponen & Pengaman Listrik">Komponen &amp; Pengaman Listrik</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-row">
                <label className="contact-form-label font-bold uppercase">Jenis Pembelian</label>
                <div className="grid grid-cols-2 md:grid-cols-4 contact-type-grid">
                  {['Eceran (Rumah Tangga)', 'Grosir / Reseller', 'Instalasi Gedung/Proyek', 'Lainnya'].map((range) => (
                    <button
                      type="button"
                      key={range}
                      onClick={() => setFormData({ ...formData, budget: range })}
                      className={`contact-type-btn font-semibold border transition-all ${
                        formData.budget === range
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="contact-form-row">
                <label className="contact-form-label font-bold uppercase">Rincian Barang &amp; Pesanan *</label>
                <textarea 
                  rows="5"
                  required
                  placeholder="Tuliskan daftar barang yang ingin dibeli, spesifikasi, serta jumlah/roll..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-input contact-form-input resize-none leading-relaxed font-mono"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary contact-submit-btn justify-center font-bold shadow-lg"
              >
                <span>{loading ? 'Mengirim Pesanan...' : 'Kirim Pesanan / Minta Penawaran'}</span>
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
