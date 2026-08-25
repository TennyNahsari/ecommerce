const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

function deleteLocalProofFile(proofUrl) {
  if (!proofUrl || typeof proofUrl !== 'string') return;
  if (proofUrl.includes('/uploads/')) {
    const filename = proofUrl.split('/uploads/').pop();
    if (filename) {
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted proof file: ${filePath}`);
        } catch (e) {
          console.error(`Failed to delete proof file: ${e.message}`);
        }
      }
    }
  }
}

let memoryOrders = [];
let memoryBankAccounts = [
  {
    id: 1,
    bank_name: 'Bank BCA',
    account_number: '123-456-7890',
    account_holder: 'Toko Listrik Jaya UMKM',
    logo_badge: 'BCA'
  },
  {
    id: 2,
    bank_name: 'Bank Mandiri',
    account_number: '987-654-3210-00',
    account_holder: 'Toko Listrik Jaya UMKM',
    logo_badge: 'MANDIRI'
  },
  {
    id: 3,
    bank_name: 'Bank BRI',
    account_number: '0012-01-003456-50-8',
    account_holder: 'Toko Listrik Jaya UMKM',
    logo_badge: 'BRI'
  }
];

let memoryQris = {
  qris_name: 'QRIS Toko Listrik Jaya UMKM',
  qris_image_url: null
};

// Helper to generate unique order code: TLJ-20260825-8A92
function generateOrderCode() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TLJ-${dateStr}-${randomStr}`;
}

// GET /api/orders/bank-accounts (Public)
router.get('/bank-accounts', async (req, res) => {
  try {
    const result = await db.query("SELECT value FROM site_settings WHERE key = 'bank_accounts'");
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].value });
    }
    return res.json({ success: true, data: memoryBankAccounts });
  } catch (err) {
    return res.json({ success: true, data: memoryBankAccounts });
  }
});

// PUT /api/orders/bank-accounts (Admin)
router.put('/bank-accounts', verifyToken, async (req, res) => {
  const accountsData = req.body;
  try {
    const result = await db.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ('bank_accounts', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING value",
      [JSON.stringify(accountsData)]
    );
    return res.json({ success: true, data: result.rows[0].value });
  } catch (err) {
    memoryBankAccounts = accountsData;
    return res.json({ success: true, data: memoryBankAccounts });
  }
});

// GET /api/orders/qris (Public)
router.get('/qris', async (req, res) => {
  try {
    const result = await db.query("SELECT value FROM site_settings WHERE key = 'qris_settings'");
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0].value });
    }
    return res.json({ success: true, data: memoryQris });
  } catch (err) {
    return res.json({ success: true, data: memoryQris });
  }
});

// POST /api/orders/qris (Admin - Upload/Update QRIS Barcode Image)
router.post('/qris', verifyToken, upload.single('qris_file'), async (req, res) => {
  const qris_name = req.body.qris_name || 'QRIS Toko Listrik Jaya UMKM';
  let fullUrl = null;

  if (req.file) {
    const filepath = `/uploads/${req.file.filename}`;
    fullUrl = `${req.protocol}://${req.get('host')}${filepath}`;
  }

  try {
    const existingRes = await db.query("SELECT value FROM site_settings WHERE key = 'qris_settings'");
    let oldUrl = null;
    if (existingRes.rows.length > 0) {
      oldUrl = existingRes.rows[0].value?.qris_image_url;
    } else {
      oldUrl = memoryQris.qris_image_url;
    }

    if (req.file && oldUrl) {
      deleteLocalProofFile(oldUrl);
    }

    const updatedData = {
      qris_name,
      qris_image_url: fullUrl || oldUrl,
      updated_at: new Date().toISOString()
    };

    const result = await db.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ('qris_settings', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING value",
      [JSON.stringify(updatedData)]
    );

    memoryQris = updatedData;
    return res.json({
      success: true,
      message: 'Gambar QRIS berhasil diperbarui.',
      data: result.rows[0].value
    });
  } catch (err) {
    if (req.file && memoryQris.qris_image_url) {
      deleteLocalProofFile(memoryQris.qris_image_url);
    }
    memoryQris = {
      qris_name,
      qris_image_url: fullUrl || memoryQris.qris_image_url
    };
    return res.json({ success: true, message: 'Gambar QRIS berhasil diperbarui.', data: memoryQris });
  }
});

