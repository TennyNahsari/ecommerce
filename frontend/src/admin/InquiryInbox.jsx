import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Building2, Calendar, ShoppingCart, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const data = await apiService.getInquiries();
      const safeData = Array.isArray(data) ? data : [];
      setInquiries(safeData);
      if (safeData.length > 0) setSelectedInquiry(safeData[0]);
    } catch (e) {
      setInquiries([]);
    }
  };

  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  return (
    <div className="space-y-10 cms-page-container">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl font-extrabold text-white">Pesanan &amp; Pertanyaan Pelanggan</h1>
        <p className="text-xs text-slate-400 mt-2">Kelola Pesanan Grosir, Permintaan Penawaran Harga, dan Kontak Pelanggan Toko Listrik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Inbox List */}
        <div className="lg:col-span-5 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Pesan Masuk ({safeInquiries.length})</h3>

          <div className="space-y-3">
            {safeInquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className={`p-4.5 rounded-xl cursor-pointer border transition-all ${
                  selectedInquiry?.id === inq.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold truncate">{inq.name}</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 shrink-0">
                    {inq.budget || 'Inquiry'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-1.5">{inq.company || inq.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Lead Detail View */}
        <div className="lg:col-span-7 glass-panel cms-form-card rounded-2xl border border-white/10 space-y-6">
          {selectedInquiry ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedInquiry.name}</h2>
                  <span className="text-xs text-indigo-400 flex items-center gap-1.5 mt-1 font-mono">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedInquiry.email}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Status: {selectedInquiry.status || 'NEW'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Perusahaan / Toko</span>
                  <span className="font-bold text-white">{selectedInquiry.company || 'Pelanggan Umum'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tipe Pembelian</span>
                  <span className="font-bold text-indigo-300">{selectedInquiry.budget || 'Eceran / Grosir'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Produk Diminta</span>
                  <span className="font-bold text-purple-300">{selectedInquiry.service_interest || 'Peralatan Listrik'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tanggal Masuk</span>
                  <span className="font-bold text-slate-300">{new Date(selectedInquiry.created_at || Date.now()).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Pesan &amp; Detail Permintaan</h4>
                <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <a 
                  href={`mailto:${selectedInquiry.email}?subject=RE: Penawaran Harga Toko Listrik Jaya UMKM`}
                  className="btn-primary py-3 px-6 text-xs font-bold"
                >
                  Balas via Email &rarr;
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs">
              Pilih pesan dari daftar di sebelah kiri untuk membaca detail pesanan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
