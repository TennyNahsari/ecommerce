const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memorySliders = [
  {
    id: 1,
    title: 'Pusat Peralatan Listrik UMKM Terlengkap',
    subtitle: 'Solusi kebutuhan kabel, stop kontak, sakelar, lampu LED, dan pengaman listrik berkualitas SNI dengan harga grosir & eceran.',
    badge_text: 'PROMO SPESIAL UMKM',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200',
    cta_text: 'Lihat Katalog Produk',
    cta_link: '#services',
    order_index: 1,
    is_active: true
  },
  {
    id: 2,
    title: 'Lampu LED Hemat Energi Garansi Resmi',
    subtitle: 'Hemat penggunaan listrik hingga 85% untuk rumah dan toko Anda. Tersedia berbagai ukuran Watt dan garansi resmi hingga 1 tahun.',
    badge_text: 'HEMAT ENERGI 85%',
    image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200',
    cta_text: 'Jelajahi Produk Lampu',
    cta_link: '#services',
    order_index: 2,
    is_active: true
  }
];

// GET /api/sliders (Public)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sliders WHERE is_active IS NOT FALSE ORDER BY order_index ASC, id ASC');
    if (result.rows && result.rows.length > 0) {
      return res.json({ success: true, data: result.rows });
    }
    return res.json({ success: true, data: memorySliders });
  } catch (err) {
    return res.json({ success: true, data: memorySliders });
  }
});

// POST /api/sliders (Admin)
router.post('/', verifyToken, async (req, res) => {
  const { title, subtitle, badge_text, image_url, cta_text, cta_link, order_index } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO sliders (title, subtitle, badge_text, image_url, cta_text, cta_link, order_index, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
      [title, subtitle, badge_text, image_url, cta_text, cta_link, order_index || 0]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newSlide = {
      id: Date.now(),
      title, subtitle, badge_text, image_url, cta_text, cta_link, order_index: order_index || memorySliders.length + 1, is_active: true
    };
    memorySliders.push(newSlide);
    return res.status(201).json({ success: true, data: newSlide });
  }
});

// PUT /api/sliders/:id (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, badge_text, image_url, cta_text, cta_link, order_index, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE sliders SET title = $1, subtitle = $2, badge_text = $3, image_url = $4, cta_text = $5, cta_link = $6, order_index = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [title, subtitle, badge_text, image_url, cta_text, cta_link, order_index || 0, is_active !== false, id]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    memorySliders = memorySliders.map(s => s.id === parseInt(id) ? { ...s, title, subtitle, badge_text, image_url, cta_text, cta_link, order_index, is_active: is_active !== false } : s);
    return res.json({ success: true, message: 'Slide updated successfully.' });
  }
});

// DELETE /api/sliders/:id (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM sliders WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Slide deleted successfully.' });
  } catch (err) {
    memorySliders = memorySliders.filter(s => s.id !== parseInt(id));
    return res.json({ success: true, message: 'Slide deleted successfully.' });
  }
});

module.exports = router;
