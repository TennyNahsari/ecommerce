import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    // Header & Navigation
    nav_home: 'Beranda',
    nav_catalog: 'Katalog Produk',
    nav_about: 'Tentang Kami',
    nav_blog: 'Artikel & Tips',
    nav_contact: 'Kontak & Pemesanan',
    btn_check_order: 'Cek Status Pesanan',
    sub_brand: 'Peralatan Listrik UMKM',

    // Hero Slider
    hero_badge_1: 'PROMO SPESIAL UMKM',
    hero_title_1: 'Pusat Peralatan Listrik UMKM Terlengkap',
    hero_sub_1: 'Solusi kebutuhan kabel, stop kontak, sakelar, lampu LED, dan pengaman listrik berkualitas SNI dengan harga grosir & eceran.',
    hero_cta_1: 'Lihat Katalog Produk',

    hero_badge_2: 'HEMAT ENERGI 85%',
    hero_title_2: 'Lampu LED Hemat Energi Garansi Resmi',
    hero_sub_2: 'Hemat penggunaan listrik hingga 85% untuk rumah dan toko Anda. Tersedia berbagai ukuran Watt dan garansi resmi hingga 1 tahun.',
    hero_cta_2: 'Jelajahi Produk Lampu',

    // Services / Products Section
    section_services_badge: 'KATALOG PRODUK LENGKAP',
    section_services_title: 'Peralatan Listrik Berkualitas Standar SNI',
    section_services_desc: 'Temukan berbagai perlengkapan instalasi listrik terbaik dengan jaminan garansi toko & pengiriman cepat.',
    filter_all: 'Semua Kategori',
    unit_price: 'unit',
    ask_offer: 'Minta Penawaran',
    subtotal_label: 'Subtotal:',
    btn_buy_now: 'Pesan Sekarang',
    btn_view_details: 'Detail Produk',
    btn_view_all_products: 'Lihat Semua Produk Katalog',

    // About Section
    about_badge: 'TENTANG TOKO LISTRIK JAYA',
    about_title: 'Mitra Terpercaya Peralatan Listrik Rumah & Usaha',
    about_desc: 'Kami melayani penjualan eceran dan grosir komponen listrik berkualitas sejak 2018. Memberikan kepastian produk original 100% berstandar SNI.',
    stat_products: 'Produk Tersedia',
    stat_customers: 'Pelanggan Setia',
    stat_years: 'Tahun Pengalaman',
    stat_warranty: 'Garansi Resmi',
    feat_1_title: 'Standar SNI Original',
    feat_1_desc: 'Setiap produk kabel & sakelar terjamin aman dan berstandar nasional.',
    feat_2_title: 'Harga Grosir & Eceran',
    feat_2_desc: 'Penawaran harga terbaik untuk proyek rumah, toko, dan UMKM.',

    // Blog / Tips Section
    blog_badge: 'ARTIKEL & EDULIKASU',
    blog_title: 'Tips Keamanan & Panduan Instalasi Listrik',
    blog_desc: 'Informasi dan panduan praktis perawatan jaringan listrik rumah dan tempat usaha Anda.',
    btn_read_more: 'Baca Selengkapnya',
    btn_all_articles: 'Lihat Semua Artikel',

    // Contact Section
    contact_badge: 'HUBUNGI KAMI',
    contact_title: 'Konsultasi & Pemesanan Grosir Peralatan Listrik',
    contact_desc: 'Silakan isi formulir di bawah atau hubungi kami langsung via WhatsApp untuk pertanyaan produk & diskon khusus grosir.',
    label_name: 'Nama Lengkap *',
    label_phone: 'Nomor WhatsApp / HP *',
    label_email: 'Alamat Email',
    label_message: 'Pesan / Pertanyaan Produk *',
    placeholder_name: 'e.g. Budi Santoso',
    placeholder_phone: 'e.g. 081234567890',
    placeholder_email: 'e.g. budi@gmail.com',
    placeholder_message: 'Tuliskan kebutuhan peralatan listrik Anda di sini...',
    btn_send_inquiry: 'Kirim Pesan',
    contact_address_title: 'Alamat Toko & Gudang:',
    contact_address_val: 'Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta',
    contact_phone_title: 'Telepon / WhatsApp CS:',
    contact_email_title: 'Email Penjualan:',

    // Footer
    footer_quick_links: 'Navigasi Cepat',
    footer_categories: 'Kategori Utama',
    footer_contact_info: 'Kontak CS',
    footer_copyright: '© 2026 Toko Listrik Jaya UMKM. Seluruh Hak Cipta Dilindungi.',

    // Order Modal (Checkout)
    modal_order_form_title: 'Form Pemesanan Produk Listrik',
    modal_order_form_subtitle: 'Toko Listrik Jaya UMKM - Pembayaran Transfer Bank & QRIS',
    modal_quantity: 'Jumlah:',
    modal_tips_multi_title: 'Tips Pesan Banyak Produk:',
    modal_tips_multi_desc: 'Untuk memesan lebih dari 1 produk, gunakan Nama & No. WA yang sama. Produk baru akan otomatis digabungkan ke 1 Kode Pesanan Aktif Anda.',
    modal_cancel: 'Batal',
    modal_submit_order: 'Buat Pesanan & Dapatkan Kode',
    modal_processing: 'Memproses Pesanan...',

    modal_success_title: 'Pesanan Berhasil Dibuat!',
    modal_success_subtitle: 'Simpan Kode Pesanan Anda untuk mengecek status pembayaran & pengiriman.',
    modal_your_code: 'Kode Pesanan Anda:',
    modal_copied_msg: 'Kode pesanan berhasil disalin!',
    modal_deadline_title: 'Batas Waktu Pembayaran (Bayar Paling Telat):',
    modal_deadline_badge: 'Maksimal 1 Jam',
    modal_total_bill: 'Total Tagihan Transfer:',
    modal_qris_title: 'Bayar via QRIS (Scan QR Code All E-Wallet & M-Banking)',
    modal_qris_desc: 'Scan QR Code menggunakan BCA Mobile, Mandiri Livin\', GoPay, OVO, DANA, ShopeePay, LinkAja.',
    modal_qris_enlarge: 'Perbesar QRIS',
    modal_bank_section_title: 'Rekening Bank Pembayaran (Silakan Transfer Ke Rekening Berikut):',
    modal_copy_bank: 'Salin No. Rek',
    modal_copied_bank: '✓ Disalin',
    modal_option_1_title: 'Opsi 1: Upload Bukti Transfer',
    modal_option_1_desc: 'Unggah foto struk/screenshot transfer Anda agar admin langsung memverifikasi.',
    modal_upload_btn: 'Kirim Bukti Pembayaran',
    modal_option_2_title: 'Opsi 2: Konfirmasi via WA',
    modal_option_2_desc: 'Kirim pesan WhatsApp langsung ke customer service Toko Listrik Jaya.',
    modal_wa_btn: 'Konfirmasi Pembayaran via WA',
    modal_close_window: 'Tutup Window',

    // Order Tracking Modal
    track_title: 'Cek Status Pesanan & Pembayaran',
    track_subtitle: 'Masukkan Kode Pesanan (misal: TLJ-20260825-XXXX) atau Nomor WhatsApp Anda.',
    track_placeholder: 'Contoh: TLJ-20260825-8A92 atau 081234567890',
    track_btn_submit: 'Cek Status',
    track_btn_loading: 'Mencari...',
    track_order_code: 'Kode Pesanan',
    track_buyer_name: 'Nama Pembeli',
    track_order_date: 'Tanggal Pesanan',
    track_payment_deadline: 'Bayar Paling Telat',
    track_shipping_address: 'Alamat Pengiriman',
    track_items_title: 'Item Produk',
    track_upload_proof_btn: 'Upload Bukti Transfer',
    track_contact_cs: 'Hubungi CS via WA',

    // Admin Dashboard & Layout
    admin_title: 'DigiAgency CMS Admin',
    admin_sub: 'Panel Pengelolaan E-Commerce Toko Listrik Jaya',
    admin_nav_orders: 'Kelola Pesanan',
    admin_nav_services: 'Katalog Produk',
    admin_nav_posts: 'Artikel & Tips',
    admin_nav_categories: 'Kategori Produk',
    admin_nav_sliders: 'Hero Sliders',
    admin_nav_inquiries: 'Pesan Masuk CS',
    admin_nav_media: 'Media Library',
    admin_nav_settings: 'Pengaturan Situs',
    admin_logout: 'Keluar Admin',
    admin_close_panel: 'Tutup Admin',

    admin_orders_title: 'Kelola Pesanan & Rekening E-Commerce',
    admin_orders_sub: 'Kelola Pesanan Masuk, Verifikasi Bukti Transfer, Status Pengiriman, & Rekening Bank Toko',
    admin_refresh_btn: 'Refresh Pesanan',
    admin_refreshing: 'Memperbarui...',
    admin_buyer_details: 'Data Pembeli',
    admin_shipping_notes: 'Alamat Pengiriman & Catatan',
    admin_order_status_label: 'Ubah Status:'
  },

  en: {
    // Header & Navigation
    nav_home: 'Home',
    nav_catalog: 'Product Catalog',
    nav_about: 'About Us',
    nav_blog: 'Articles & Tips',
    nav_contact: 'Contact & Orders',
    btn_check_order: 'Track Order Status',
    sub_brand: 'MSME Electrical Equipment',

    // Hero Slider
    hero_badge_1: 'SPECIAL MSME PROMO',
    hero_title_1: 'Most Complete Electrical Equipment Store',
    hero_sub_1: 'Solutions for cables, sockets, switches, LED lights, and SNI certified electrical safety components at wholesale & retail prices.',
    hero_cta_1: 'Browse Catalog',

    hero_badge_2: 'ENERGY SAVING 85%',
    hero_title_2: 'Energy Efficient LED Lights Official Warranty',
    hero_sub_2: 'Save up to 85% on electricity for your home and shop. Available in various Watt sizes with up to 1-year official warranty.',
    hero_cta_2: 'Explore Lighting Products',

    // Services / Products Section
    section_services_badge: 'FULL PRODUCT CATALOG',
    section_services_title: 'SNI Standard Electrical Equipment',
    section_services_desc: 'Discover top electrical installation supplies with official store warranty & fast shipping.',
    filter_all: 'All Categories',
    unit_price: 'unit',
    ask_offer: 'Request Offer',
    subtotal_label: 'Subtotal:',
    btn_buy_now: 'Order Now',
    btn_view_details: 'Product Details',
    btn_view_all_products: 'View Full Product Catalog',

    // About Section
    about_badge: 'ABOUT TOKO LISTRIK JAYA',
    about_title: 'Trusted Partner for Home & Commercial Electrical Needs',
    about_desc: 'We have been supplying retail and wholesale electrical components since 2018. Guaranteeing 100% original SNI certified products.',
    stat_products: 'Products Available',
    stat_customers: 'Loyal Customers',
    stat_years: 'Years Experience',
    stat_warranty: 'Official Warranty',
    feat_1_title: 'Original SNI Standard',
    feat_1_desc: 'Every cable & switch product is guaranteed safe and certified to national standards.',
    feat_2_title: 'Wholesale & Retail Prices',
    feat_2_desc: 'Best pricing deals for residential, commercial, and small business projects.',

    // Blog / Tips Section
    blog_badge: 'ARTICLES & EDUCATION',
    blog_title: 'Electrical Safety Tips & Installation Guide',
    blog_desc: 'Practical guides and insights for maintaining residential and commercial electrical networks.',
    btn_read_more: 'Read Article',
    btn_all_articles: 'View All Articles',

    // Contact Section
    contact_badge: 'CONTACT US',
    contact_title: 'Consultation & Wholesale Orders',
    contact_desc: 'Please fill out the form below or contact us via WhatsApp for product inquiries & special wholesale discounts.',
    label_name: 'Full Name *',
    label_phone: 'WhatsApp / Phone No. *',
    label_email: 'Email Address',
    label_message: 'Message / Inquiries *',
    placeholder_name: 'e.g. John Doe',
    placeholder_phone: 'e.g. +62 81234567890',
    placeholder_email: 'e.g. john@example.com',
    placeholder_message: 'Describe your electrical equipment requirements here...',
    btn_send_inquiry: 'Send Message',
    contact_address_title: 'Store & Warehouse Address:',
    contact_address_val: 'Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Central Jakarta, Indonesia',
    contact_phone_title: 'Phone / WhatsApp CS:',
    contact_email_title: 'Sales Email:',

    // Footer
    footer_quick_links: 'Quick Links',
    footer_categories: 'Main Categories',
    footer_contact_info: 'Customer Support',
    footer_copyright: '© 2026 Toko Listrik Jaya UMKM. All Rights Reserved.',

    // Order Modal (Checkout)
    modal_order_form_title: 'Electrical Product Checkout Form',
    modal_order_form_subtitle: 'Toko Listrik Jaya UMKM - Bank Transfer & QRIS Payment',
    modal_quantity: 'Quantity:',
    modal_tips_multi_title: 'Tips for Ordering Multiple Items:',
    modal_tips_multi_desc: 'To order more than 1 product, use the same Name & WhatsApp number. New items will automatically merge into 1 active Order Code.',
    modal_cancel: 'Cancel',
    modal_submit_order: 'Place Order & Get Code',
    modal_processing: 'Processing Order...',

    modal_success_title: 'Order Placed Successfully!',
    modal_success_subtitle: 'Save your Order Code to track payment & shipping status.',
    modal_your_code: 'Your Order Code:',
    modal_copied_msg: 'Order code copied to clipboard!',
    modal_deadline_title: 'Payment Deadline (Pay At The Latest By):',
    modal_deadline_badge: 'Max 1 Hour',
    modal_total_bill: 'Total Transfer Amount:',
    modal_qris_title: 'Pay via QRIS (Scan QR Code All E-Wallet & M-Banking)',
    modal_qris_desc: 'Scan QR Code using BCA Mobile, Mandiri Livin\', GoPay, OVO, DANA, ShopeePay, LinkAja.',
    modal_qris_enlarge: 'Enlarge QRIS',
    modal_bank_section_title: 'Bank Accounts for Payment (Please Transfer To):',
    modal_copy_bank: 'Copy Acc No.',
    modal_copied_bank: '✓ Copied',
    modal_option_1_title: 'Option 1: Upload Payment Proof',
    modal_option_1_desc: 'Upload a photo/screenshot of your transfer receipt for admin verification.',
    modal_upload_btn: 'Submit Payment Proof',
    modal_option_2_title: 'Option 2: Confirm via WhatsApp',
    modal_option_2_desc: 'Send a WhatsApp message directly to Toko Listrik Jaya customer service.',
    modal_wa_btn: 'Confirm Payment via WA',
    modal_close_window: 'Close Window',

    // Order Tracking Modal
    track_title: 'Check Order & Payment Status',
    track_subtitle: 'Enter your Order Code (e.g. TLJ-20260825-XXXX) or WhatsApp Number.',
    track_placeholder: 'e.g., TLJ-20260825-8A92 or 081234567890',
    track_btn_submit: 'Check Status',
    track_btn_loading: 'Searching...',
    track_order_code: 'Order Code',
    track_buyer_name: 'Buyer Name',
    track_order_date: 'Order Date',
    track_payment_deadline: 'Payment Deadline',
    track_shipping_address: 'Shipping Address',
    track_items_title: 'Order Items',
    track_upload_proof_btn: 'Upload Payment Proof',
    track_contact_cs: 'Contact CS via WA',

    // Admin Dashboard & Layout
    admin_title: 'DigiAgency CMS Admin',
    admin_sub: 'Toko Listrik Jaya E-Commerce Management Panel',
    admin_nav_orders: 'Manage Orders',
    admin_nav_services: 'Product Catalog',
    admin_nav_posts: 'Articles & Tips',
    admin_nav_categories: 'Product Categories',
    admin_nav_sliders: 'Hero Sliders',
    admin_nav_inquiries: 'Inquiries Inbox',
    admin_nav_media: 'Media Library',
    admin_nav_settings: 'Site Settings',
    admin_logout: 'Admin Logout',
    admin_close_panel: 'Close Admin',

    admin_orders_title: 'Manage E-Commerce Orders & Accounts',
    admin_orders_sub: 'Manage Incoming Orders, Verify Payment Proofs, Shipping Status, & Bank Accounts',
    admin_refresh_btn: 'Refresh Orders',
    admin_refreshing: 'Refreshing...',
    admin_buyer_details: 'Buyer Details',
    admin_shipping_notes: 'Shipping Address & Notes',
    admin_order_status_label: 'Update Status:'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('ecommerce_lang') || 'id';
    } catch (e) {
      return 'id';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('ecommerce_lang', newLang);
    } catch (e) {}
  };

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    // Fallback to ID translation or raw key
    if (translations.id[key]) {
      return translations.id[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if component is used outside Provider
    return {
      lang: 'id',
      setLang: () => {},
      t: (key) => translations.id[key] || key
    };
  }
  return context;
};