// DELETE /api/orders/qris (Admin - Delete QRIS Image File)
router.delete('/qris', verifyToken, async (req, res) => {
  try {
    const existingRes = await db.query("SELECT value FROM site_settings WHERE key = 'qris_settings'");
    let oldUrl = null;
    let qrisName = 'QRIS Toko Listrik Jaya UMKM';

    if (existingRes.rows.length > 0) {
      oldUrl = existingRes.rows[0].value?.qris_image_url;
      qrisName = existingRes.rows[0].value?.qris_name || qrisName;
    } else {
      oldUrl = memoryQris.qris_image_url;
    }

    if (oldUrl) {
      deleteLocalProofFile(oldUrl);
    }

    const updatedData = {
      qris_name: qrisName,
      qris_image_url: null,
      updated_at: new Date().toISOString()
    };

    const result = await db.query(
      "INSERT INTO site_settings (key, value, updated_at) VALUES ('qris_settings', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING value",
      [JSON.stringify(updatedData)]
    );

    memoryQris = updatedData;
    return res.json({
      success: true,
      message: 'Gambar barcode QRIS berhasil dihapus.',
      data: result.rows[0].value
    });
  } catch (err) {
    if (memoryQris.qris_image_url) {
      deleteLocalProofFile(memoryQris.qris_image_url);
    }
    memoryQris.qris_image_url = null;
    return res.json({ success: true, message: 'Gambar barcode QRIS berhasil dihapus.', data: memoryQris });
  }
});

// POST /api/orders (Public - Checkout Order with Same Name + WA Auto-Merge)
router.post('/', async (req, res) => {
  const { customer_name, customer_phone, customer_email, shipping_address, notes, items, total_amount } = req.body;

  if (!customer_name || !customer_phone || !shipping_address || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'Harap isi nama, nomor WA, alamat pengiriman, dan item pesanan.' });
  }

  const cleanName = customer_name.trim().toLowerCase();
  let cleanPhone = customer_phone.trim().replace(/\D/g, '');
  if (cleanPhone.startsWith('62')) {
    cleanPhone = '0' + cleanPhone.substring(2);
  }

  try {
    // 1. Check if an active PENDING_PAYMENT order exists for exact same Name (case-insensitive) + WA Phone
    const existingCheck = await db.query(
      `SELECT * FROM orders 
       WHERE LOWER(TRIM(customer_name)) = $1 
         AND REGEXP_REPLACE(REGEXP_REPLACE(customer_phone, '\\D', '', 'g'), '^62', '0') = $2 
         AND status = 'PENDING_PAYMENT' 
       ORDER BY id DESC LIMIT 1`,
      [cleanName, cleanPhone]
    );

    let targetOrder = null;
    let isMerged = false;

    if (existingCheck.rows && existingCheck.rows.length > 0) {
      // MERGE CASE: Active order found for same Name + WA
      targetOrder = existingCheck.rows[0];
      isMerged = true;

      // Update shipping address, email, notes, total_amount if updated
      await db.query(
        `UPDATE orders 
         SET shipping_address = $1, 
             notes = COALESCE(NULLIF($2, ''), notes), 
             customer_email = COALESCE(NULLIF($3, ''), customer_email),
             updated_at = NOW() 
         WHERE id = $4`,
        [shipping_address, notes || '', customer_email || '', targetOrder.id]
      );

      for (const item of items) {
        const itemCheck = await db.query(
          `SELECT * FROM order_items WHERE order_id = $1 AND (service_id = $2 OR product_title = $3)`,
          [targetOrder.id, item.service_id || null, item.product_title]
        );

        if (itemCheck.rows && itemCheck.rows.length > 0) {
          // Existing item in order -> increment quantity
          const existingItem = itemCheck.rows[0];
          const newQty = existingItem.quantity + (item.quantity || 1);
          const newSubtotal = (parseFloat(existingItem.price) || 0) * newQty;

          await db.query(
            `UPDATE order_items SET quantity = $1, subtotal = $2 WHERE id = $3`,
            [newQty, newSubtotal, existingItem.id]
          );
        } else {
          // New item for existing order -> insert row
          await db.query(
            `INSERT INTO order_items (order_id, service_id, product_title, price, quantity, subtotal)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [targetOrder.id, item.service_id || null, item.product_title, item.price || 0, item.quantity || 1, (item.price || 0) * (item.quantity || 1)]
          );
        }
      }

      // Recalculate total_amount for order
      const sumResult = await db.query(
        `SELECT SUM(subtotal) as grand_total FROM order_items WHERE order_id = $1`,
        [targetOrder.id]
      );
      const grandTotal = sumResult.rows[0].grand_total || total_amount || 0;

      await db.query(`UPDATE orders SET total_amount = $1 WHERE id = $2`, [grandTotal, targetOrder.id]);
      targetOrder.total_amount = grandTotal;

    } else {
      // NEW ORDER CASE: No active order for same Name + WA
      const order_code = generateOrderCode();

      const orderResult = await db.query(
        `INSERT INTO orders (order_code, customer_name, customer_phone, customer_email, shipping_address, notes, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING_PAYMENT') RETURNING *`,
        [order_code, customer_name, customer_phone, customer_email || '', shipping_address, notes || '', total_amount || 0, ]
      );

      targetOrder = orderResult.rows[0];

      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, service_id, product_title, price, quantity, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [targetOrder.id, item.service_id || null, item.product_title, item.price || 0, item.quantity || 1, (item.price || 0) * (item.quantity || 1)]
        );
      }
    }

    // Fetch full order items for response
    const allItemsResult = await db.query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [targetOrder.id]
    );

    return res.status(isMerged ? 200 : 201).json({
      success: true,
      is_merged: isMerged,
      message: isMerged 
        ? `Item berhasil ditambahkan ke Pesanan Aktif Kode: ${targetOrder.order_code}!` 
        : 'Pesanan baru berhasil dibuat.',
      data: { ...targetOrder, items: allItemsResult.rows }
    });

  } catch (err) {
    console.error('Error creating/merging order:', err);
    // Fallback memory order creation
    const order_code = generateOrderCode();
    const newOrder = {
      id: Date.now(),
      order_code,
      customer_name,
      customer_phone,
      customer_email: customer_email || '',
      shipping_address: shipping_address,
      notes: notes || '',
      total_amount: total_amount || 0,
      status: 'PENDING_PAYMENT',
      created_at: new Date().toISOString()
    };
    memoryOrders.unshift(newOrder);
    return res.status(201).json({
      success: true,
      is_merged: false,
      message: 'Pesanan berhasil dibuat.',
      data: { ...newOrder, items }
    });
  }
});

