const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection config
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ecommerce',
  password: process.env.DB_PASSWORD || 'ecommerce',
  database: process.env.DB_NAME || 'ecommerce',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let pool = null;
let isPgAvailable = false;

try {
  pool = new Pool(poolConfig);
  isPgAvailable = true;
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.warn('⚠️  PostgreSQL connection error:', err.message);
      console.warn('⚠️  Operating in fallback memory/file persistent store mode.');
      isPgAvailable = false;
    } else {
      console.log('✅ PostgreSQL connected successfully at', res.rows[0].now);
      isPgAvailable = true;
    }
  });
} catch (e) {
  console.warn('⚠️ PostgreSQL initialization skipped. Falling back to dataset store.');
  isPgAvailable = false;
}

module.exports = {
  query: (text, params) => {
    if (isPgAvailable && pool) {
      return pool.query(text, params);
    }
    return Promise.reject(new Error('PostgreSQL pool inactive. Memory store active.'));
  },
  pool,
  getIsPgAvailable: () => isPgAvailable
};
