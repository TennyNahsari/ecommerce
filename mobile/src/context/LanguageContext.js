import React, { createContext, useState, useContext } from 'react';

const translations = {
  id: {
    // Top Bar & General
    app_title: 'DigiAgency Listrik',
    tagline: 'Pusat Peralatan Listrik & Lampu UMKM',
    switch_lang: 'EN',
    lang_name: 'Bahasa Indonesia',
    beranda: 'Beranda',
    katalog: 'Katalog',
    masuk: 'Masuk',
    keluar: 'Keluar',
    dashboard: 'Dashboard',
    keranjang: 'Keranjang',
    bantuan: 'Bantuan',
    lacak_pesanan: 'Lacak Pesanan',
    portofolio: 'Portofolio',
    
    // Landing Page
    hero_badge: 'PROMO SPESIAL UMKM',
    hero_title: 'Solusi Peralatan Listrik SNI Terlengkap',
    hero_subtitle: 'Dapatkan kabel, lampu LED hemat energi, sakelar, dan pengaman listrik berkualitas tinggi dengan harga grosir.',
    cta_explore: 'Jelajahi Produk',
    cta_contact: 'Hubungi WhatsApp',
    
    cat_title: 'Kategori Produk',
    cat_subtitle: 'Temukan komponen listrik sesuai kebutuhan rumah & usaha Anda',
    view_all: 'Lihat Semua',
    
    featured_title: 'Produk Unggulan',
    featured_subtitle: 'Stok ready, bergaransi resmi & memenuhi standar SNI',
    add_to_cart: 'Tambah Keranjang',
    in_stock: 'Stok Ready',
    out_of_stock: 'Stok Habis',
    price_start: 'Rp',
    cta_banner_title: 'Butuh Konsultasi Kabel & Listrik?',
    cta_banner_desc: 'Tim teknis siap melayani pemesanan khusus & rekomendasi proyek.',
    swipe_hint_mobile: 'Swipe ◄ ► untuk scroll produk',
    swipe_hint_desktop: 'Geser/Swipe atau klik panah untuk melihat produk lainnya',
    
    // Product Detail
    sni_certified: 'Standar SNI / PLN',
    save_disc: 'Hemat',
    desc_title: 'Deskripsi Produk',
    default_desc: 'Peralatan listrik berkualitas tinggi untuk instalasi rumah dan gedung usaha.',
    warranty_1_year: 'Garansi Resmi 1 Tahun',
    ready_ship_today: 'Stok Siap Kirim Hari Ini',
    copper_anti_melt: 'Bahan Tembaga Anti Leleh',
    qty_purchase: 'Jumlah Pembelian:',
    buy_now: 'Beli Sekarang',
    add_to_cart_short: '+ Keranjang',

    // Login Screen
    login_title: 'Masuk Akun',
    login_subtitle: 'Masuk sebagai Pelanggan atau Pengelola Toko',
    username_label: 'Username / Email',
    username_placeholder: 'Masukkan username',
    password_label: 'Kata Sandi',
    password_placeholder: 'Masukkan kata sandi',
    login_btn: 'Masuk Sekarang',
    demo_admin_login: 'Login Cepat sebagai Admin',
    demo_customer_login: 'Masuk Mode Pelanggan',
    invalid_login: 'Username atau kata sandi tidak valid!',
    logged_in_as: 'Login sebagai',
    
    // Cart & Checkout Screen
    cart_title: 'Keranjang Belanja',
    cart_empty_title: 'Keranjang Belanja Kosong',
    cart_empty_desc: 'Jelajahi katalog peralatan listrik dan tambahkan ke keranjang Anda.',
    total_payment: 'Total Pembayaran:',
    order_via_wa: 'Pesan via WhatsApp',
    
    checkout_title: 'Form Checkout Pesanan',
    checkout_subtitle: 'Lengkapi data pengiriman & pembayaran Anda',
    tip_multi_order_title: 'Tips Pesan Banyak Produk:',
    tip_multi_order_desc: 'Gunakan Nama & No. WA yang sama. Produk baru akan otomatis digabungkan ke 1 Kode Pesanan Aktif Anda.',
    name_label: 'Nama Lengkap *',
    name_placeholder: 'Masukkan nama pembeli',
    phone_label: 'No. Telepon / WhatsApp *',
    phone_placeholder: 'Contoh: 081234567890',
    address_label: 'Alamat Lengkap Pengiriman *',
    address_placeholder: 'Jalan, No. Rumah, RT/RW, Kecamatan, Kota...',
    payment_method_label: 'Pilih Metode Pembayaran',
    notes_label: 'Catatan Tambahan (Opsional)',
    notes_placeholder: 'Contoh: Titip ke satpam / warna putih',
    summary_title: 'Ringkasan Pembayaran',
    item_subtotal_label: 'Total Harga Barang:',
    shipping_fee_label: 'Ongkos Kirim:',
    free_shipping: 'GRATIS PROMO',
    total_bill_label: 'Total Tagihan:',
    confirm_order_btn: 'Konfirmasi & Buat Pesanan',
    
    // Tracking & Details
    track_title: 'Melacak Status Pesanan',
    track_subtitle: 'Masukkan Kode Pesanan (TLJ-XXXX) atau No. WhatsApp Anda',
    track_placeholder: 'Masukkan Kode Pesanan atau No. WA...',
    track_btn: 'Cari Pesanan',
    track_not_found: 'Nomor order atau pesanan tidak ditemukan.',
    item_breakdown_title: 'Rincian Barang Pesanan:',
    order_status_flow_title: 'Status & Alur Proses Pesanan:',
    status_pending: 'Menunggu Pembayaran',
    status_processing: 'Diproses Gudang',
    status_shipped: 'Dalam Pengiriman',
    status_completed: 'Selesai',
    status_cancelled: 'Dibatalkan',

    // Dashboard & Admin Management Tools
    dash_welcome: 'Selamat Datang Kembali,',
    dash_subtitle: 'Ringkasan aktivitas & status toko peralatan listrik Anda',
    stat_total_orders: 'Total Pesanan',
    stat_pending_orders: 'Menunggu Konfirmasi',
    stat_total_products: 'Total Produk',
    stat_inquiries: 'Pesan Inkuiri',
    
    store_management_tools: 'Fitur Pengelolaan Toko',
    admin_nav_products: 'Manajemen Produk',
    admin_nav_categories: 'Manajemen Kategori',
    admin_nav_orders: 'Kelola Pesanan',
    admin_nav_inquiries: 'Inkuiri Pelanggan',
    admin_nav_sliders: 'Banner Promo',
    admin_nav_media: 'Media Library',
    admin_nav_settings: 'Pengaturan Toko',

    recent_activity: 'Aktivitas Terbaru',
    quick_actions: 'Aksi Cepat',
    action_add_product: '+ Tambah Produk',
    action_view_orders: 'Lihat Semua Pesanan',
    action_view_inquiries: 'Inkuiri Pelanggan',
    action_catalog: 'Buka Katalog',
    
    // Modals & Management Tools
    modal_add_product_title: 'Tambah Produk Baru',
    modal_edit_product_title: 'Edit Produk Katalog',
    modal_media_title: 'Media Library & File Manager',
    modal_category_title: 'Kelola Kategori Produk',
    modal_order_title: 'Kelola Pesanan Pelanggan',
    modal_inquiry_title: 'Kotak Masuk Inkuiri',
    modal_slider_title: 'Kelola Banner Slider Promo',
    modal_settings_title: 'Pengaturan Toko & Informasi Operasional',
    
    search_product_ph: 'Cari produk...',
    search_media_ph: 'Cari file media...',
    add_btn: 'Tambah',
    upload_btn: 'Upload',
    copy_url_btn: 'Salin URL Foto',
    url_copied: 'Link Disalin!',
    save_changes_btn: 'Simpan Perubahan',
    save_to_catalog_btn: 'Simpan Produk ke Katalog',
    add_category_btn: 'Tambahkan Kategori',
    category_name_label: 'Nama Kategori *',
    slug_label: 'Slug URL (Opsional)',
    active_categories: 'Daftar Kategori Aktif',
    inquiry_subtitle: 'Pesan masuk dari calon pembeli & proyek UMKM',
    reply_wa_btn: 'Balas via WhatsApp',
    add_slider_btn: 'Tambahkan Banner Promo',
    slider_subtitle: 'Atur gambar & tulisan promo utama di Beranda',
    store_contact_settings: 'Pengaturan Toko & Kontak',
    save_settings_btn: 'Simpan Perubahan Pengaturan',

    btn_save: 'Simpan',
    btn_cancel: 'Batal',
    btn_delete: 'Hapus',
    btn_edit: 'Edit',

    // Customer profile / Info
    role_admin: 'Administrator Toko',
    role_customer: 'Pelanggan Terdaftar',
  },
  en: {
    // Top Bar & General
    app_title: 'DigiAgency Electrical',
    tagline: 'SME Electrical & Lighting Supply Center',
    switch_lang: 'ID',
    lang_name: 'English',
    beranda: 'Home',
    katalog: 'Catalog',
    masuk: 'Login',
    keluar: 'Logout',
    dashboard: 'Dashboard',
    keranjang: 'Cart',
    bantuan: 'Support',
    lacak_pesanan: 'Track Order',
    portofolio: 'Portfolio',
    
    // Landing Page
    hero_badge: 'SPECIAL SME PROMO',
    hero_title: 'Complete Standard Electrical Equipment Solutions',
    hero_subtitle: 'Get cables, energy-saving LED lights, switches, and electrical protection at wholesale prices.',
    cta_explore: 'Explore Products',
    cta_contact: 'Contact WhatsApp',
    
    cat_title: 'Product Categories',
    cat_subtitle: 'Find electrical components tailored for home & commercial needs',
    view_all: 'View All',
    
    featured_title: 'Featured Products',
    featured_subtitle: 'In stock, official warranty & SNI safety certified',
    add_to_cart: 'Add to Cart',
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    price_start: 'Rp',
    cta_banner_title: 'Need Cable & Electrical Advice?',
    cta_banner_desc: 'Our technical team is ready for custom orders & project recommendations.',
    swipe_hint_mobile: 'Swipe ◄ ► to scroll products',
    swipe_hint_desktop: 'Swipe or click arrows to view more products',
    
    // Product Detail
    sni_certified: 'SNI / PLN Certified Standard',
    save_disc: 'Save',
    desc_title: 'Product Description',
    default_desc: 'High-quality electrical equipment for home and commercial installations.',
    warranty_1_year: '1 Year Official Warranty',
    ready_ship_today: 'In Stock - Ready to Ship Today',
    copper_anti_melt: 'Anti-Melt Pure Copper Material',
    qty_purchase: 'Purchase Quantity:',
    buy_now: 'Buy Now',
    add_to_cart_short: '+ Cart',

    // Login Screen
    login_title: 'Account Login',
    login_subtitle: 'Sign in as Customer or Store Administrator',
    username_label: 'Username / Email',
    username_placeholder: 'Enter username',
    password_label: 'Password',
    password_placeholder: 'Enter password',
    login_btn: 'Sign In Now',
    demo_admin_login: 'Quick Admin Login',
    demo_customer_login: 'Customer Guest Mode',
    invalid_login: 'Invalid username or password!',
    logged_in_as: 'Logged in as',
    
    // Cart & Checkout Screen
    cart_title: 'Shopping Cart',
    cart_empty_title: 'Shopping Cart is Empty',
    cart_empty_desc: 'Browse our electrical catalog and add products to your cart.',
    total_payment: 'Total Payment:',
    order_via_wa: 'Order via WhatsApp',
    
    checkout_title: 'Order Checkout Form',
    checkout_subtitle: 'Complete your shipping & payment details',
    tip_multi_order_title: 'Multi-Item Order Tip:',
    tip_multi_order_desc: 'Use the same Name & WhatsApp number. New items will automatically merge into 1 Active Order Code.',
    name_label: 'Full Name *',
    name_placeholder: 'Enter buyer name',
    phone_label: 'Phone / WhatsApp Number *',
    phone_placeholder: 'Example: 081234567890',
    address_label: 'Complete Delivery Address *',
    address_placeholder: 'Street, House No, District, City...',
    payment_method_label: 'Select Payment Method',
    notes_label: 'Additional Notes (Optional)',
    notes_placeholder: 'Example: Leave with security guard / white color',
    summary_title: 'Payment Summary',
    item_subtotal_label: 'Items Subtotal:',
    shipping_fee_label: 'Shipping Fee:',
    free_shipping: 'FREE PROMO',
    total_bill_label: 'Total Amount:',
    confirm_order_btn: 'Confirm & Place Order',
    
    // Tracking & Details
    track_title: 'Track Order Status',
    track_subtitle: 'Enter Order Code (TLJ-XXXX) or your WhatsApp number',
    track_placeholder: 'Enter Order Code or WA number...',
    track_btn: 'Search Order',
    track_not_found: 'Order number or order not found.',
    item_breakdown_title: 'Ordered Items Breakdown:',
    order_status_flow_title: 'Order Status & Process Timeline:',
    status_pending: 'Awaiting Payment',
    status_processing: 'Warehouse Processing',
    status_shipped: 'In Transit',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',

    // Dashboard & Admin Management Tools
    dash_welcome: 'Welcome Back,',
    dash_subtitle: 'Summary of your electrical store metrics & activities',
    stat_total_orders: 'Total Orders',
    stat_pending_orders: 'Pending Confirmations',
    stat_total_products: 'Total Products',
    stat_inquiries: 'Customer Inquiries',
    
    store_management_tools: 'Store Management Tools',
    admin_nav_products: 'Product Manager',
    admin_nav_categories: 'Category Manager',
    admin_nav_orders: 'Order Manager',
    admin_nav_inquiries: 'Customer Inquiries',
    admin_nav_sliders: 'Promo Banners',
    admin_nav_media: 'Media Library',
    admin_nav_settings: 'Store Settings',

    recent_activity: 'Recent Activity',
    quick_actions: 'Quick Actions',
    action_add_product: '+ Add Product',
    action_view_orders: 'View All Orders',
    action_view_inquiries: 'Customer Inquiries',
    action_catalog: 'Open Catalog',
    
    // Modals & Management Tools
    modal_add_product_title: 'Add New Product',
    modal_edit_product_title: 'Edit Catalog Product',
    modal_media_title: 'Media Library & File Manager',
    modal_category_title: 'Manage Product Categories',
    modal_order_title: 'Manage Customer Orders',
    modal_inquiry_title: 'Customer Inquiry Inbox',
    modal_slider_title: 'Manage Promo Slider Banners',
    modal_settings_title: 'Store Settings & Operational Info',
    
    search_product_ph: 'Search products...',
    search_media_ph: 'Search media files...',
    add_btn: 'Add',
    upload_btn: 'Upload',
    copy_url_btn: 'Copy Image URL',
    url_copied: 'Link Copied!',
    save_changes_btn: 'Save Changes',
    save_to_catalog_btn: 'Save Product to Catalog',
    add_category_btn: 'Add Category',
    category_name_label: 'Category Name *',
    slug_label: 'URL Slug (Optional)',
    active_categories: 'Active Categories List',
    inquiry_subtitle: 'Incoming inquiries from prospective buyers & SME projects',
    reply_wa_btn: 'Reply via WhatsApp',
    add_slider_btn: 'Add Promo Banner',
    slider_subtitle: 'Manage home hero banner images & promotional text',
    store_contact_settings: 'Store Settings & Contact Info',
    save_settings_btn: 'Save Setting Changes',

    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_delete: 'Delete',
    btn_edit: 'Edit',

    // Customer profile / Info
    role_admin: 'Store Administrator',
    role_customer: 'Registered Customer',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('id');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

