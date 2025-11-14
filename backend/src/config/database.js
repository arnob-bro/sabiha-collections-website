const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pool_mode: process.env.DB_POOL_MODE,
  ssl: { rejectUnauthorized: false },
});

// Handle connection errors gracefully
db.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
  // Don't exit process, let the pool handle reconnections
});

db.on('connect', (client) => {
  console.log('New database connection established');
});

db.on('remove', (client) => {
  console.log('Database connection removed');
});

// Test connection function
db.testConnection = async () => {
  let client;
  try {
      client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as db_version');
      console.log('✅ Database connected successfully');
      console.log('📊 Database time:', result.rows[0].current_time);
      return true;
  } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
  } finally {
      if (client) client.release();
  }
};

module.exports = db;
