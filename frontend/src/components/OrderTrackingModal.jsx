import React, { useState } from 'react';
import { Search, X, Package, Clock, CheckCircle2, Truck, AlertCircle, Upload, Copy, Send, QrCode } from 'lucide-react';
import { apiService } from '../services/api';

export default function OrderTrackingModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [proofFile, setProofFile] = useState(null);
  const [selectedOrderCode, setSelectedOrderCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const [bankAccounts, setBankAccounts] = useState([]);
  const [qris, setQris] = useState(null);
  const [copiedBank, setCopiedBank] = useState(null);

  React.useEffect(() => {
    Promise.all([
      apiService.getBankAccounts(),
      apiService.getQrisSettings()
    ]).then(([bData, qData]) => {
      setBankAccounts(Array.isArray(bData) ? bData : []);
      if (qData && qData.qris_image_url) {
        setQris(qData);
      }
    });
  }, []);

  const copyBankNumber = (accNumber, bankId) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(bankId);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrders(null);
    setUploadSuccess('');

    const res = await apiService.trackOrder(query.trim());
    setLoading(false);

    if (res && res.success && res.data) {
      setOrders(res.data);
    } else {
      setErrorMsg(res?.message || 'Pesanan tidak ditemukan dengan Kode / No. WA tersebut.');
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile || !selectedOrderCode) return;

    setUploading(true);
    setUploadSuccess('');
    setErrorMsg('');

    const res = await apiService.uploadPaymentProof(selectedOrderCode, proofFile);
    setUploading(false);

    if (res && res.success) {
      setUploadSuccess('Bukti transfer berhasil diunggah! Status telah diperbarui ke Menunggu Verifikasi Admin.');
      // Refresh order list
      const refreshed = await apiService.trackOrder(query.trim());
      if (refreshed && refreshed.success) setOrders(refreshed.data);
    } else {
      setErrorMsg(res?.message || 'Gagal mengunggah bukti transfer.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">Menunggu Pembayaran</span>;
      case 'PAYMENT_UNVERIFIED':
        return <span className="px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">Bukti Terkirim - Verifikasi Admin</span>;
      case 'PAID':
        return <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">Pembayaran Diterima / Lunas</span>;
      case 'PROCESSING':
        return <span className="px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">Pesanan Diproses &amp; Dikemas</span>;
      case 'SHIPPED':
        return <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">Dalam Pengiriman</span>;
      case 'COMPLETED':
        return <span className="px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">Pesanan Selesai</span>;
      case 'CANCELLED':
        return <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">Dibatalkan</span>;
      default:
        return <span className="px-3.5 py-1.5 rounded-full bg-slate-500/20 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] overflow-y-auto p-4 md:p-6 bg-slate-950/90 backdrop-blur-lg flex justify-center items-start animate-in fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="glass-panel w-full max-w-2xl p-6 md:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative my-6 md:my-8 max-h-[90vh] overflow-y-auto custom-scrollbar tracking-modal-panel cursor-default"
      >
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all z-10 cursor-pointer shadow-lg"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-white/10 tracking-modal-header pr-12">
          <h2 className="text-2xl font-extrabold text-white">Cek Status Pesanan &amp; Pembayaran</h2>
          <p className="text-xs text-slate-400 mt-2">Masukkan Kode Pesanan (misal: TLJ-20260825-XXXX) atau Nomor WhatsApp Anda.</p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mb-8 tracking-modal-search-box">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                required
                placeholder="Contoh: TLJ-20260825-8A92 atau 081234567890"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="glass-input w-full text-xs font-mono text-indigo-300 tracking-modal-search-input"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-3 px-6 text-xs font-bold shadow-lg shrink-0 tracking-modal-search-btn">
              {loading ? 'Mencari...' : 'Cek Status'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Orders Result List */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5 tracking-modal-card">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 tracking-modal-card-header">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kode Pesanan</span>
                    <span className="text-xl font-extrabold text-white font-mono">{order.order_code}</span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300 tracking-modal-info-grid">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Nama Pembeli</span>
                    <span className="font-bold text-white text-sm block">{order.customer_name}</span>
                    <span className="font-mono text-indigo-300 text-xs">{order.customer_phone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tanggal Pesanan</span>
                    <span className="font-mono text-xs">{new Date(order.created_at || Date.now()).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Alamat Pengiriman</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5 tracking-modal-address-box">{order.shipping_address}</p>
                  </div>
                </div>

                {/* Bank Accounts Section if PENDING_PAYMENT */}
                {order.status === 'PENDING_PAYMENT' && bankAccounts.length > 0 && (
                  <div className="p-4 rounded-xl bg-indigo-600/15 border border-indigo-500/30 space-y-3">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                      Rekening Bank Pembayaran (Transfer Bank):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {bankAccounts.map((acc) => (
                        <div key={acc.id} className="p-3 rounded-lg bg-slate-900/80 border border-white/10 text-xs flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 inline-block mb-1">
                              {acc.logo_badge || acc.bank_name}
                            </span>
                            <p className="font-mono font-bold text-white text-xs">{acc.account_number}</p>
                            <p className="text-[10px] text-slate-400 truncate">a/n {acc.account_holder}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankNumber(acc.account_number, acc.id)}
                            className="mt-2 text-[10px] font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                          >
                            {copiedBank === acc.id ? (
                              <span className="text-emerald-400">✓ Disalin</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin No. Rek</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QRIS Barcode Box in Tracking Modal if PENDING_PAYMENT */}
                {order.status === 'PENDING_PAYMENT' && qris && qris.qris_image_url && (
                  <div className="p-4 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <QrCode className="w-4 h-4 text-indigo-400" />
                      <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">
                        Bayar via QRIS (Scan QR Code E-Wallet / M-Banking)
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a href={qris.qris_image_url} target="_blank" rel="noreferrer" className="shrink-0 group">
                        <img 
                          src={qris.qris_image_url} 
                          alt="QRIS Toko Listrik Jaya" 
                          className="w-36 h-36 object-contain rounded-xl bg-white p-2 border border-indigo-400/60 shadow-lg group-hover:scale-105 transition-transform"
                        />
                        <span className="text-[10px] font-bold text-indigo-300 group-hover:text-white underline block mt-1">Perbesar QRIS</span>
                      </a>

                      <div className="text-left text-xs space-y-1.5 max-w-xs">
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Scan QR Code menggunakan <strong className="text-white">BCA, Mandiri, GoPay, OVO, DANA, ShopeePay, LinkAja</strong>.
                        </p>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Garansi Bebas Biaya Admin
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="pt-1 tracking-modal-items-box">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      Item Produk ({order.items.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0)} Unit)
                    </span>
                    <div className="space-y-2.5">
                      {order.items.map((item, idx) => {
                        const itemPrice = parseFloat(item.price) || 0;
                        const itemQty = parseInt(item.quantity) || 1;
                        const itemSubtotal = parseFloat(item.subtotal) || (itemPrice * itemQty);

                        return (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs tracking-modal-item-card">
                            <div>
                              <span className="font-bold text-white text-sm block mb-1">{item.product_title}</span>
                              <div className="flex items-center gap-2">
                                {itemPrice > 0 ? (
                                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                                    Rp {Number(itemPrice).toLocaleString('id-ID')} / unit
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-indigo-300 font-mono">Minta Penawaran</span>
                                )}
                                {itemSubtotal > 0 && (
                                  <>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-[11px] font-mono font-bold text-purple-300">
                                      Subtotal: Rp {Number(itemSubtotal).toLocaleString('id-ID')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-purple-300 font-bold bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30 self-start sm:self-center shrink-0">
                              {itemQty} Unit
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Tagihan Transfer Display */}
                    {parseFloat(order.total_amount) > 0 && (
                      <div className="mt-3 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between shadow-lg">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Total Tagihan Transfer:</span>
                        <span className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">
                          Rp {Number(order.total_amount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Proof of payment section */}
                <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 tracking-modal-proof-footer">
                  {order.proof_of_payment_url ? (
                    <div className="flex items-center gap-3.5">
                      <img src={order.proof_of_payment_url} alt="Bukti Transfer" className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md" />
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block">✓ Bukti Transfer Telah Diunggah</span>
                        <a href={order.proof_of_payment_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-300 hover:text-white underline mt-1 inline-block">Perbesar Gambar Bukti</a>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <span className="text-xs font-bold text-amber-300 block mb-2">Belum Ada Bukti Transfer yang Diunggah</span>
                      
                      <form onSubmit={handleUploadProof} className="flex flex-col sm:flex-row items-center gap-3 tracking-modal-upload-form">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            setProofFile(e.target.files?.[0]);
                            setSelectedOrderCode(order.order_code);
                          }}
                          className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer w-full sm:w-auto"
                        />
                        <button
                          type="submit"
                          disabled={uploading || !proofFile}
                          className="btn-primary py-2.5 px-5 text-xs font-bold shrink-0 disabled:opacity-50 shadow-md"
                        >
                          {uploading ? 'Mengunggah...' : 'Upload Bukti Transfer'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* WA Contact Button */}
                  <a
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Toko Listrik Jaya, saya ingin menanyakan pesanan kode: ${order.order_code}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary py-2.5 px-5 text-xs font-bold shrink-0 flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Hubungi CS via WA</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Bottom Close Button */}
        <div className="pt-6 border-t border-white/10 text-center mt-6">
          <button 
            type="button"
            onClick={onClose} 
            className="btn-secondary py-3 px-8 text-xs font-bold cursor-pointer shadow-md"
          >
            Tutup Window
          </button>
        </div>

      </div>
    </div>
  );
}
