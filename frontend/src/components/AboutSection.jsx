import React from 'react';
import { Target, Eye, Globe, Shield, Award, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const teamMembers = [
    {
      name: 'Hadi Suryanto',
      role: 'Pendiri & Pemilik UMKM',
      bio: 'Pengalaman 15+ tahun dalam penyediaan komponen & peralatan listrik terpercaya untuk kebutuhan perumahan dan proyek.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'
    },
    {
      name: 'Rina Wijaya',
      role: 'Kepala Layanan Pelanggan & Pemesanan',
      bio: 'Siap membantu konsultasi spesifikasi peralatan listrik, penawaran harga grosir, dan respon cepat pemesanan.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'
    },
    {
      name: 'Budi Santoso',
      role: 'Teknisi & Penanggung Jawab Kualitas',
      bio: 'Memastikan setiap unit kabel, sakelar, stop kontak, dan MCB yang dikirim telah lulus pengujian standar mutu SNI.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400'
    }
  ];

  const coreValues = [
    { icon: Shield, title: 'Produk 100% Original & SNI', desc: 'Seluruh kabel, sakelar, stop kontak, dan komponen listrik terjamin standar keamanan SNI.' },
    { icon: Award, title: 'Harga Grosir & Eceran Berkualitas', desc: 'Memberikan penawaran harga terbaik yang terjangkau untuk kebutuhan rumah tangga maupun proyek UMKM.' },
    { icon: CheckCircle, title: 'Garansi & Pengiriman Cepat', desc: 'Jaminan garansi toko resmi serta pengiriman barang aman, tepat waktu, dan terkemas rapi.' }
  ];

  return (
    <section id="about" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 md:mb-16 w-full">
          <div>
            <div className="badge-glow mb-4">Tentang Toko Listrik Jaya UMKM</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Mitra Peralatan Listrik <span className="gradient-text-accent">Terpercaya</span> & Berkualitas
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
              Toko Listrik Jaya UMKM berdiri sebagai pusat grosir dan eceran peralatan listrik berkualitas tinggi. Kami menyediakan solusi lengkap mulai dari kabel tembaga murni, stop kontak tahan panas, sakelar modern, lampu LED hemat energi, hingga pengaman listrik MCB berstandar SNI.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              Kami berkomitmen melayani kebutuhan masyarakat, instalatur listrik, kontraktor bangunan, serta para pelaku usaha UMKM dengan produk aman, awet, dan harga bersahabat.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-indigo-400">100%</span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Berstandar SNI</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-purple-400">5.000+</span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Pelanggan Puas</span>
              </div>
            </div>
          </div>

          <div className="relative w-full">
            <div className="glass-panel p-2 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden w-full">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000" 
                alt="Peralatan Listrik UMKM" 
                className="w-full h-[420px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Misi Kami</p>
                <p className="text-xs text-slate-300">Menyediakan peralatan listrik berkualitas, aman, dan hemat energi secara merata untuk mendukung instalasi rumah tangga dan kemajuan UMKM di Indonesia.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="about-core-values-gap border-y border-white/10 w-full flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-14 flex flex-col items-center">
            <div className="badge-glow mb-4 mx-auto">Keunggulan Kami</div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center">Komitmen Kualitas UMKM</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {coreValues.map((val, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <val.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{val.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tim Pengelola */}
        <div className="about-leadership-gap w-full flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-14 flex flex-col items-center">
            <div className="badge-glow mb-4 mx-auto">Pengelola Toko</div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center">Tim Profesional Kami</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl text-center group">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-2 border-indigo-500/40 group-hover:scale-105 transition-transform"
                />
                <h4 className="text-lg font-bold text-white">{member.name}</h4>
                <span className="text-xs font-semibold text-indigo-400 block mb-3">{member.role}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
