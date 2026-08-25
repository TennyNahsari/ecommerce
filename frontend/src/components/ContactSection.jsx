import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { apiService } from '../services/api';

export default function ContactSection() {
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
      setResponseMsg({ type: 'success', text: 'Pesan / Permintaan Penawaran Anda berhasil terkirim. Tim kami akan segera menghubungi Anda!' });
      setFormData({ name: '', email: '', company: '', budget: 'Eceran (Rumah Tangga)', service_interest: 'Kabel & Instalasi Listrik', message: '' });
    } else {
      setResponseMsg({ type: 'error', text: res.message || 'Terjadi kesalahan saat mengirim pesanan.' });
    }
  };

  return (
    <section id="contact" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="badge-glow mb-4">Pemesanan & Konsultasi</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Hubungi Toko <span className="gradient-text-accent">Listrik Jaya</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Siap melayani kebutuhan grosir, eceran, maupun penawaran harga khusus untuk proyek listrik rumah dan usaha Anda.
              </p>
            </div>

            {/* HQ Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Alamat Toko & Gudang</h4>
                  <p className="text-xs text-slate-300">Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Email Penawaran & Pemesanan</h4>
                  <p className="text-xs text-slate-300">sales@tokolistrikjaya.com | info@tokolistrikjaya.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">WhatsApp & Telepon Fast Response</h4>
                  <p className="text-xs text-slate-300">+62 812-3456-7890 (Senin - Sabtu: 08.00 - 17.00 WIB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-3xl border border-indigo-500/20 shadow-2xl relative w-full">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span>Formulir Pesanan & Tanya Harga</span>
            </h3>

            {responseMsg && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-xs font-semibold ${
                responseMsg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{responseMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Budi Prasetyo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Alamat Email / No. WA *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="budi@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Nama Usaha / Kota</label>
                  <input 
                    type="text" 
                    placeholder="Toko Listrik Sejahtera / Jakarta"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Kategori Produk Diminati</label>
                  <select 
                    value={formData.service_interest}
                    onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                    className="glass-input w-full bg-slate-900 text-slate-200"
                  >
                    <option value="Kabel & Instalasi Listrik">Kabel & Instalasi Listrik</option>
                    <option value="Stop Kontak, Sakelar & Steker">Stop Kontak, Sakelar & Steker</option>
                    <option value="Lampu & Penghemat Energi">Lampu & Penghemat Energi</option>
                    <option value="Komponen & Pengaman Listrik">Komponen & Pengaman Listrik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Jenis Pembelian</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Eceran (Rumah Tangga)', 'Grosir / Reseller', 'Instalasi Gedung/Proyek', 'Lainnya'].map((range) => (
                    <button
                      type="button"
                      key={range}
                      onClick={() => setFormData({ ...formData, budget: range })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        formData.budget === range
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Rincian Barang & Pesanan *</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Tuliskan daftar barang yang ingin dibeli, spesifikasi, serta jumlah/roll..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-input w-full resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-4 text-sm font-bold"
              >
                {loading ? 'Mengirim Pesanan...' : 'Kirim Pesanan / Minta Penawaran'}
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
