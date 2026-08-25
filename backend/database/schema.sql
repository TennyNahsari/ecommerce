-- UMKM Peralatan Listrik PostgreSQL Database Schema
-- Complete Table DDL & Seed Data for Electrical Equipment Store & CMS

-- 1. Site Settings Table (Footer & Global Configs)
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (key, value) VALUES (
    'footer',
    '{
        "company_name": "Toko Listrik Jaya UMKM",
        "company_bio": "Pusat grosir & eceran peralatan listrik terpercaya untuk kebutuhan rumah tangga, instalasi gedung, toko, dan UMKM. Produk 100% berkualitas & berstandar SNI.",
        "office_address": "Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta",
        "contact_email": "sales@tokolistrikjaya.com",
        "contact_phone": "+62 812-3456-7890",
        "copyright_text": "© 2026 Toko Listrik Jaya UMKM. Seluruh Hak Cipta Dilindungi. Powered by Express & PostgreSQL.",
        "social_linkedin": "https://linkedin.com",
        "social_twitter": "https://twitter.com",
        "social_github": "https://github.com",
        "social_dribbble": "https://dribbble.com"
    }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Service Categories Table (Electrical Categories)
CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

TRUNCATE TABLE service_categories CASCADE;

INSERT INTO service_categories (id, name, slug, description, order_index) VALUES
(1, 'Kabel & Instalasi Listrik', 'kabel-instalasi-listrik', 'Kabel tembaga murni NYM, NYA, serabut fleksibel, serta pipa pelindung conduit & klem instalasi.', 1),
(2, 'Stop Kontak, Sakelar & Steker', 'stop-kontak-sakelar-steker', 'Stop kontak arde multi-lubang, sakelar engkel/ganda inbow-outbow, dan steker tahan panas.', 2),
(3, 'Lampu & Penghemat Energi', 'lampu-penghemat-energi', 'Lampu LED hemat listrik, downlight plafon, lampu sorot outdoor waterproof garansi resmi.', 3),
(4, 'Komponen & Pengaman Listrik', 'komponen-pengaman-listrik', 'MCB pemutus arus pendek, box sikring, fitting lampu gantung, dan peralatan tes tegangan.', 4);

SELECT setval('service_categories_id_seq', (SELECT MAX(id) FROM service_categories));

-- 3. Users Table (Admin Credentials)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@tokolistrikjaya.com', '$2a$10$w8gZt.98sJpC49tP3N.4/eRkH2k5rJvD4yJbZq8wM2p3u5v6x7y8z9', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 4. Hero Sliders Table
CREATE TABLE IF NOT EXISTS sliders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge_text VARCHAR(100),
    image_url TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE sliders CASCADE;

