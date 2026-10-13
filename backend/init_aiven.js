/**
 * Aiven Init Runner - runs from backend directory where mysql2 is available
 */
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

// Load backend .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

const isAiven = (process.env.DB_HOST || '').includes('aivencloud.com') || process.env.DB_SSL === 'true';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  connectTimeout: 30000,
  ...(isAiven ? { ssl: { rejectUnauthorized: false } } : {})
};

async function run() {
  console.log('==========================================================');
  console.log(' Open Door Church Matrimony - Aiven Database Initializer');
  console.log('==========================================================');
  console.log('Host :', dbConfig.host);
  console.log('Port :', dbConfig.port);
  console.log('User :', dbConfig.user);
  console.log('SSL  :', isAiven ? 'YES' : 'NO');
  console.log('----------------------------------------------------------');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to Aiven MySQL!');

    // Try to create tod_matrimony database
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS `tod_matrimony` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
      await connection.query('USE `tod_matrimony`;');
      console.log('✓ Using database: tod_matrimony');
    } catch (e) {
      console.log('ℹ Using database: defaultdb (fallback):', e.message.split('\n')[0]);
      await connection.query('USE `defaultdb`;');
    }

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath   = path.join(__dirname, '../database/seed.sql');

    // Apply schema
    if (fs.existsSync(schemaPath)) {
      let sql = fs.readFileSync(schemaPath, 'utf8');
      sql = sql
        .replace(/CREATE DATABASE[\s\S]*?;/gi, '')
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await connection.query(sql);
      console.log('✓ Schema tables created!');
    }

    // Apply seed
    if (fs.existsSync(seedPath)) {
      let sql = fs.readFileSync(seedPath, 'utf8');
      sql = sql
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await connection.query(sql);
      console.log('✓ Seed data inserted (40+ profiles)!');
    }

    console.log('==========================================================');
    console.log('✓ Aiven Database Ready!');
    console.log('  Admin   : admin@opendoormatrimony.org / Password@123');
    console.log('  Male    : joshua.masih@example.com   / Password@123');
    console.log('  Female  : grace.matthew@example.com  / Password@123');
    console.log('==========================================================');
  } catch (err) {
    console.error('✗ Error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

run();
