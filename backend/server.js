const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const authRoutes = require('./routes/auth');
const slidersRoutes = require('./routes/sliders');
const servicesRoutes = require('./routes/services');
const postsRoutes = require('./routes/posts');
const pagesRoutes = require('./routes/pages');
const menusRoutes = require('./routes/menus');
const mediaRoutes = require('./routes/media');
const inquiriesRoutes = require('./routes/inquiries');
const settingsRoutes = require('./routes/settings');
const ordersRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/sliders', slidersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', ordersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'DigiAgency Aetheric API',
    timestamp: new Date().toISOString()
  });
});

// Serve compiled React Frontend build if present
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
}

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 DigiAgency Express API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Website Frontend: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
