import { Platform } from 'react-native';

const getApiBase = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

// Memory store for mock state during offline/demo mode
let mockOrders = [
  {
    id: 1,
    order_number: 'ORD-1004',
    customer_name: 'Budi Santoso',
    customer_phone: '081234567890',
    shipping_address: 'Jl. Raya Darmo No. 45, Surabaya',
    payment_method: 'Transfer Bank BCA',
    total_amount: 345000,
    status: 'Diproses',
    notes: 'Mohon dikirim dengan packing kayu/bubble wrap ekstra.',
    items: JSON.stringify([{ title: 'Kabel NYM 2x1.5mm Supreme 50 Meter', price: 345000, quantity: 1 }]),
    created_at: '2026-09-13T10:30:00Z'
  },
  {
    id: 2,
    order_number: 'ORD-1003',
    customer_name: 'Siti Aminah',
    customer_phone: '085712345678',
    shipping_address: 'Ruko Indah Blok B2, Malang',
    payment_method: 'COD (Bayar di Tempat)',
    total_amount: 114000,
    status: 'PENDING',
    notes: 'Kirim saat jam kerja 08:00 - 16:00',
    items: JSON.stringify([
      { title: 'Lampu LED Bulb 12W Capsule Daylight', price: 28500, quantity: 2 },
      { title: 'MCB Schneider 1P 16A C-Curve', price: 62000, quantity: 1 }
    ]),
    created_at: '2026-09-13T09:15:00Z'
  }
];

let mockInquiries = [
  {
    id: 1,
    name: 'Toko Listrik Terang Jaya',
    email: 'terangjaya@gmail.com',
    phone: '081987654321',
    subject: 'Pemesanan Kabel Grosir 50 Roll',
    message: 'Halo admin, apakah ada harga khusus grosir untuk pembelian kabel NYM 2x1.5mm sebanyak 50 roll?',
    status: 'Belum Dibaca',
    created_at: '2026-09-13T08:00:00Z'
  },
  {
    id: 2,
    name: 'Deni Kurniawan',
    email: 'deni.k@yahoo.com',
    phone: '082133445566',
    subject: 'Konsultasi Panel Listrik Rumah 3500VA',
    message: 'Apakah toko menyediakan jasa pemasangan MCB tambahan dan pembuatan panel rumah?',
    status: 'Sudah Dibaca',
    created_at: '2026-09-12T14:20:00Z'
  }
];