// GET /api/orders/track/:query (Public - Track Order by Code or Phone)
router.get('/track/:query', async (req, res) => {
  const { query } = req.params;
  const cleanQuery = query.trim();

  try {
    const orderResult = await db.query(
      `SELECT * FROM orders WHERE LOWER(order_code) = LOWER($1) OR customer_phone = $1 ORDER BY id DESC`,
      [cleanQuery]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan dengan kode/nomor WA tersebut.' });
    }

    const ordersWithItems = [];
    for (const order of orderResult.rows) {
      const itemsResult = await db.query(`SELECT * FROM order_items WHERE order_id = $1`, [order.id]);
      ordersWithItems.push({ ...order, items: itemsResult.rows });
    }

    return res.json({ success: true, data: ordersWithItems });
  } catch (err) {
    const found = memoryOrders.filter(
      o => o.order_code.toLowerCase() === cleanQuery.toLowerCase() || o.customer_phone === cleanQuery
    );
    if (found.length > 0) {
      return res.json({ success: true, data: found });
    }
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
  }
});

// POST /api/orders/upload-proof (Public - Upload Payment Proof)
router.post('/upload-proof', upload.single('proof_file'), async (req, res) => {
  const { order_code } = req.body;
  if (!req.file || !order_code) {
    return res.status(400).json({ success: false, message: 'Harap sertakan kode pesanan dan file gambar bukti transfer.' });
  }

  const filepath = `/uploads/${req.file.filename}`;
  const fullUrl = `${req.protocol}://${req.get('host')}${filepath}`;

  try {
    // Check if order already has an old proof image file and delete it to prevent orphan files
    const oldRes = await db.query(
      `SELECT proof_of_payment_url FROM orders WHERE LOWER(order_code) = LOWER($1)`,
      [order_code.trim()]
    );
    if (oldRes.rows.length > 0 && oldRes.rows[0].proof_of_payment_url) {
      deleteLocalProofFile(oldRes.rows[0].proof_of_payment_url);
    }

    const result = await db.query(
      `UPDATE orders SET proof_of_payment_url = $1, status = 'PAYMENT_UNVERIFIED', updated_at = NOW() WHERE LOWER(order_code) = LOWER($2) RETURNING *`,
      [fullUrl, order_code.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kode pesanan tidak ditemukan.' });
    }

    return res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Admin akan segera memverifikasi.',
      data: result.rows[0]
    });
  } catch (err) {
    const target = memoryOrders.find(o => o.order_code.toLowerCase() === order_code.trim().toLowerCase());
    if (target) {
      if (target.proof_of_payment_url) {
        deleteLocalProofFile(target.proof_of_payment_url);
      }
      target.proof_of_payment_url = fullUrl;
      target.status = 'PAYMENT_UNVERIFIED';
      return res.json({ success: true, message: 'Bukti pembayaran berhasil diunggah.', data: target });
    }
    return res.status(404).json({ success: false, message: 'Kode pesanan tidak ditemukan.' });
  }
});

