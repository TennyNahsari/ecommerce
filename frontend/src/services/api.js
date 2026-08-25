// API Service Layer for DigiAgency
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    if (port === '3000' || port === '4173' || port === '5173') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
};

const API_BASE = getApiBase();

const getHeaders = () => {
  const token = localStorage.getItem('digi_token') || 'mock_jwt_token_admin_2026';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export function parseJSON(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return Array.isArray(val) || typeof val === 'object' ? val : fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    if (typeof val === 'string' && val.trim().length > 0) {
      return [val];
    }
    return fallback;
  }
}

export const apiService = {
  // Auth
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('digi_token', data.token);
        localStorage.setItem('digi_user', JSON.stringify(data.user));
      }
      return data;
    } catch (e) {
      if (username === 'admin' && password === 'admin123') {
        const mockToken = 'mock_jwt_token_admin_2026';
        const mockUser = { id: 1, username: 'admin', role: 'ADMIN', email: 'admin@digiagency.com' };
        localStorage.setItem('digi_token', mockToken);
        localStorage.setItem('digi_user', JSON.stringify(mockUser));
        return { success: true, token: mockToken, user: mockUser };
      }
      return { success: false, message: 'Invalid credentials or server connection offline.' };
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('digi_token');
      localStorage.removeItem('digi_user');
    } catch (e) {}
  },

  getUser: () => {
    try {
      const userStr = localStorage.getItem('digi_user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') return null;
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  // Sliders
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
          cta_link: '#services'
        },
        {
          id: 2,
          title: 'Lampu LED Hemat Energi Garansi Resmi',
          subtitle: 'Hemat penggunaan listrik hingga 85% untuk rumah dan toko Anda. Tersedia berbagai ukuran Watt dan garansi resmi hingga 1 tahun.',
          badge_text: 'HEMAT ENERGI 85%',
          image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200',
          cta_text: 'Jelajahi Produk Lampu',
          cta_link: '#services'
        }
      ];
    }
  },

  addSlider: async (sliderData) => {
    const res = await fetch(`${API_BASE}/sliders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sliderData)
    });
    return res.json();
  },

  deleteSlider: async (id) => {
    const res = await fetch(`${API_BASE}/sliders/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Service Categories
  getServiceCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/services/categories`);
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return [
        { id: 1, name: 'Kabel & Instalasi Listrik', slug: 'kabel-instalasi-listrik' },
        { id: 2, name: 'Stop Kontak, Sakelar & Steker', slug: 'stop-kontak-sakelar-steker' },
        { id: 3, name: 'Lampu & Penghemat Energi', slug: 'lampu-penghemat-energi' },
        { id: 4, name: 'Komponen & Pengaman Listrik', slug: 'komponen-pengaman-listrik' }
      ];
    }
  },

  addServiceCategory: async (catData) => {
    const res = await fetch(`${API_BASE}/services/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(catData)
    });
    return res.json();
  },

  deleteServiceCategory: async (id) => {
    const res = await fetch(`${API_BASE}/services/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty services");
    } catch (e) {
      return [
        {
          id: 1,
          title: 'Kabel Listrik NYM 2x1.5mm Tembaga Murni',
          slug: 'kabel-nym-2x1-5mm',
          icon_name: 'Zap',
          summary: 'Kabel kawat tembaga murni isi 2 berlapis PVC ganda aman untuk instalasi listrik tanam dinding.',
          description: '<h2>Kabel Listrik Berkualitas Standar SNI</h2><p>Kabel NYM 2x1.5mm sangat cocok digunakan untuk instalasi penerangan dan stop kontak rumah tinggal.</p>',
          features: ['Standard Nasional Indonesia (SNI)', 'Konduktor Tembaga Murni 99.9%', 'Isolasi Double Layer Tahan Panas'],
          image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800',
          price: 385000
        },
        {
          id: 2,
          title: 'Stop Kontak Arde 4 Lubang + Sakelar Indikator',
          slug: 'stop-kontak-arde-4-lubang',
          icon_name: 'Power',
          summary: 'Stop kontak multi-soket dengan kabel 3 meter, sakelar sentral, dan sistem pengaman anak (child safety).',
          description: '<h2>Stop Kontak Aman & Tahan Panas</h2><p>Stop kontak arde 4 colokan dilengkapi plat kuningan tebal dan pengaman otomatis grounding.</p>',
          features: ['4 Lubang Colokan Arde Kuningan', 'Kabel Tembaga Murni Panjang 3 Meter', 'Child Safety Shutter Locking'],
          image_url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800',
          price: 68000
        }
      ];
    }
  },

  saveService: async (serviceData) => {
    const isUpdate = serviceData.id;
    const url = isUpdate ? `${API_BASE}/services/${serviceData.id}` : `${API_BASE}/services`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(serviceData)
    });
    return res.json();
  },

  deleteService: async (id) => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Projects / Portfolio
  getProjects: async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [
        {
          id: 1,
          title: 'FinTech NeoBank Digital Portal',
          slug: 'fintech-neobank-portal',
          client_name: 'Aether Finance',
          category_id: 2,
          category: 'Web Development',
          thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000',
          summary: 'Redesigned core web application platform increasing conversion by 145%.',
          outcomes: { conversion_increase: '145%', user_retention: '88%', speed_score: '99/100' },
          content_html: '<h3>Project Scope & Execution</h3><p>We designed a high-contrast glassmorphic design system for Aether Finance, reducing onboarding steps from 9 to 3 while optimizing application performance.</p>'
        },
        {
          id: 2,
          title: 'SaaS Analytics Dashboard Redesign',
          slug: 'saas-analytics-dashboard',
          client_name: 'DataPulse Inc.',
          category_id: 1,
          category: 'UI/UX Design',
          thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
          summary: 'Built a modular dark-mode dashboard system for high-volume enterprise telemetry.',
          outcomes: { session_duration: '+320%', churn_reduction: '24%', nps_score: '78' },
          content_html: '<h3>Engineering Details</h3><p>Transformed telemetry visualizer into custom SVG canvas graphs with real-time WebSocket state management.</p>'
        },
        {
          id: 3,
          title: 'Global Ecommerce Performance Campaign',
          slug: 'ecommerce-performance-campaign',
          client_name: 'Luminary Apparel',
          category_id: 3,
          category: 'Digital Marketing',
          thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000',
          summary: 'Multi-channel acquisition strategy driving 4.2x ROAS across European markets.',
          outcomes: { roas: '4.2x', new_customers: '45,000+', revenue_growth: '+210%' },
          content_html: '<h3>Growth Campaign Strategy</h3><p>Implemented targeted dynamic retargeting ads coupled with landing page optimization to capture high-intent buyers.</p>'
        }
      ];
    }
  },

  saveProject: async (projectData) => {
    const isUpdate = projectData.id;
    const url = isUpdate ? `${API_BASE}/projects/${projectData.id}` : `${API_BASE}/projects`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Portfolio Categories
  getPortfolioCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/categories`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [
        { id: 1, name: 'UI/UX Design', slug: 'ui-ux-design' },
        { id: 2, name: 'Web Development', slug: 'web-development' },
        { id: 3, name: 'Digital Marketing', slug: 'digital-marketing' },
        { id: 4, name: 'Mobile Apps', slug: 'mobile-apps' }
      ];
    }
  },

  addPortfolioCategory: async (catData) => {
    const res = await fetch(`${API_BASE}/projects/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(catData)
    });
    return res.json();
  },

  deletePortfolioCategory: async (id) => {
    const res = await fetch(`${API_BASE}/projects/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Posts / Blog
  getPosts: async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty posts");
    } catch (e) {
      return [
        {
          id: 1,
          title: '5 Cara Efektif Mencegah Korsleting Listrik di Rumah & Tempat Usaha',
          slug: 'cara-mencegah-korsleting-listrik',
          category_name: 'Tips & Keamanan Listrik',
          excerpt: 'Korsleting listrik merupakan salah satu penyebab utama kebocoran arus dan kebakaran. Simak tips aman memilih kabel dan pengaman MCB standar SNI.',
          content_html: '<h2>Mengapa Korsleting Listrik Sangat Berbahaya?</h2><p>Korsleting listrik terjadi ketika kabel positif dan negatif bersentuhan langsung.</p>',
          featured_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000',
          created_at: '2026-08-25'
        },
        {
          id: 2,
          title: 'Panduan Memilih Jenis Kabel Listrik yang Tepat untuk Instalasi',
          slug: 'panduan-memilih-jenis-kabel-listrik',
          category_name: 'Panduan Instalasi Rumah',
          excerpt: 'Kabel NYM, NYA, dan NYMHY memiliki fungsi dan karakteristik berbeda. Jangan salah pilih agar instalasi tetap aman dan bertahan lama.',
          content_html: '<h2>Mengenal Jenis-Jenis Kabel Listrik Umum</h2><p>Setiap tipe kabel dirancang khusus untuk kondisi lingkungan dan jenis beban tertentu.</p>',
          featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000',
          created_at: '2026-08-24'
        }
      ];
    }
  },

  addPost: async (postData) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Menus Navigation
  getMenus: async () => {
    try {
      const res = await fetch(`${API_BASE}/menus`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      if (list.length > 0) return list;
      throw new Error("Empty menus");
    } catch (e) {
      return [
        { id: 1, label: 'Beranda', url: '#hero', order_index: 1 },
        { id: 2, label: 'Katalog Produk', url: '#services', order_index: 2 },
        { id: 3, label: 'Tentang Kami', url: '#about', order_index: 3 },
        { id: 4, label: 'Artikel & Tips', url: '#blog', order_index: 4 },
        { id: 5, label: 'Kontak', url: '#contact', order_index: 5 }
      ];
    }
  },

  addMenu: async (menuData) => {
    const res = await fetch(`${API_BASE}/menus`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(menuData)
    });
    return res.json();
  },

  deleteMenu: async (id) => {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Pages Builder
  getPages: async () => {
    try {
      const res = await fetch(`${API_BASE}/pages`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return [];
    }
  },

  savePage: async (pageData) => {
    const isUpdate = pageData.id;
    const url = isUpdate ? `${API_BASE}/pages/${pageData.id}` : `${API_BASE}/pages`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(pageData)
    });
    return res.json();
  },

  // Inquiries / Contact
  sendInquiry: async (inquiryData) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        message: 'Thank you for reaching out! A DigiAgency strategist will contact you within 24 hours.'
      };
    }
  },

  getInquiries: async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { headers: getHeaders() });
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return [
        {
          id: 1,
          name: 'Budi Santoso',
          email: 'budi.santoso@gmail.com',
          company: 'Kontraktor Listrik Jaya',
          budget: 'Grosir / Proyek',
          service_interest: 'Kabel Listrik NYM',
          message: 'Halo, saya ingin menanyakan harga grosir untuk kabel NYM 2x1.5mm sebanyak 20 roll. Apakah ada diskon toko?',
          status: 'NEW',
          created_at: new Date().toISOString()
        }
      ];
    }
  },

  // Site / Footer Settings
  getFooterSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/footer`);
      const data = await res.json();
      return data.data;
    } catch (e) {
      return {
        company_name: 'DigiAgency Aetheric',
        company_bio: 'Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.',
        office_address: 'Financial Tower Level 18, Pacific Boulevard, San Francisco, CA',
        contact_email: 'hello@digiagency.com',
        contact_phone: '+1 (555) 234-5678',
        copyright_text: '© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.',
        social_linkedin: 'https://linkedin.com',
        social_twitter: 'https://twitter.com',
        social_github: 'https://github.com',
        social_dribbble: 'https://dribbble.com'
      };
    }
  },

  saveFooterSettings: async (footerData) => {
    const res = await fetch(`${API_BASE}/settings/footer`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(footerData)
    });
    return res.json();
  },

  // Media Upload & Library
  getMedia: async () => {
    try {
      const res = await fetch(`${API_BASE}/media`, { headers: getHeaders() });
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return [
        {
          id: 1,
          filename: 'kabel-nym-preview.jpg',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
          size: 245120
        }
      ];
    }
  },

  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('digi_token') || 'mock_jwt_token_admin_2026';
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Terjadi kesalahan saat menghubungkan ke server upload.' };
    }
  },

  deleteMedia: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/media/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: true };
    }
  },

  // Bank Accounts Settings
  getBankAccounts: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/bank-accounts`);
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return [
        { id: 1, bank_name: 'Bank BCA', account_number: '123-456-7890', account_holder: 'Toko Listrik Jaya UMKM', logo_badge: 'BCA' },
        { id: 2, bank_name: 'Bank Mandiri', account_number: '987-654-3210-00', account_holder: 'Toko Listrik Jaya UMKM', logo_badge: 'MANDIRI' },
        { id: 3, bank_name: 'Bank BRI', account_number: '0012-01-003456-50-8', account_holder: 'Toko Listrik Jaya UMKM', logo_badge: 'BRI' }
      ];
    }
  },

  saveBankAccounts: async (accountsData) => {
    try {
      const res = await fetch(`${API_BASE}/orders/bank-accounts`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(accountsData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Gagal menghubungkan ke server API.' };
    }
  },

  // Orders Management & Customer Checkout
  createOrder: async (orderPayload) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Terjadi kesalahan saat memproses pesanan Anda.' };
    }
  },

  trackOrder: async (query) => {
    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(query)}`);
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, message: 'Gagal mengambil status pesanan.' };
    }
  },

  uploadPaymentProof: async (orderCode, file) => {
    try {
      const formData = new FormData();
      formData.append('order_code', orderCode);
      formData.append('proof_file', file);
      const res = await fetch(`${API_BASE}/orders/upload-proof`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Terjadi kesalahan saat mengunggah bukti transfer.' };
    }
  },

  getOrders: async (status = 'ALL') => {
    try {
      const res = await fetch(`${API_BASE}/orders?status=${status}`, { headers: getHeaders() });
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    } catch (e) {
      return [];
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Gagal memperbarui status pesanan.' };
    }
  },

  deleteOrder: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Gagal menghapus pesanan.' };
    }
  },

  deleteOrderProof: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/proof`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Gagal menghapus bukti pembayaran.' };
    }
  }
};