export const apiService = {
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        return { success: true, token: data.token, user: data.user };
      }
      return data;
    } catch (e) {
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        return {
          success: true,
          token: 'mock_jwt_token_admin_2026',
          user: { id: 1, username: 'admin', role: 'ADMIN', name: 'Super Admin', email: 'admin@digiagency.com' }
        };
      } else if (username === 'user' || username === 'pelanggan') {
        return {
          success: true,
          token: 'mock_jwt_token_user_2026',
          user: { id: 2, username: username, role: 'CUSTOMER', name: 'Pelanggan Toko', email: 'customer@gmail.com' }
        };
      }
      return { success: false, message: 'Kombinasi username atau password salah.' };
    }
  },

  getSliders: async () => {
    try {
      const res = await fetch(`${API_BASE}/sliders`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty sliders");
    } catch (e) {
      return [
        {
          id: 1,
          title: 'Pusat Peralatan Listrik UMKM Terlengkap',
          subtitle: 'Solusi kebutuhan kabel, stop kontak, sakelar, lampu LED, dan pengaman listrik berkualitas SNI dengan harga grosir & eceran.',
          badge_text: 'PROMO SPESIAL UMKM',
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
          cta_text: 'Lihat Katalog Produk',
          cta_link: 'Catalog'
        },
        {
          id: 2,
          title: 'Lampu LED Hemat Energi Garansi Resmi',
          subtitle: 'Hemat penggunaan listrik hingga 85% untuk rumah dan toko Anda. Tersedia berbagai ukuran Watt dan garansi resmi hingga 1 tahun.',
          badge_text: 'HEMAT ENERGI 85%',
          image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200',
          cta_text: 'Jelajahi Produk Lampu',
          cta_link: 'Catalog'
        }
      ];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/services/categories`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty categories");
    } catch (e) {
      return [
        { id: 1, name: 'Kabel & Instalasi Listrik', slug: 'kabel-instalasi-listrik', icon: 'zap' },
        { id: 2, name: 'Stop Kontak & Sakelar', slug: 'stop-kontak-sakelar-steker', icon: 'toggle-right' },
        { id: 3, name: 'Lampu & Penghemat Energi', slug: 'lampu-penghemat-energi', icon: 'sun' },
        { id: 4, name: 'Komponen & Pengaman MCB', slug: 'komponen-pengaman-listrik', icon: 'shield-check' }
      ];
    }
  },

  getProducts: async () => {
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty products");
    } catch (e) {
      return [
        {
          id: 1,
          title: 'Kabel NYM 2x1.5mm Supreme 50 Meter',
          price: 345000,
          original_price: 390000,
          discount_percentage: 11,
          is_featured: true,
          category_name: 'Kabel & Instalasi Listrik',
          category_slug: 'kabel-instalasi-listrik',
          image_url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800',
          description: 'Kabel NYM Supreme standar PLN/SNI kualitas tembaga murni 99.9% anti leleh dan tahan cuaca ekstrim.',
          rating: 4.9,
          stock_status: 'ready'
        },
        {
          id: 2,
          title: 'Lampu LED Bulb 12W Capsule Daylight Super Bright',
          price: 28500,
          original_price: 35000,
          discount_percentage: 18,
          is_featured: true,
          category_name: 'Lampu & Penghemat Energi',
          category_slug: 'lampu-penghemat-energi',
          image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=800',
          description: 'Lampu LED hemat energi 12 Watt terang putih 6500K garansi 1 tahun resmi produsen.',
          rating: 4.8,
          stock_status: 'ready'
        },
        {
          id: 3,
          title: 'Stop Kontak Arde 4 Lubang + Sakelar Master Neon',
          price: 48000,
          original_price: 55000,
          discount_percentage: 12,
          is_featured: true,
          category_name: 'Stop Kontak & Sakelar',
          category_slug: 'stop-kontak-sakelar-steker',
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
          description: 'Stop kontak arde kuningan murni dengan sakelar indikator neon & kabel 1.5M anti panas.',
          rating: 4.7,
          stock_status: 'ready'
        },
        {
          id: 4,
          title: 'MCB Schneider 1P 16A C-Curve SNI Original',
          price: 62000,
          original_price: 70000,
          discount_percentage: 11,
          is_featured: true,
          category_name: 'Komponen & Pengaman MCB',
          category_slug: 'komponen-pengaman-listrik',
          image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800',
          description: 'Pengaman beban lebih & korsleting listrik PLN 3500VA garansi SNI & LMK original.',
          rating: 5.0,
          stock_status: 'ready'
        }
      ];
    }
  },

  // Add Product to backend API
  addProduct: async (productData) => {
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (e) {
      const newProd = {
        id: Date.now(),
        ...productData,
        price: Number(productData.price),
        rating: 5.0,
        stock_status: 'ready'
      };
      return { success: true, message: 'Produk berhasil ditambahkan ke katalog toko.', data: newProd };
    }
  },

  // Update Product in backend API
  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Produk berhasil diperbarui.', data: { id, ...productData } };
    }
  },

  // Delete Product in backend API
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Produk berhasil dihapus.' };
    }
  },

  // Media Assets API
  getMedia: async () => {
    try {
      const res = await fetch(`${API_BASE}/media`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty media");
    } catch (e) {
      return [
        { id: 1, filename: 'kabel-nym-supreme.jpg', size: 1048576, url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800', created_at: '2026-09-13T10:00:00Z' },
        { id: 2, filename: 'lampu-led-bulb.jpg', size: 524288, url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=800', created_at: '2026-09-13T10:05:00Z' },
        { id: 3, filename: 'stop-kontak-arde.jpg', size: 786432, url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800', created_at: '2026-09-13T10:10:00Z' },
        { id: 4, filename: 'mcb-schneider-1p.jpg', size: 655360, url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800', created_at: '2026-09-13T10:15:00Z' }
      ];
    }
  },

  uploadMedia: async (imageUrl) => {
    try {
      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });
      return await res.json();
    } catch (e) {
      const newMedia = {
        id: Date.now(),
        filename: `media-${Date.now()}.jpg`,
        size: 512000,
        url: imageUrl,
        created_at: new Date().toISOString()
      };
      return { success: true, message: 'Media berhasil ditambahkan.', data: newMedia };
    }
  },

  deleteMedia: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: true, message: 'Media berhasil dihapus.' };
    }
  },

  // Orders API
  createOrder: async (orderPayload) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      const newOrderCode = 'TLJ-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const createdOrder = {
        id: Date.now(),
        order_code: newOrderCode,
        order_number: newOrderCode,
        ...orderPayload,
        status: 'PENDING_PAYMENT',
        created_at: new Date().toISOString()
      };
      mockOrders.unshift(createdOrder);
      return {
        success: true,
        is_merged: false,
        order_number: newOrderCode,
        message: 'Pesanan berhasil dibuat!',
        data: createdOrder
      };
    }
  },

  trackOrder: async (query) => {
    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(query)}`);
      const data = await res.json();
      return data;
    } catch (e) {
      const cleanQ = query.trim().toLowerCase();
      const found = mockOrders.filter(
        o => (o.order_code && o.order_code.toLowerCase().includes(cleanQ)) ||
             (o.order_number && o.order_number.toLowerCase().includes(cleanQ)) ||
             (o.customer_phone && o.customer_phone.includes(cleanQ))
      );
      if (found.length > 0) {
        return { success: true, data: found };
      }
      return { success: false, message: 'Pesanan tidak ditemukan dengan kode/nomor WA tersebut.' };
    }
  },

  getBankAccounts: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/bank-accounts`);
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      return [
        { bank_name: 'Bank BCA', account_number: '123-456-7890', account_holder: 'Toko Listrik Jaya UMKM' },
        { bank_name: 'Bank Mandiri', account_number: '987-654-3210-00', account_holder: 'Toko Listrik Jaya UMKM' },
        { bank_name: 'Bank BRI', account_number: '0012-01-003456-50-8', account_holder: 'Toko Listrik Jaya UMKM' }
      ];
    }
  },

  getQris: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/qris`);
      const data = await res.json();
      return data.data || null;
    } catch (e) {
      return null;
    }
  },

  getOrders: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty backend orders");
    } catch (e) {
      return mockOrders;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      mockOrders = mockOrders.map(ord => ord.id === id ? { ...ord, status } : ord);
      return { success: true, message: `Status pesanan diperbarui menjadi ${status}` };
    }
  },

  // Inquiries API
  getInquiries: async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty inquiries");
    } catch (e) {
      return mockInquiries;
    }
  },

  getStats: async () => {
    try {
      const orders = await apiService.getOrders();
      const products = await apiService.getProducts();
      const inquiries = await apiService.getInquiries();
      
      const pendingCount = orders.filter(o => o.status === 'PENDING' || o.status === 'Menunggu Konfirmasi').length;
      
      return {
        totalOrders: orders.length,
        pendingOrders: pendingCount,
        totalProducts: products.length,
        totalInquiries: inquiries.length
      };
    } catch (e) {
      return {
        totalOrders: mockOrders.length,
        pendingOrders: mockOrders.filter(o => o.status === 'PENDING').length,
        totalProducts: 4,
        totalInquiries: mockInquiries.length
      };
    }
  }
};
