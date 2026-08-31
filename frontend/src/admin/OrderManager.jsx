import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle, Eye, RefreshCw, Building2, Save, Plus, Trash2, X, ExternalLink, Search, QrCode, Upload, Clock } from 'lucide-react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const formatDeadlineText = (deadline, createdAt, lang = 'id') => {
  let dateObj = null;
  if (deadline) {
    dateObj = new Date(deadline);
  } else if (createdAt) {
    dateObj = new Date(new Date(createdAt).getTime() + 60 * 60 * 1000);
  }
  if (!dateObj || isNaN(dateObj.getTime())) return '-';

  if (lang === 'en') {
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  return dateObj.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';
};

export default function OrderManager() {
  const { lang, setLang, t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders' | 'bank_accounts'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Proof Modal
  const [selectedProofUrl, setSelectedProofUrl] = useState(null);

  // Bank Accounts Settings State
  const [bankAccounts, setBankAccounts] = useState([]);
  const [savingBanks, setSavingBanks] = useState(false);

  // QRIS Settings State
  const [qrisSettings, setQrisSettings] = useState({ qris_name: 'QRIS Toko Listrik Jaya UMKM', qris_image_url: null });
  const [uploadingQris, setUploadingQris] = useState(false);
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisNameInput, setQrisNameInput] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const filteredOrders = safeOrders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const cleanQPhone = q.replace(/\D/g, '');

    const matchCode = ord.order_code ? ord.order_code.toLowerCase().includes(q) : false;
    const matchName = ord.customer_name ? ord.customer_name.toLowerCase().includes(q) : false;
    
    // Only perform digit-based phone matching if query contains at least 3 digits
    const matchPhone = cleanQPhone.length >= 3 
      ? (ord.customer_phone ? ord.customer_phone.replace(/\D/g, '').includes(cleanQPhone) : false)
      : (ord.customer_phone ? ord.customer_phone.toLowerCase().includes(q) : false);

    const matchAddress = ord.shipping_address ? ord.shipping_address.toLowerCase().includes(q) : false;
    const matchItems = Array.isArray(ord.items) && ord.items.some(i => i.product_title && i.product_title.toLowerCase().includes(q));

    return matchCode || matchName || matchPhone || matchAddress || matchItems;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadOrders();
    loadBankAccounts();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    const data = await apiService.getOrders(statusFilter);
    setLoadingOrders(false);
    setOrders(Array.isArray(data) ? data : []);
  };

  const loadBankAccounts = async () => {
    const [bData, qData] = await Promise.all([
      apiService.getBankAccounts(),
      apiService.getQrisSettings()
    ]);
    setBankAccounts(Array.isArray(bData) ? bData : []);
    if (qData) {
      setQrisSettings(qData);
      setQrisNameInput(qData.qris_name || 'QRIS Toko Listrik Jaya UMKM');
    }
  };

  const handleSaveQris = async (e) => {
    if (e) e.preventDefault();
    if (!qrisFile && !qrisNameInput) return;

    setUploadingQris(true);
    setMsg('');
    setErrorMsg('');

    const res = await apiService.uploadQrisImage(qrisFile, qrisNameInput);
    setUploadingQris(false);

    if (res && res.success) {
      setMsg(res.message || 'Gambar barcode QRIS berhasil diperbarui!');
      setQrisSettings(res.data);
      setQrisFile(null);
    } else {
      setErrorMsg(res?.message || 'Gagal menyimpan gambar QRIS.');
    }
  };

  const handleDeleteQris = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar QRIS ini secara permanen dari server? File gambar lama akan dihapus.')) return;

    setMsg('');
    setErrorMsg('');
    const res = await apiService.deleteQrisImage();
    if (res && res.success) {
      setMsg('Gambar barcode QRIS berhasil dihapus dari server!');
      setQrisSettings(res.data || { qris_name: 'QRIS Toko Listrik Jaya UMKM', qris_image_url: null });
      setQrisFile(null);
    } else {
      setErrorMsg(res?.message || 'Gagal menghapus gambar QRIS.');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setMsg('');
    setErrorMsg('');
    const res = await apiService.updateOrderStatus(orderId, newStatus);
    if (res && res.success) {
      setMsg(`Status pesanan ID #${orderId} berhasil diubah ke "${newStatus}".`);
      loadOrders();
    } else {
      setErrorMsg(res?.message || 'Gagal mengubah status pesanan.');
    }
  };

  const handleDeleteOrder = async (orderId, orderCode) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pesanan dengan kode "${orderCode}" secara permanen?`)) return;

    setMsg('');
    setErrorMsg('');
    const res = await apiService.deleteOrder(orderId);
    if (res && res.success) {
      setMsg(`Pesanan dengan kode "${orderCode}" berhasil dihapus!`);
      loadOrders();
    } else {
      setErrorMsg(res?.message || 'Gagal menghapus pesanan.');
    }
  };

  const handleDeleteProof = async (orderId, orderCode) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus gambar bukti transfer untuk pesanan "${orderCode}"?`)) return;

    setMsg('');
    setErrorMsg('');
    const res = await apiService.deleteOrderProof(orderId);
    if (res && res.success) {
      setMsg(`Gambar bukti transfer untuk pesanan "${orderCode}" berhasil dihapus!`);
      if (selectedProofUrl) setSelectedProofUrl(null);
      loadOrders();
    } else {
      setErrorMsg(res?.message || 'Gagal menghapus bukti pembayaran.');
    }
  };

  const handleSaveBankAccounts = async () => {
    setSavingBanks(true);
    setMsg('');
    setErrorMsg('');

    const res = await apiService.saveBankAccounts(bankAccounts);
    setSavingBanks(false);

    if (res && (res.success || res.data)) {
      setMsg('Pengaturan nomor rekening bank berhasil disimpan ke PostgreSQL!');
    } else {
      setErrorMsg('Gagal menyimpan pengaturan rekening bank.');
    }
  };

  const handleAddBankRow = () => {
    const newAcc = {
      id: Date.now(),
      bank_name: 'Bank Baru',
      account_number: '000-000-0000',
      account_holder: 'Toko Listrik Jaya UMKM',
      logo_badge: 'BANK'
    };
    setBankAccounts([...bankAccounts, newAcc]);
  };

  const handleDeleteBankRow = (id) => {
    setBankAccounts(bankAccounts.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-10 cms-page-container">
      
      {/* Header & SubTab Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10 cms-orders-header">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Kelola Pesanan &amp; Rekening E-Commerce</h1>
          <p className="text-xs text-slate-400 mt-2">Kelola Pesanan Masuk, Verifikasi Bukti Transfer, Status Pengiriman, &amp; Rekening Bank Toko</p>
        </div>

        <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 cms-orders-subtab-box">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all cms-orders-subtab-btn ${
              activeSubTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daftar Pesanan ({safeOrders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('bank_accounts')}
            className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all cms-orders-subtab-btn ${
              activeSubTab === 'bank_accounts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pengaturan Rekening Bank
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-3 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-3 border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {activeSubTab === 'orders' ? (
        /* Orders List SubTab */
        <div className="space-y-6">
          
          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Kode Booking (TLJ-...), Nama Pembeli, atau No. WA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-11 pr-10 py-3 text-xs w-full rounded-2xl border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  title="Hapus Kata Kunci"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-end">
              {searchQuery && (
                <span className="text-xs font-semibold text-indigo-300">
                  {lang === 'en' ? `Found ${filteredOrders.length} matching orders` : `Ditemukan ${filteredOrders.length} pesanan cocok`}
                </span>
              )}

              <button
                type="button"
                onClick={async () => {
                  setMsg('');
                  setErrorMsg('');
                  await loadOrders();
                  setMsg(lang === 'en' 
                    ? 'Order data refreshed. Expired orders automatically cancelled & proof of payment loaded.' 
                    : 'Data pesanan diperbarui. Pesanan kedaluwarsa otomatis dibatalkan & bukti transfer yang ada akan tampil.');
                }}
                disabled={loadingOrders}
                className="btn-primary py-2.5 sm:py-3 px-4 sm:px-5 text-xs font-bold flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
                title={lang === 'en' ? 'Refresh orders & check payment deadlines' : 'Refresh pesanan & cek status bayar paling lambat'}
              >
                <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>{loadingOrders ? (lang === 'en' ? 'Refreshing...' : 'Memperbarui...') : (lang === 'en' ? 'Refresh Orders' : 'Refresh Pesanan')}</span>
              </button>
            </div>
          </div>
          
          {/* Status Filter Badges */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 cms-orders-filter-row">
            {[
              { label: lang === 'en' ? 'All Status' : 'Semua Status', value: 'ALL' },
              { label: lang === 'en' ? 'Pending Payment' : 'Menunggu Pembayaran', value: 'PENDING_PAYMENT' },
              { label: lang === 'en' ? 'Proof Uploaded' : 'Bukti Transfer Diunggah', value: 'PAYMENT_UNVERIFIED' },
              { label: lang === 'en' ? 'Paid' : 'Pembayaran Lunas', value: 'PAID' },
              { label: lang === 'en' ? 'Processing' : 'Diproses', value: 'PROCESSING' },
              { label: lang === 'en' ? 'Shipped' : 'Dalam Pengiriman', value: 'SHIPPED' },
              { label: lang === 'en' ? 'Completed' : 'Selesai', value: 'COMPLETED' },
              { label: lang === 'en' ? 'Cancelled' : 'Dibatalkan', value: 'CANCELLED' }
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cms-orders-filter-badge ${
                  statusFilter === st.value
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Orders Table Cards */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-8">
              {paginatedOrders.map((ord) => (
                <div key={ord.id} className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl cms-order-card">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-white/10 pb-5 cms-order-card-header">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 cms-order-code-title">
                        {lang === 'en' ? 'Order Code' : 'Kode Pesanan'}
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl md:text-2xl font-extrabold text-white font-mono cms-order-code-text">{ord.order_code}</span>
                        <span className="text-xs text-slate-400 font-mono cms-order-code-date">
                          {new Date(ord.created_at || Date.now()).toLocaleString(lang === 'en' ? 'en-US' : 'id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Status Select Dropdown & Delete Order Button */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase">{lang === 'en' ? 'Status:' : 'Ubah Status:'}</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="glass-input text-xs font-bold bg-slate-900 text-white rounded-xl px-4 py-2.5 border border-indigo-500/40 focus:outline-none shadow-md"
                      >
                        <option value="PENDING_PAYMENT">⏳ PENDING_PAYMENT</option>
                        <option value="PAYMENT_UNVERIFIED">🔍 PAYMENT_UNVERIFIED</option>
                        <option value="PAID">✅ PAID</option>
                        <option value="PROCESSING">📦 PROCESSING</option>
                        <option value="SHIPPED">🚚 SHIPPED</option>
                        <option value="COMPLETED">🎉 COMPLETED</option>
                        <option value="CANCELLED">❌ CANCELLED</option>
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(ord.id, ord.order_code)}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-md"
                        title={lang === 'en' ? 'Delete order' : 'Hapus Pesanan Ini'}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{lang === 'en' ? 'Delete' : 'Hapus'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 cms-order-info-grid">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                        {lang === 'en' ? 'Buyer Details' : 'Data Pembeli'}
                      </span>
                      <p className="font-bold text-white text-sm mb-1">{ord.customer_name}</p>
                      <p className="font-mono text-indigo-300 font-bold mb-0.5">{ord.customer_phone}</p>
                      {ord.customer_email && <p className="text-xs text-slate-400 mb-1">{ord.customer_email}</p>}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                        <span className="text-[10px] font-bold uppercase flex items-center gap-1 mb-0.5 text-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{lang === 'en' ? 'Payment Deadline' : 'Bayar Paling Telat'}</span>
                        </span>
                        <span className="font-mono text-xs font-bold block break-words">
                          {formatDeadlineText(ord.payment_deadline, ord.created_at, lang)}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Alamat Pengiriman &amp; Catatan</span>
                      <p className="bg-slate-900/70 p-4 rounded-2xl border border-white/10 leading-relaxed text-slate-200 cms-order-address-box">{ord.shipping_address}</p>
                      {ord.notes && <p className="text-xs text-slate-400 mt-2 italic">Catatan: {ord.notes}</p>}
                    </div>
                  </div>

                  {/* Items list & Total Amount Summary */}
                  {ord.items && ord.items.length > 0 && (
                    <div className="pt-2 cms-order-items-box space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Item Produk Pesanan ({ord.items.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0)} Unit)
                        </span>
                        {parseFloat(ord.total_amount) > 0 && (
                          <span className="text-sm font-extrabold text-emerald-400 font-mono">
                            Total: Rp {Number(ord.total_amount).toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ord.items.map((item, idx) => {
                          const itemPrice = parseFloat(item.price) || 0;
                          const itemQty = parseInt(item.quantity) || 1;
                          const itemSub = parseFloat(item.subtotal) || (itemPrice * itemQty);

                          return (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between text-xs cms-order-item-card">
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
                              <span className="font-mono text-purple-300 font-bold text-xs bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30 shrink-0">
                                {itemQty} Unit
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total Tagihan Bar */}
                      {parseFloat(ord.total_amount) > 0 && (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Tagihan Pesanan:</span>
                          <span className="text-base font-extrabold text-emerald-400 font-mono">
                            Rp {Number(ord.total_amount).toLocaleString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Proof of Payment Thumbnail */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between cms-order-footer">
                    {ord.proof_of_payment_url ? (
                      <div className="flex items-center gap-4">
                        <img 
                          src={ord.proof_of_payment_url} 
                          alt="Bukti Transfer" 
                          className="w-16 h-16 rounded-2xl object-cover border border-white/20 cursor-pointer hover:scale-105 transition-transform shadow-md"
                          onClick={() => setSelectedProofUrl({ url: ord.proof_of_payment_url, id: ord.id, code: ord.order_code })}
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-400 block">✓ Bukti Transfer Tersedia</span>
                          <div className="flex items-center gap-3 mt-1">
                            <button
                              onClick={() => setSelectedProofUrl({ url: ord.proof_of_payment_url, id: ord.id, code: ord.order_code })}
                              className="text-xs font-bold text-indigo-300 hover:text-white underline flex items-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Perbesar</span>
                            </button>
                            <span className="text-slate-600 text-xs">•</span>
                            <button
                              onClick={() => handleDeleteProof(ord.id, ord.order_code)}
                              className="text-xs font-bold text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Bukti</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Belum ada bukti transfer yang diunggah pembeli.</span>
                    )}

                    <a 
                      href={`https://wa.me/${ord.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${ord.customer_name}, mengenai pesanan Toko Listrik Jaya dengan kode ${ord.order_code}...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center gap-2 shadow-md"
                    >
                      <span>Hubungi Pembeli via WA &rarr;</span>
                    </a>
                  </div>

                </div>
              ))}

              {/* Pagination Bar */}
              {filteredOrders.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs">
                  <span className="text-slate-400 font-medium">
                    {lang === 'en' 
                      ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} Orders`
                      : `Menampilkan ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} dari ${filteredOrders.length} Pesanan`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-40 font-bold text-slate-300 transition-colors"
                    >
                      &larr; {lang === 'en' ? 'Previous' : 'Sebelumnya'}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`w-9 h-9 rounded-xl font-bold transition-all border ${
                          currentPage === pg
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-40 font-bold text-slate-300 transition-colors"
                    >
                      {lang === 'en' ? 'Next' : 'Berikutnya'} &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center border border-white/10">
              <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Belum Ada Pesanan Masuk</h3>
              <p className="text-xs text-slate-400">Pesanan dari pembeli akan muncul secara otomatis di halaman ini.</p>
            </div>
          )}
        </div>
      ) : (
        /* Bank Accounts Settings SubTab */
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Kelola Nomor Rekening Bank Toko</h3>
              <p className="text-xs text-slate-400 mt-1">Nomor rekening ini akan tampil otomatis pada form checkout pembeli.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddBankRow} className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Tambah Bank</span>
              </button>

              <button onClick={handleSaveBankAccounts} disabled={savingBanks} className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg">
                <Save className="w-4 h-4 mr-1.5" />
                <span>{savingBanks ? 'Menyimpan...' : 'Simpan Rekening'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {bankAccounts.map((acc, index) => (
              <div key={acc.id || index} className="p-5 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Bank / Label Badge</label>
                  <input 
                    type="text" 
                    value={acc.bank_name || ''}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[index].bank_name = e.target.value;
                      updated[index].logo_badge = e.target.value.replace(/Bank\s+/i, '');
                      setBankAccounts(updated);
                    }}
                    className="glass-input w-full text-xs font-bold"
                    placeholder="e.g. Bank BCA"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nomor Rekening</label>
                  <input 
                    type="text" 
                    value={acc.account_number || ''}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[index].account_number = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="glass-input w-full text-xs font-mono font-bold text-indigo-300"
                    placeholder="e.g. 123-456-7890"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Pemilik Rekening (a/n)</label>
                  <input 
                    type="text" 
                    value={acc.account_holder || ''}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[index].account_holder = e.target.value;
                      setBankAccounts(updated);
                    }}
                    className="glass-input w-full text-xs font-semibold"
                    placeholder="e.g. Toko Listrik Jaya UMKM"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button 
                    onClick={() => handleDeleteBankRow(acc.id)}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* QRIS Payment Settings Section */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span>Pengaturan QRIS Pembayaran (Scan QR Code)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Unggah atau perbarui gambar Barcode QRIS Toko Listrik Jaya. QRIS ini akan otomatis tampil di layar Kode Booking dan Cek Status Pesanan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* QRIS Barcode Preview Column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                {qrisSettings.qris_image_url ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <img 
                      src={qrisSettings.qris_image_url} 
                      alt="Barcode QRIS Toko" 
                      className="w-48 h-48 object-contain rounded-xl bg-white p-2 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedProofUrl(qrisSettings.qris_image_url)}
                    />
                    <div className="text-center">
                      <span className="text-xs font-bold text-emerald-400 block">✓ Barcode QRIS Aktif</span>
                      <span className="text-[11px] text-slate-400 truncate block mt-0.5">{qrisSettings.qris_name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-2 text-slate-500">
                    <QrCode className="w-16 h-16 mx-auto stroke-1" />
                    <p className="text-xs font-semibold">Belum Ada Barcode QRIS</p>
                    <p className="text-[10px] text-slate-400">Unggah foto/gambar QRIS toko Anda di samping.</p>
                  </div>
                )}
              </div>

              {/* Upload & Form Controls Column */}
              <form onSubmit={handleSaveQris} className="md:col-span-8 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Nama / Label QRIS</label>
                  <input
                    type="text"
                    value={qrisNameInput}
                    onChange={(e) => setQrisNameInput(e.target.value)}
                    className="glass-input w-full text-xs font-bold"
                    placeholder="e.g. QRIS Toko Listrik Jaya (Gopay, OVO, DANA, BCA, Mandiri)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {qrisSettings.qris_image_url ? 'Ganti / Update File Gambar QRIS (JPG/PNG)' : 'Upload File Gambar QRIS (JPG/PNG)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setQrisFile(e.target.files?.[0])}
                    className="text-xs text-slate-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer w-full"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                    * Berkas gambar QRIS lama akan otomatis dihapus dari server saat Anda memperbarui atau menghapus gambar QRIS.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploadingQris || (!qrisFile && !qrisNameInput)}
                    className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingQris ? 'Menyimpan QRIS...' : (qrisSettings.qris_image_url ? 'Update Barcode QRIS' : 'Upload & Simpan QRIS')}</span>
                  </button>

                  {qrisSettings.qris_image_url && (
                    <button
                      type="button"
                      onClick={handleDeleteQris}
                      className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors text-xs font-bold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Hapus Gambar QRIS</span>
                    </button>
                  )}
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Proof Preview Modal Overlay */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-xl w-full relative">
            <button 
              onClick={() => setSelectedProofUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white mb-4">Bukti Pembayaran / Transfer Pembeli</h3>
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center max-h-[70vh]">
              <img 
                src={typeof selectedProofUrl === 'object' ? selectedProofUrl.url : selectedProofUrl} 
                alt="Bukti Transfer Perbesar" 
                className="max-w-full max-h-[70vh] object-contain" 
              />
            </div>

            <div className="pt-4 flex flex-wrap justify-between items-center gap-3">
              <a 
                href={typeof selectedProofUrl === 'object' ? selectedProofUrl.url : selectedProofUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-indigo-300 hover:underline font-bold flex items-center gap-1"
              >
                <span>Buka Gambar di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-3">
                {typeof selectedProofUrl === 'object' && selectedProofUrl.id && (
                  <button 
                    onClick={() => handleDeleteProof(selectedProofUrl.id, selectedProofUrl.code)} 
                    className="py-2 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Gambar Bukti Ini</span>
                  </button>
                )}

                <button onClick={() => setSelectedProofUrl(null)} className="btn-secondary py-2 px-5 text-xs font-bold">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
