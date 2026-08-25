const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

let memoryCategories = [
  { id: 1, name: 'Kabel & Instalasi Listrik', slug: 'kabel-instalasi-listrik', order_index: 1 },
  { id: 2, name: 'Stop Kontak, Sakelar & Steker', slug: 'stop-kontak-sakelar-steker', order_index: 2 },
  { id: 3, name: 'Lampu & Penghemat Energi', slug: 'lampu-penghemat-energi', order_index: 3 },
  { id: 4, name: 'Komponen & Pengaman Listrik', slug: 'komponen-pengaman-listrik', order_index: 4 }
];

let memoryServices = [];

// Helper to delete local uploaded image file from disk and media table
function deleteLocalImageFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  
  // Check if imageUrl points to a local upload file (/uploads/...)
  if (imageUrl.includes('/uploads/')) {
    const filename = imageUrl.split('/uploads/').pop();
    if (filename) {
      const cleanFilename = filename.split('?')[0]; // Strip query string if any
      const filePath = path.join(__dirname, '../uploads', cleanFilename);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted associated product image file: ${cleanFilename}`);
        }
      } catch (err) {
        console.error(`⚠️ Failed to delete image file ${cleanFilename}:`, err.message);
      }

      // Also clean up from media table if exists
      const dbPath = `/uploads/${cleanFilename}`;
      db.query('DELETE FROM media WHERE filepath = $1 OR filepath LIKE $2', [dbPath, `%${cleanFilename}`])
        .catch(() => {});
    }
  }
}

// ==========================================
// CATEGORIES ROUTES (MUST BE DEFINED FIRST)
// ==========================================

// GET /api/services/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM service_categories ORDER BY order_index ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryCategories });
  }
});

// POST /api/services/categories (Admin)
router.post('/categories', verifyToken, async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  try {
    const result = await db.query(
      'INSERT INTO service_categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug RETURNING *',
      [name, cleanSlug, description || '']
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    const newCat = {
      id: Date.now(),
      name,
      slug: cleanSlug,
      description: description || '',
      order_index: memoryCategories.length + 1
    };
    memoryCategories.push(newCat);
    return res.status(201).json({ success: true, data: newCat });
  }
});

// DELETE /api/services/categories/:id (Admin)
router.delete('/categories/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM service_categories WHERE id = $1', [parseInt(id)]);
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    memoryCategories = memoryCategories.filter(c => c.id !== parseInt(id));
    return res.json({ success: true, message: 'Category deleted' });
  }
});

// ==========================================
// SERVICES COLLECTION ROUTES
// ==========================================

// GET /api/services (Public List)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, sc.name as category_name, sc.slug as category_slug 
      FROM services s 
      LEFT JOIN service_categories sc ON s.category_id = sc.id 
      ORDER BY s.order_index ASC, s.id ASC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.json({ success: true, data: memoryServices });
  }
});

// POST /api/services (Admin - Create)
router.post('/', verifyToken, async (req, res) => {
  const { title, slug, category_id, icon_name, summary, description, features, image_url, order_index, price } = req.body;
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;
  const cleanPrice = parseFloat(price) || 0;
  
  try {
    const result = await db.query(
      'INSERT INTO services (title, slug, category_id, icon_name, summary, description, features, image_url, order_index, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, image_url || '', order_index || 0, cleanPrice]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Services Create Error:', err.message);
    const newService = {
      id: Date.now(),
      title,
      slug: cleanSlug,
      category_id: cleanCatId,
      icon_name: icon_name || 'Layout',
      summary: summary || '',
      description: description || '',
      features: Array.isArray(features) ? features : JSON.parse(featuresJson),
      image_url: image_url || '',
      order_index: order_index || memoryServices.length + 1,
      price: cleanPrice
    };
    memoryServices.push(newService);
    return res.status(201).json({ success: true, data: newService });
  }
});

// ==========================================
// DYNAMIC ITEM PARAMETER ROUTES (DEFINED LAST)
// ==========================================

// GET /api/services/:id (Public Item Detail)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const isIdNum = !isNaN(id);
    const queryStr = isIdNum 
      ? 'SELECT s.*, sc.name as category_name, sc.slug as category_slug FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.id = $1 OR s.slug = $2'
      : 'SELECT s.*, sc.name as category_name, sc.slug as category_slug FROM services s LEFT JOIN service_categories sc ON s.category_id = sc.id WHERE s.slug = $1';
    const params = isIdNum ? [parseInt(id), id] : [id];
    
    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    const item = memoryServices.find(s => s.id === parseInt(id) || s.slug === id);
    if (!item) return res.status(404).json({ success: false, message: 'Service not found.' });
    return res.json({ success: true, data: item });
  }
});

// PUT /api/services/:id (Admin - Update Item)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, slug, category_id, icon_name, summary, description, features, image_url, order_index, price } = req.body;
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const cleanSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanCatId = (category_id && !isNaN(category_id)) ? parseInt(category_id) : null;
  const cleanPrice = parseFloat(price) || 0;

  try {
    const isIdNum = !isNaN(id);

    // Retrieve old image_url before updating to clean up replaced local file
    const oldRes = await db.query(
      isIdNum ? 'SELECT image_url FROM services WHERE id = $1 OR slug = $2' : 'SELECT image_url FROM services WHERE slug = $1',
      isIdNum ? [parseInt(id), id] : [id]
    );
    if (oldRes.rows.length > 0) {
      const oldImg = oldRes.rows[0].image_url;
      if (oldImg && image_url && oldImg !== image_url) {
        deleteLocalImageFile(oldImg);
      }
    }

    const queryStr = isIdNum
      ? 'UPDATE services SET title = $1, slug = $2, category_id = $3, icon_name = $4, summary = $5, description = $6, features = $7, image_url = $8, order_index = $9, price = $10 WHERE id = $11 OR slug = $12 RETURNING *'
      : 'UPDATE services SET title = $1, slug = $2, category_id = $3, icon_name = $4, summary = $5, description = $6, features = $7, image_url = $8, order_index = $9, price = $10 WHERE slug = $11 RETURNING *';
    const params = isIdNum 
      ? [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, image_url || '', order_index || 0, cleanPrice, parseInt(id), id]
      : [title, cleanSlug, cleanCatId, icon_name || 'Layout', summary || '', description || '', featuresJson, image_url || '', order_index || 0, cleanPrice, id];

    const result = await db.query(queryStr, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found to update' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Services Update Error:', err.message);
    const idx = memoryServices.findIndex(s => s.id === parseInt(id) || s.slug === id);
    if (idx !== -1) {
      const oldImg = memoryServices[idx].image_url;
      if (oldImg && image_url && oldImg !== image_url) {
        deleteLocalImageFile(oldImg);
      }
      memoryServices[idx] = {
        ...memoryServices[idx],
        title,
        slug: cleanSlug,
        category_id: cleanCatId,
        icon_name: icon_name || memoryServices[idx].icon_name,
        summary: summary || memoryServices[idx].summary,
        description: description || memoryServices[idx].description,
        features: Array.isArray(features) ? features : JSON.parse(featuresJson),
        image_url: image_url || memoryServices[idx].image_url,
        order_index: order_index || memoryServices[idx].order_index,
        price: cleanPrice
      };
      return res.json({ success: true, data: memoryServices[idx] });
    }
    return res.status(404).json({ success: false, message: 'Service not found to update' });
  }
});

// DELETE /api/services/:id (Admin - Delete Item)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const isIdNum = !isNaN(id);

  try {
    // Fetch product record first to delete its associated local image file
    const findQuery = isIdNum
      ? 'SELECT image_url FROM services WHERE id = $1 OR slug = $2'
      : 'SELECT image_url FROM services WHERE slug = $1';
    const findParams = isIdNum ? [parseInt(id), id] : [id];
    const itemRes = await db.query(findQuery, findParams);

    if (itemRes.rows.length > 0 && itemRes.rows[0].image_url) {
      deleteLocalImageFile(itemRes.rows[0].image_url);
    }

    await db.query('DELETE FROM services WHERE id = $1 OR slug = $2', [isIdNum ? parseInt(id) : -1, id]);
    return res.json({ success: true, message: 'Product and associated image file deleted successfully' });
  } catch (err) {
    const idx = memoryServices.findIndex(s => s.id === parseInt(id) || s.slug === id);
    if (idx !== -1) {
      const item = memoryServices[idx];
      if (item && item.image_url) {
        deleteLocalImageFile(item.image_url);
      }
      memoryServices.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  }
});

module.exports = router;
