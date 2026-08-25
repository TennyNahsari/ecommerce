import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Copy, Upload, Send, X, AlertCircle, Building2, CheckCircle2, PackageCheck, Sparkles, QrCode } from 'lucide-react';
import { apiService } from '../services/api';

export default function OrderModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [bankAccounts, setBankAccounts] = useState([]);
  const [qris, setQris] = useState(null);
  const [copiedBank, setCopiedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [createdOrder, setCreatedOrder] = useState(null);
  const [isMergedOrder, setIsMergedOrder] = useState(false);
  const [mergeMessage, setMergeMessage] = useState('');

  const [proofFile, setProofFile] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofSuccessMsg, setProofSuccessMsg] = useState('');

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    const [bData, qData] = await Promise.all([
      apiService.getBankAccounts(),
      apiService.getQrisSettings()
    ]);
    setBankAccounts(Array.isArray(bData) ? bData : []);
    if (qData && qData.qris_image_url) {
      setQris(qData);
    }
  };

  const copyBankNumber = (accNumber, id) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      setErrorMsg('Harap lengkapi nama, nomor WhatsApp, dan alamat pengiriman.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const itemPrice = parseFloat(product?.price) || 0;
    const itemSubtotal = itemPrice * quantity;

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      shipping_address: shippingAddress,
      notes,
      total_amount: itemSubtotal,
      items: [
        {
          service_id: product?.id,
          product_title: product?.title || 'Produk Peralatan Listrik',
          price: itemPrice,
          quantity
        }
      ]
    };

    const res = await apiService.createOrder(payload);
    setLoading(false);

    if (res && res.success && res.data) {
      setCreatedOrder(res.data);
      if (res.is_merged) {
        setIsMergedOrder(true);
        setMergeMessage(res.message);
      }
    } else {
      setErrorMsg(res?.message || 'Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile || !createdOrder?.order_code) return;

    setUploadingProof(true);
    setProofSuccessMsg('');
    setErrorMsg('');

    const res = await apiService.uploadPaymentProof(createdOrder.order_code, proofFile);
    setUploadingProof(false);

    if (res && res.success) {
      setProofSuccessMsg('Bukti transfer berhasil diunggah! Admin Toko Listrik Jaya akan segera memverifikasi pembayaran Anda.');
    } else {
      setErrorMsg(res?.message || 'Gagal mengunggah bukti transfer.');
    }
  };

  const waConfirmUrl = createdOrder ? `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo Toko Listrik Jaya UMKM, saya ingin konfirmasi pembayaran untuk Kode Pesanan: ${createdOrder.order_code} atas nama ${createdOrder.customer_name}.`
  )}` : '#';

  const productPrice = parseFloat(product?.price) || 0;
  const totalPrice = productPrice * quantity;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-6 bg-slate-950/90 backdrop-blur-lg flex justify-center items-start animate-in fade-in cursor-pointer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-panel order-modal-panel w-full max-w-3xl p-6 md:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative my-6 md:my-8 max-h-[90vh] overflow-y-auto custom-scrollbar cursor-default">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all z-10 cursor-pointer shadow-lg"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdOrder ? (
          /* Step 1: Clean Order Form */
          <div>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10 order-modal-header">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white">Form Pemesanan Produk Listrik</h2>
                <p className="text-xs text-slate-400 mt-1">Toko Listrik Jaya UMKM - Pembayaran Transfer Bank</p>
              </div>
            </div>

            {/* Product Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 order-modal-product-brief">
              <div className="flex items-center gap-4">
                {product?.image_url && (
                  <img src={product.image_url} alt={product.title} className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{product?.title || 'Produk Peralatan Listrik'}</h4>
                  <div className="flex items-center gap-2">
                    {productPrice > 0 ? (
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        Rp {Number(productPrice).toLocaleString('id-ID')} / unit
                      </span>
                    ) : (
                      <span className="text-xs text-indigo-300 font-mono">Minta Penawaran</span>
                    )}
                    {totalPrice > 0 && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs font-bold text-purple-300 font-mono">
                          Subtotal: Rp {Number(totalPrice).toLocaleString('id-ID')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-white/15 self-end sm:self-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Jumlah:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-300 hover:text-white font-bold text-xs px-2 py-0.5 rounded bg-white/5 hover:bg-white/15"
                  >-</button>
                  <span className="w-8 text-center font-mono font-bold text-white text-xs">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-300 hover:text-white font-bold text-xs px-2 py-0.5 rounded bg-white/5 hover:bg-white/15"
                  >+</button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Form */}
            <form onSubmit={handleCreateOrder} className="order-modal-form space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 order-modal-grid">
                <div className="order-modal-field">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 order-modal-label">Nama Lengkap Pembeli *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Budi Santoso"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="glass-input w-full text-xs font-semibold order-modal-input"
                  />
                </div>

                <div className="order-modal-field">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 order-modal-label">No. WhatsApp * (Hanya Angka)</label>
                  <input 
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*" 
                    required
                    placeholder="081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="glass-input w-full text-xs font-mono order-modal-input"
                  />
                </div>
              </div>

              <div className="order-modal-field">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 order-modal-label">Alamat Pengiriman Lengkap *</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Jl. Merdeka No. 12, RT 03/RW 05, Kel. Gambir, Jakarta Pusat"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="glass-input w-full text-xs leading-relaxed resize-none order-modal-input"
                />
              </div>

              {/* Multi-item Ordering Tip Banner */}
              <div className="p-3.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-3">
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                <p className="leading-relaxed">
                  <strong className="text-white font-bold">Tips Pesan Banyak Produk:</strong> Untuk memesan lebih dari 1 produk, gunakan <strong className="text-indigo-300">Nama &amp; No. WA yang sama</strong>. Produk baru akan otomatis digabungkan ke 1 Kode Pesanan Aktif Anda.
                </p>
              </div>

              <div className="pt-2 flex gap-4 order-modal-actions">
                <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3.5 text-xs font-bold order-modal-btn">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3.5 text-xs font-bold shadow-lg order-modal-btn">
                  {loading ? 'Memproses Pesanan...' : 'Buat Pesanan & Dapatkan Kode'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Order Created Success & Payment Options */
          <div className="order-success-container space-y-6">
            <div className="text-center pb-4 border-b border-white/10 order-success-header">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Pesanan Berhasil Dibuat!</h2>
              <p className="text-xs text-slate-300 mt-2">Simpan Kode Pesanan Anda untuk mengecek status pembayaran &amp; pengiriman.</p>
            </div>

            {/* Order Code Banner */}
            <div className="p-5 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-center order-success-code-banner">
              {isMergedOrder && (
                <div className="mb-3 p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-2">
                  <span>✓ {mergeMessage || 'Item produk baru berhasil digabungkan ke Kode Pesanan Aktif Anda!'}</span>
                </div>
              )}
              <span className="text-xs text-indigo-300 font-bold uppercase block mb-2">Kode Pesanan Anda:</span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl font-extrabold font-mono text-white tracking-widest order-success-code-text">{createdOrder.order_code}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdOrder.order_code);
                    alert('Kode pesanan berhasil disalin!');
                  }}
                  className="p-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-300 hover:text-white transition-colors"
                  title="Salin Kode Pesanan"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Items Breakdown & Total Tagihan Transfer */}
            {createdOrder.items && createdOrder.items.length > 0 && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Rincian Produk Pesanan ({createdOrder.items.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0)} Unit):
                </span>
                
                <div className="space-y-2">
                  {createdOrder.items.map((item, idx) => {
                    const itemPrice = parseFloat(item.price) || 0;
                    const itemQty = parseInt(item.quantity) || 1;
                    const itemSub = parseFloat(item.subtotal) || (itemPrice * itemQty);

                    return (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-white text-xs block">{item.product_title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {itemPrice > 0 ? (
                              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                                Rp {Number(itemPrice).toLocaleString('id-ID')} / unit
                              </span>
                            ) : (
                              <span className="text-[11px] text-indigo-300 font-mono">Minta Penawaran</span>
                            )}
                            {itemSub > 0 && (
                              <>
                                <span className="text-slate-500">•</span>
                                <span className="text-[11px] font-mono font-bold text-purple-300">
                                  Subtotal: Rp {Number(itemSub).toLocaleString('id-ID')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-purple-300 font-bold bg-purple-500/20 px-2.5 py-1 rounded-md border border-purple-500/30 self-start sm:self-center shrink-0">
                          {itemQty} Unit
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total Tagihan Transfer Display */}
                {parseFloat(createdOrder.total_amount) > 0 && (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between shadow-lg">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Total Tagihan Transfer:</span>
                    <span className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono">
                      Rp {Number(createdOrder.total_amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* QRIS Scan Section in Step 2 */}
            {qris && qris.qris_image_url && (
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-center space-y-2.5 shadow-lg">
                <div className="flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Bayar via QRIS (Scan QR Code All E-Wallet &amp; M-Banking)
                  </h4>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
                  <a href={qris.qris_image_url} target="_blank" rel="noreferrer" className="shrink-0 group">
                    <img 
                      src={qris.qris_image_url} 
                      alt="Barcode QRIS Toko Listrik Jaya" 
                      className="w-36 h-36 object-contain rounded-2xl bg-white p-2 border-2 border-indigo-400/60 shadow-xl group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] font-bold text-indigo-300 group-hover:text-white underline block mt-1">Perbesar QRIS</span>
                  </a>

                  <div className="text-left text-xs space-y-1.5 max-w-xs">
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Scan QR Code menggunakan aplikasi <strong className="text-white">BCA Mobile, Mandiri Livin', GoPay, OVO, DANA, ShopeePay, LinkAja</strong>, atau M-Banking pilihan Anda.
                    </p>
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Bebas Biaya Admin / Standar QRIS SNI
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Accounts Section (Moved to Step 2) */}
            <div className="order-modal-bank-section p-5 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 order-modal-bank-title">
                Rekening Bank Pembayaran (Silakan Transfer Ke Rekening Berikut):
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 order-modal-bank-grid">
                {bankAccounts.map((acc) => (
                  <div key={acc.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs flex flex-col justify-between order-modal-bank-card">
                    <div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 inline-block mb-1.5">
                        {acc.logo_badge || acc.bank_name}
                      </span>
                      <p className="font-mono font-bold text-white text-xs tracking-wider my-1">{acc.account_number}</p>
                      <p className="text-[11px] text-slate-400 truncate">a/n {acc.account_holder}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyBankNumber(acc.account_number, acc.id)}
                      className="mt-3 text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1.5"
                    >
                      {copiedBank === acc.id ? (
                        <span className="text-emerald-400">✓ Disalin</span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {proofSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <PackageCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{proofSuccessMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Option A & B Payment Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 order-success-options-grid">
              
              {/* Option A: Upload Bukti Transfer */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 order-success-option-card">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2 order-success-option-title">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Opsi 1: Upload Bukti Transfer</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed order-success-option-desc">Unggah foto struk/screenshot transfer Anda agar admin langsung memverifikasi.</p>
                </div>
                
                <form onSubmit={handleUploadProof} className="space-y-3 mt-auto">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0])}
                    className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer w-full"
                  />
                  <button
                    type="submit"
                    disabled={uploadingProof || !proofFile}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-md"
                  >
                    {uploadingProof ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                  </button>
                </form>
              </div>

              {/* Option B: Konfirmasi via WA */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between order-success-option-card">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2 order-success-option-title">
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Opsi 2: Konfirmasi via WA</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed order-success-option-desc">Kirim pesan WhatsApp langsung ke customer service Toko Listrik Jaya.</p>
                </div>

                <a
                  href={waConfirmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg mt-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>Konfirmasi Pembayaran via WA</span>
                </a>
              </div>

            </div>

            <div className="pt-4 text-center order-success-close-box">
              <button onClick={onClose} className="btn-secondary py-3 px-8 text-xs font-bold order-success-close-btn">
                Tutup Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
