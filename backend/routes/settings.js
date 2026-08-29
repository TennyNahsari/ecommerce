const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryFooter = {
  company_name: 'Toko Listrik Jaya UMKM',
  company_bio: 'Pusat grosir & eceran peralatan listrik terpercaya untuk kebutuhan rumah tangga, instalasi gedung, toko, dan UMKM. Produk 100% berkualitas & berstandar SNI.',
  office_address: 'Jl. Listrik Raya No. 45, Kompleks Niaga UMKM, Jakarta Pusat, DKI Jakarta',
  contact_email: 'sales@tokolistrikjaya.com',
  contact_phone: '+62 812-3456-7890',
  copyright_text: '© 2026 Toko Listrik Jaya UMKM. Seluruh Hak Cipta Dilindungi.',
  social_instagram: 'https://instagram.com',
  social_twitter: 'https://twitter.com',
  social_threads: 'https://threads.net',
  social_facebook: 'https://facebook.com',
  social_linkedin: 'https://linkedin.com',
  social_youtube: 'https://youtube.com'
};

// GET /api/settings/footer (Public)
router.get('/footer', async (req, res) => {
  try {
    const result = await db.query("SELECT value FROM site_settings WHERE key = 'footer'");
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].value });
    }
    return res.json({ success: true, data: memoryFooter });
  } catch (err) {
    return res.json({ success: true, data: memoryFooter });
  }
});

// PUT /api/settings/footer (Admin)
router.put('/footer', verifyToken, async (req, res) => {
  const footerData = req.body;
  try {
    const result = await db.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ('footer', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING value",
      [JSON.stringify(footerData)]
    );
    return res.json({ success: true, data: result.rows[0].value });
  } catch (err) {
    memoryFooter = { ...memoryFooter, ...footerData };
    return res.json({ success: true, data: memoryFooter });
  }
});

module.exports = router;
