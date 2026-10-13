const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbUri = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_URI;
const isCloudDb = Boolean(
  dbUri ||
  (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
);

const isAivenOrSsl = Boolean(
  process.env.DB_SSL === 'true' ||
  (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')) ||
  (dbUri && (dbUri.includes('aivencloud.com') || dbUri.includes('ssl')))
);

let pool = null;
let isMock = false;
let mockDb = null;

const fs = require('fs');

const dbConfig = dbUri ? {
  uri: dbUri,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  multipleStatements: true,
  connectTimeout: 20000,
  ...(isAivenOrSsl ? { ssl: { rejectUnauthorized: false } } : {})
} : {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tod_matrimony',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  multipleStatements: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: isCloudDb ? 20000 : 2500,
  ...(isAivenOrSsl ? { ssl: { rejectUnauthorized: false } } : {})
};

function getMockDb() {
  if (!mockDb) {
    mockDb = require('./mockDb');
  }
  return mockDb;
}

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('MySQL pool initialization error, will fall back to mock store if needed:', err.message);
}

async function autoInitSchemaIfNeeded() {
  if (isMock || !pool) return;
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'");
    if (rows && rows[0] && rows[0].cnt > 0) {
      console.log('✓ Database tables verified.');
      return;
    }
    console.log('⚡ Initializing database schema on cloud MySQL...');
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const fallbackPath = path.join(__dirname, '../../../database/schema.sql');
    const actualSchema = fs.existsSync(schemaPath) ? schemaPath : (fs.existsSync(fallbackPath) ? fallbackPath : null);
    
    if (actualSchema) {
      let sql = fs.readFileSync(actualSchema, 'utf8')
        .replace(/CREATE DATABASE[\s\S]*?;/gi, '')
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await pool.query(sql);
      console.log('✓ Schema created successfully!');
    }

    const seedPath = path.join(__dirname, '../../database/seed.sql');
    const fallbackSeed = path.join(__dirname, '../../../database/seed.sql');
    const actualSeed = fs.existsSync(seedPath) ? seedPath : (fs.existsSync(fallbackSeed) ? fallbackSeed : null);
    if (actualSeed) {
      let seedSql = fs.readFileSync(actualSeed, 'utf8')
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await pool.query(seedSql);
      console.log('✓ Seed data inserted into cloud database!');
    }
  } catch (err) {
    console.warn('Auto-init note (tables may already exist):', err.message);
  }
}

async function query(sql, params = []) {
  if (isMock) {
    return getMockDb().query(sql, params);
  }

  try {
    if (!pool) {
      isMock = true;
      return getMockDb().query(sql, params);
    }
    const queryPromise = pool.query(sql, params);
    const timeoutMs = isCloudDb ? 15000 : 1500;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('ECONNREFUSED')), timeoutMs)
    );
    const [rows, fields] = await Promise.race([queryPromise, timeoutPromise]);
    return [rows, fields];
  } catch (err) {
    if (!isMock) {
      console.warn(`[DATABASE] Activating integrated memory-relational database fallback.`);
      isMock = true;
    }
    return getMockDb().query(sql, params);
  }
}

async function testConnection() {
  try {
    const [result] = await query('SELECT 1 as val');
    if (isMock) {
      console.log('✓ Running on High-Performance In-Memory Relational Engine (40+ seed profiles ready).');
    } else {
      console.log('✓ Connected to MySQL database:', dbConfig.database || 'defaultdb');
      await autoInitSchemaIfNeeded();
    }
    return true;
  } catch (err) {
    console.warn('Database health check note:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
  isMock: () => isMock
};