INSERT INTO sliders (id, title, subtitle, badge_text, image_url, cta_text, cta_link, order_index, is_active) VALUES
(1, 'Pusat Peralatan Listrik UMKM Terlengkap', 'Solusi kebutuhan kabel, stop kontak, sakelar, lampu LED, dan pengaman listrik berkualitas SNI dengan harga grosir & eceran.', 'PROMO SPESIAL UMKM', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200', 'Lihat Katalog Produk', '#services', 1, true),
(2, 'Lampu LED Hemat Energi Garansi Resmi', 'Hemat penggunaan listrik hingga 85% untuk rumah dan toko Anda. Tersedia berbagai ukuran Watt dan garansi resmi hingga 1 tahun.', 'HEMAT ENERGI 85%', 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200', 'Jelajahi Produk Lampu', '#services', 2, true);

SELECT setval('sliders_id_seq', (SELECT MAX(id) FROM sliders));

-- 5. Services Table (Electrical Equipment Products / Services)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category_id INT REFERENCES service_categories(id) ON DELETE SET NULL,
    icon_name VARCHAR(100),
    summary TEXT,
    description TEXT,
    features JSONB,
    image_url TEXT,
    order_index INT DEFAULT 0,
    price NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;

TRUNCATE TABLE services CASCADE;

INSERT INTO services (id, title, slug, category_id, icon_name, summary, description, features, image_url, order_index, price) VALUES
-- Category 1: Kabel & Instalasi Listrik (3 items)
(1, 'Kabel Listrik NYM 2x1.5mm Tembaga Murni', 'kabel-nym-2x1-5mm', 1, 'Zap', 'Kabel kawat tembaga murni isi 2 berlapis PVC ganda aman untuk instalasi listrik tanam dinding.', '<h2>Kabel Listrik Berkualitas Standar SNI</h2><p>Kabel NYM 2x1.5mm sangat cocok digunakan untuk instalasi penerangan dan stop kontak rumah tinggal. Dibuat dari kawat tembaga murni berkualitas tinggi dengan isolasi PVC tebal yang tahan panas dan arus pendek.</p>', '["Standard Nasional Indonesia (SNI)", "Konduktor Tembaga Murni 99.9%", "Isolasi Double Layer Tahan Panas", "Panjang Roll 50m / 100m"]'::jsonb, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800', 1, 385000),

(2, 'Kabel Serabut Fleksibel NYMHY 2x0.75mm', 'kabel-serabut-nymhy-2x0-75mm', 1, 'Cpu', 'Kabel fleksibel lentur sangat ideal untuk sambungan elektronik, lampu gantung, dan peralatan rumah.', '<h2>Solusi Kabel Lentur Fleksibel</h2><p>Kabel NYMHY 2x0.75mm memiliki serat tembaga halus yang mudah dibengkokkan tanpa mudah putus. Cocok untuk perpanjangan colokan listrik dan alat rumah tangga seperti kipas angin, TV, dan lampu.</p>', '["Kawat Tembaga Serabut Halus", "Sangat Lentur & Mudah Dipasang", "Anti Panas & Tidak Mudah Getas", "Pilihan Warna Putih & Hitam"]'::jsonb, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800', 2, 165000),

(3, 'Pipa Conduit PVC 20mm & Accessories Set', 'pipa-conduit-pvc-20mm', 1, 'Shield', 'Pipa pelindung kabel dari gigitan tikus dan benturan keras, lengkap dengan klem dan elbow.', '<h2>Proteksi Maksimal Instalasi Listrik</h2><p>Pipa conduit PVC berdiameter 20mm melindungi jalur kabel dari kerusakan fisik, kelembapan dinding, dan bahaya gigitan hama. Tahan pembakaran (self-extinguishing).</p>', '["Bahan PVC High-Impact Tahan Benturan", "Self-Extinguishing (Anti Api Meredam)", "Lengkap Elbow, Tee, & Klem Dinding", "Tersedia Ukuran 20mm & 25mm"]'::jsonb, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800', 3, 35000),

-- Category 2: Stop Kontak, Sakelar & Steker (3 items)
(4, 'Stop Kontak Arde 4 Lubang + Sakelar Indikator', 'stop-kontak-arde-4-lubang', 2, 'Power', 'Stop kontak multi-soket dengan kabel 3 meter, sakelar sentral, dan sistem pengaman anak (child safety).', '<h2>Stop Kontak Aman & Tahan Panas</h2><p>Stop kontak arde 4 colokan dilengkapi plat kuningan tebal dan pengaman otomatis grounding. Menggunakan material poly-carbonate tahan panas hingga 850 derajat Celcius.</p>', '["4 Lubang Colokan Arde Kuningan", "Kabel Tembaga Murni Panjang 3 Meter", "Sakelar On/Off Indikator LED", "Child Safety Shutter Locking"]'::jsonb, 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800', 4, 68000),

(5, 'Sakelar Ganda Double Inbow Tanam Dinding', 'sakelar-ganda-double-inbow', 2, 'ToggleLeft', 'Sakelar tanam dinding 2 tombol dengan desain minimalis elegan dan kontak kuningan presisi.', '<h2>Sakelar Minimalis Berkualitas Modern</h2><p>Sakelar ganda inbow cocok untuk menyalakan 2 jalur lampu secara terpisah. Menggunakan mekanisme cetekan yang halus dan awet digunakan puluhan ribu kali.</p>', '["Material Bakelite Tahan Bakar", "Terminal Screw Kuningan Presisi", "Desain Minimalis Inbow Dinding", "Daya Kendali Hingga 10A 250V"]'::jsonb, 'https://images.unsplash.com/photo-1545259742-b4d6a576d729?q=80&w=800', 5, 24500),

(6, 'Steker Arde Heavy Duty Tahan Panas 16A', 'steker-arde-heavy-duty', 2, 'Plug', 'Steker listrik male heavy duty cocok untuk peralatan daya besar seperti AC, kulkas, dan mesin.', '<h2>Steker Kualitas Industri & Rumah</h2><p>Steker arde berbahan karet sintetis elastis tahan banting dan kuningan jepit tebal yang tidak gampang kendur atau memicu percikan api.</p>', '["Kapasitas Beban Hingga 16A 3500W", "Pin Kuningan Solid Tebal", "Casing Tahan Banting & Panas", "Mudah Dipasang Kencang"]'::jsonb, 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?q=80&w=800', 6, 18500),

-- Category 3: Lampu & Penghemat Energi (3 items)
(7, 'Lampu LED Bulb 12W Super Bright White', 'lampu-led-bulb-12w', 3, 'Sun', 'Lampu bohlam LED 12 Watt setara lampu pijar 100W dengan efisiensi energi 85% dan cahaya terang merata.', '<h2>Pencahayaan Terang Hemat Biaya</h2><p>Lampu LED Bulb 12W menghasilkan cahaya putih bersih (Cool Daylight 6500K) tanpa gelombang UV berbahaya. Ramah lingkungan dan tidak menyilaukan mata.</p>', '["Daya 12W Setara Pijar 100W", "Intensitas Cahaya 1200 Lumens", "Umur Pakai Hingga 15.000 Jam", "Garansi Toko Resmi 1 Tahun"]'::jsonb, 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=800', 7, 42000),

(8, 'Lampu Downlight LED Panel Outbow 9W', 'lampu-downlight-led-9w', 3, 'Disc', 'Lampu plafon downlight model menempel (outbow) ramping, mudah dipasang tanpa perlu bobok plafon.', '<h2>Penerangan Plafon Minimalis</h2><p>Downlight LED Panel 9W dengan diffuser mika berkualitas tinggi yang menyebarkan cahaya secara halus dan estetik untuk ruang tamu, toko, dan kantor.</p>', '["Pemasangan Outbow Ramping Modern", "Konsumsi Daya Irit 9 Watt", "Frame Aluminium Disipasi Panas", "Tersedia Warm White & Cool White"]'::jsonb, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800', 8, 55000),

(9, 'Lampu Sorot LED Outdoor 50W IP66 Waterproof', 'lampu-sorot-led-outdoor-50w', 3, 'Eye', 'Lampu tembak outdoor tahan hujan deras dan debu, sangat cocok untuk sorot toko, papan nama, & lapangan.', '<h2>Lampu Sorot Outdoor Tahan Cuaca</h2><p>Lampu sorot LED 50W outdoor menggunakan casing kaca tempered tahan benturan dan struktur aluminium waterproof IP66. Sangat terang untuk pencahayaan malam hari.</p>', '["Standar Ketahanan Air & Debu IP66", "Daya Terang 5000 Lumens", "Body Aluminium Die-Cast Solid", "Garansi Tukar Baru 6 Bulan"]'::jsonb, 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800', 9, 175000),

-- Category 4: Komponen & Pengaman Listrik (3 items)
(10, 'MCB Pemutus Arus 1 Phase 16A Original', 'mcb-pengaman-listrik-16a', 4, 'Sliders', 'Sikring otomatis pemutus arus pendek (korsleting) dan beban lebih kapasitas 3500VA.', '<h2>Perlindungan Utama Instalasi Listrik</h2><p>MCB 1 Phase 16A merupakan komponen wajib untuk keamanan arus listrik. Memutus aliran secara otomatis saat terjadi korsleting atau pemakaian listrik berlebih.</p>', '["Kapasitas Arus 16 Ampere (3500W)", "Response Time Pemutus Sangat Cepat", "Sertifikasi SNI & IEC 60898", "Bisa Dipasang Pada Rel Din-Rail"]'::jsonb, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800', 10, 62000),

(11, 'Fitting Lampu Gantung + Stop Kontak Kombinasi', 'fitting-lampu-kombinasi-stop-kontak', 4, 'Box', 'Fitting lampu gantung praktis yang dilengkapi colokan listrik samping untuk kemudahan kerja.', '<h2>Fitting Multifungsi Praktis</h2><p>Fitting kombinasi E27 berbahan kuningan tahan panas dengan 2 lubang colokan tambahan di sisi samping. Solusi praktis untuk warung dan bengkel.</p>', '["Drat Lampu Standar E27", "Dilengkapi 2 Colokan Listrik Samping", "Bahan Kuningan Anti Korosi", "Ringan & Mudah Dipasang"]'::jsonb, 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800', 11, 15000),

(12, 'Paket Testpen Digital & Tang Potong Kabel', 'testpen-digital-tang-potong-set', 4, 'Wrench', 'Set perkakas wajib untuk pengecekan tegangan listrik AC/DC aman dan tang potong kabel presisi.', '<h2>Perkakas Teknisi & Teknisi Listrik</h2><p>Paket alat ukur testpen LCD indikator tegangan tanpa sentuh direct contact, lengkap dengan tang potong berbahan baja lapis isolasi karet tebal aman genggaman.</p>', '["Testpen Indikator Digital LCD", "Tang Potong Baja Chrome Vanadium", "Gagang Karet Lapisan Isolasi 1000V", "Praktis Untuk Pemeliharaan Listrik"]'::jsonb, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800', 12, 85000);

SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

-- 6. Categories Table (for Blog Articles)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

TRUNCATE TABLE categories CASCADE;

INSERT INTO categories (id, name, slug) VALUES
(1, 'Tips & Keamanan Listrik', 'tips-keamanan-listrik'),
(2, 'Panduan Instalasi Rumah', 'panduan-instalasi-rumah'),
(3, 'Teknologi & Hemat Energi', 'teknologi-hemat-energi');

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 7. Posts Table (Blog Articles)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    excerpt TEXT,
    content_html TEXT,
    featured_image TEXT,
    meta_title VARCHAR(255),
    meta_desc TEXT,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE posts CASCADE;

INSERT INTO posts (id, title, slug, category_id, excerpt, content_html, featured_image, meta_title, meta_desc, status) VALUES
(1, '5 Cara Efektif Mencegah Korsleting Listrik di Rumah & Tempat Usaha', 'cara-mencegah-korsleting-listrik', 1, 'Korsleting listrik merupakan salah satu penyebab utama kebocoran arus dan kebakaran. Simak tips aman memilih kabel dan pengaman MCB standar SNI.', '<h2>Mengapa Korsleting Listrik Sangat Berbahaya?</h2><p>Korsleting listrik terjadi ketika kabel positif dan negatif bersentuhan langsung tanpa hambatan. Hal ini menyebabkan lonjakan arus sangat tinggi dan panas ekstrem yang dapat memicu percikan api.</p><h2>Tips Penting Keamanan Listrik:</h2><ol><li>Gunakan kabel berstandar SNI dengan ketebalan kawat yang sesuai beban.</li><li>Hindari menumpuk stop kontak berlebihan pada satu colokan wall outlet.</li><li>Pastikan MCB pemutus arus terpasang dengan baik di kWh meter.</li></ol>', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000', 'Cara Mencegah Korsleting Listrik | Toko Listrik Jaya UMKM', 'Panduan keamanan listrik rumah dan tempat usaha untuk mencegah bahaya korsleting.', 'PUBLISHED'),

(2, 'Panduan Memilih Jenis Kabel Listrik yang Tepat untuk Instalasi', 'panduan-memilih-jenis-kabel-listrik', 2, 'Kabel NYM, NYA, dan NYMHY memiliki fungsi dan karakteristik berbeda. Jangan salah pilih agar instalasi tetap aman dan bertahan lama.', '<h2>Mengenal Jenis-Jenis Kabel Listrik Umum</h2><p>Setiap tipe kabel dirancang khusus untuk kondisi lingkungan dan jenis beban tertentu. Memilih kabel yang tidak tepat dapat menyebabkan kabel cepat rapuh atau leleh.</p><h2>Perbedaan Utama Tipe Kabel:</h2><ul><li><strong>Kabel NYM:</strong> Kawat tembaga tunggal berlapis PVC ganda, sangat aman untuk tanam dinding indoor.</li><li><strong>Kabel NYA:</strong> Kabel kawat tunggal lapis tunggal, wajib menggunakan pipa pelindung conduit.</li><li><strong>Kabel NYMHY/NYYHY:</strong> Kabel kawat serabut lentur, mudah digulung untuk colokan fleksibel.</li></ul>', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000', 'Panduan Memilih Jenis Kabel Listrik | Toko Listrik Jaya UMKM', 'Pelajari perbedaan kabel NYM, NYA, dan NYMHY untuk kebutuhan instalasi listrik Anda.', 'PUBLISHED'),

(3, 'Keuntungan Beralih ke Lampu LED untuk Efisiensi Listrik UMKM', 'keuntungan-lampu-led-efisiensi-umkm', 3, 'Tagihan listrik membengkak? Pelajari bagaimana teknologi lampu LED dapat menghemat biaya operasional usaha hingga 85%.', '<h2>Mengapa Harus Beralih ke Lampu LED?</h2><p>Lampu LED (Light Emitting Diode) menyulap energi listrik menjadi cahaya secara efisien tanpa banyak terbuang menjadi panas. Hal ini membuat pemakaian listrik jauh lebih irit dibanding lampu pijar konvensional.</p><h2>Manfaat Utama Lampu LED:</h2><ul><li>Menghemat hingga 85% konsumsi daya listrik.</li><li>Umur pakai panjang hingga 15.000 - 25.000 jam pencahayaan.</li><li>Bebas radiasi UV dan mercury ramah lingkungan.</li></ul>', 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1000', 'Keuntungan Lampu LED Hemat Energi | Toko Listrik Jaya UMKM', 'Solusi penghematan biaya listrik toko dan usaha UMKM dengan lampu LED garansi resmi.', 'PUBLISHED');

SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));

-- 8. Header Menus Table
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE
);

TRUNCATE TABLE menus CASCADE;

INSERT INTO menus (id, label, url, order_index, is_external) VALUES
(1, 'Beranda', '#hero', 1, false),
(2, 'Katalog Produk', '#services', 2, false),
(3, 'Tentang Kami', '#about', 3, false),
(4, 'Artikel & Tips', '#blog', 4, false),
(5, 'Kontak & Pemesanan', '#contact', 5, false);

SELECT setval('menus_id_seq', (SELECT MAX(id) FROM menus));

-- 9. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(200),
    category_id INT,
    category VARCHAR(100),
    thumbnail_url TEXT,
    summary TEXT,
    outcomes JSONB,
    content_html TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE projects CASCADE;

-- 10. Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_blocks JSONB,
    custom_html_css TEXT,
    meta_seo JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Media Library Table
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,
    mimetype VARCHAR(100),
    size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(200),
    budget VARCHAR(100),
    service_interest VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Bank Accounts Seed in site_settings
INSERT INTO site_settings (key, value) VALUES (
    'bank_accounts',
    '[
        {
            "id": 1,
            "bank_name": "Bank BCA",
            "account_number": "123-456-7890",
            "account_holder": "Toko Listrik Jaya UMKM",
            "logo_badge": "BCA"
        },
        {
            "id": 2,
            "bank_name": "Bank Mandiri",
            "account_number": "987-654-3210-00",
            "account_holder": "Toko Listrik Jaya UMKM",
            "logo_badge": "MANDIRI"
        },
        {
            "id": 3,
            "bank_name": "Bank BRI",
            "account_number": "0012-01-003456-50-8",
            "account_holder": "Toko Listrik Jaya UMKM",
            "logo_badge": "BRI"
        }
    ]'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 14. E-Commerce Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    notes TEXT,
    payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
    bank_account_info TEXT,
    total_amount NUMERIC(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING_PAYMENT',
    proof_of_payment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. E-Commerce Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    service_id INT,
    product_title VARCHAR(255) NOT NULL,
    price NUMERIC(12,2) DEFAULT 0,
    quantity INT DEFAULT 1,
    subtotal NUMERIC(12,2) DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
