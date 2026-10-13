/**
 * Database Auto-Initialization & Seeding Script
 * Run with: node database/init_db.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const isAiven = (process.env.DB_HOST || '').includes('aivencloud.com') ||
                (process.env.DATABASE_URL || '').includes('aivencloud.com') ||
                process.env.DB_SSL === 'true';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
  connectTimeout: 30000,
  ...(isAiven ? { ssl: { rejectUnauthorized: false } } : {})
};

async function initDatabase() {
  console.log('---------------------------------------------------------');
  console.log('The Open Door Church Matrimony - Database Initializer');
  console.log('Connecting to MySQL host:', dbConfig.host, 'port:', dbConfig.port);
  if (isAiven) console.log('Mode: Aiven Cloud MySQL (SSL enabled)');
  console.log('---------------------------------------------------------');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Successfully connected to MySQL server.');

    // Aiven uses 'defaultdb' as the default — we'll create tod_matrimony inside it
    // or use the existing defaultdb. Try to create the DB first.
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS `tod_matrimony` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
      await connection.query('USE `tod_matrimony`;');
      console.log('✓ Using database: tod_matrimony');
    } catch (dbErr) {
      // Aiven may restrict CREATE DATABASE — fall back to defaultdb
      console.log('ℹ Cannot create tod_matrimony, using defaultdb instead:', dbErr.message);
      await connection.query('USE `defaultdb`;');
      console.log('✓ Using database: defaultdb');
    }

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('Applying database schema from schema.sql...');
      // Remove CREATE DATABASE and USE statements since we already handled them
      let schemaSql = fs.readFileSync(schemaPath, 'utf8');
      schemaSql = schemaSql
        .replace(/CREATE DATABASE[\s\S]*?;/gi, '')
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await connection.query(schemaSql);
      console.log('✓ Database schema created successfully.');
    } else {
      console.error('✗ schema.sql not found at', schemaPath);
    }

    if (fs.existsSync(seedPath)) {
      console.log('Applying seed data from seed.sql...');
      let seedSql = fs.readFileSync(seedPath, 'utf8');
      seedSql = seedSql
        .replace(/USE\s+`?tod_matrimony`?\s*;/gi, '')
        .replace(/USE\s+`?defaultdb`?\s*;/gi, '');
      await connection.query(seedSql);
      console.log('✓ Seed data (40+ profiles, CMS settings, admins) inserted successfully.');
    } else {
      console.error('✗ seed.sql not found at', seedPath);
    }

    console.log('---------------------------------------------------------');
    console.log('✓ Database initialization completed successfully!');
    console.log('Default Super Admin: admin@opendoormatrimony.org / Password@123');
    console.log('Demo Male User:      joshua.masih@example.com / Password@123');
    console.log('Demo Female User:    grace.matthew@example.com / Password@123');
    console.log('---------------------------------------------------------');
  } catch (error) {
    console.error('✗ Database Initialization Error:', error.message);
    console.error('Tip: Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_PORT are set correctly in backend/.env');
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