// GET /api/orders (Admin)
router.get('/', verifyToken, async (req, res) => {
  const { status } = req.query;

  try {
    let queryStr = `SELECT * FROM orders ORDER BY id DESC`;
    let queryParams = [];

    if (status && status !== 'ALL') {
      queryStr = `SELECT * FROM orders WHERE status = $1 ORDER BY id DESC`;
      queryParams.push(status);
    }

    const ordersResult = await db.query(queryStr, queryParams);

    const ordersWithItems = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await db.query(`SELECT * FROM order_items WHERE order_id = $1`, [order.id]);
      ordersWithItems.push({ ...order, items: itemsResult.rows });
    }

    return res.json({ success: true, data: ordersWithItems });
  } catch (err) {
    let filtered = memoryOrders;
    if (status && status !== 'ALL') {
      filtered = memoryOrders.filter(o => o.status === status);
    }
    return res.json({ success: true, data: filtered });
  }
});

// PUT /api/orders/:id/status (Admin)
router.put('/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status pesanan harus diisi.' });
  }

  try {
    const result = await db.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    return res.json({ success: true, message: `Status pesanan berhasil diperbarui ke ${status}.`, data: result.rows[0] });
  } catch (err) {
    const target = memoryOrders.find(o => o.id === parseInt(id));
    if (target) {
      target.status = status;
      return res.json({ success: true, message: `Status pesanan diperbarui.`, data: target });
    }
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
  }
});

// DELETE /api/orders/:id/proof (Admin - Delete Proof Image Only)
router.delete('/:id/proof', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const targetRes = await db.query(`SELECT proof_of_payment_url FROM orders WHERE id = $1`, [id]);
    if (targetRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const proofUrl = targetRes.rows[0].proof_of_payment_url;
    if (proofUrl) {
      deleteLocalProofFile(proofUrl);
    }

    const result = await db.query(
      `UPDATE orders SET proof_of_payment_url = NULL, status = 'PENDING_PAYMENT', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    return res.json({
      success: true,
      message: 'Gambar bukti pembayaran berhasil dihapus.',
      data: result.rows[0]
    });
  } catch (err) {
    const target = memoryOrders.find(o => o.id === parseInt(id));
    if (target) {
      if (target.proof_of_payment_url) {
        deleteLocalProofFile(target.proof_of_payment_url);
      }
      target.proof_of_payment_url = null;
      target.status = 'PENDING_PAYMENT';
      return res.json({ success: true, message: 'Gambar bukti pembayaran berhasil dihapus.', data: target });
    }
    return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
  }
});

// DELETE /api/orders/:id (Admin - Delete Order & Proof Image)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete local proof file if exists
    const targetRes = await db.query(`SELECT proof_of_payment_url FROM orders WHERE id = $1`, [id]);
    if (targetRes.rows.length > 0 && targetRes.rows[0].proof_of_payment_url) {
      deleteLocalProofFile(targetRes.rows[0].proof_of_payment_url);
    }

    // Delete order_items first
    await db.query(`DELETE FROM order_items WHERE order_id = $1`, [id]);

    const result = await db.query(`DELETE FROM orders WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan untuk dihapus.' });
    }

    return res.json({ success: true, message: 'Pesanan & gambar bukti pembayaran berhasil dihapus.' });
  } catch (err) {
    const target = memoryOrders.find(o => o.id === parseInt(id));
    if (target && target.proof_of_payment_url) {
      deleteLocalProofFile(target.proof_of_payment_url);
    }
    memoryOrders = memoryOrders.filter(o => o.id !== parseInt(id));
    return res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  }
});

module.exports = router;
