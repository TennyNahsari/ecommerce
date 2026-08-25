import React, { useState, useEffect } from 'react';
import { Image, Upload, Copy, Check, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await apiService.getMedia();
      setMediaItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setMediaItems([]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg('');
    setErrorMsg('');

    try {
      const res = await apiService.uploadMedia(file);
      setUploading(false);
      if (res && res.success) {
        setMsg(`File foto "${file.name}" berhasil diunggah!`);
        loadMedia();
      } else {
        setErrorMsg(res?.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      setUploading(false);
      setErrorMsg('Terjadi kesalahan saat mengunggah file media.');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus media ini dari server?')) return;
    setMsg('');
    setErrorMsg('');

    await apiService.deleteMedia(id);
    setMsg('Asset media berhasil dihapus!');
    loadMedia();
  };

  const copyToClipboard = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const safeMedia = Array.isArray(mediaItems) ? mediaItems : [];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(safeMedia.length / itemsPerPage) || 1;
  const paginatedMedia = safeMedia.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-10 cms-page-container">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Media Assets &amp; File Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola Foto Produk, Bukti Pembayaran, dan Media Banner Toko Listrik Jaya</p>
        </div>

        <label className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Mengunggah...' : 'Upload Media Baru'}</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-3 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-3 border border-rose-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid of Media Assets */}
      {safeMedia.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedMedia.map((item) => (
              <div key={item.id || item.filename} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between group shadow-lg relative">
                
                <div className="h-44 rounded-xl overflow-hidden mb-4 bg-slate-900 flex items-center justify-center relative border border-white/10">
                  <img 
                    src={item.url || item.filepath} 
                    alt={item.filename} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Image className="w-10 h-10 text-slate-600 absolute" />

                  {item.id && (
                    <button 
                      onClick={() => handleDeleteMedia(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors border border-white/10"
                      title="Hapus Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white truncate mb-1" title={item.filename}>{item.filename}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mb-4">{item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Media File'}</p>
                </div>

                <button
                  onClick={() => copyToClipboard(item.url || item.filepath, item.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    copiedId === item.id 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>URL Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link URL Foto</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          {safeMedia.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs">
              <span className="text-slate-400 font-medium">
                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, safeMedia.length)} dari {safeMedia.length} Media File
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 disabled:opacity-40 font-bold text-slate-300 transition-colors"
                >
                  &larr; Sebelumnya
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
                  Selanjutnya &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-white/10">
          <Image className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Belum Ada File Media</h3>
          <p className="text-xs text-slate-400 mb-6">Klik tombol "Upload Media Baru" di atas untuk mengunggah foto produk atau banner.</p>
        </div>
      )}
    </div>
  );
}
