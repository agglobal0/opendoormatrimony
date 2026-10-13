/**
 * Database Auto-Initialization & Seeding Script
 * Run with: node database/init_db.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function initDatabase() {
  console.log('---------------------------------------------------------');
  console.log('The Open Door Church Matrimony - Database Initializer');
  console.log('Connecting to MySQL host:', dbConfig.host, 'port:', dbConfig.port);
  console.log('---------------------------------------------------------');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Successfully connected to MySQL server.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log('Applying database schema from schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✓ Database schema created successfully.');
    } else {
      console.error('✗ schema.sql not found at', schemaPath);
    }

    if (fs.existsSync(seedPath)) {
      console.log('Applying seed data from seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✓ Seed data (40+ profiles, CMS settings, admins) inserted successfully.');
    } else {
      console.error('✗ seed.sql not found at', seedPath);
    }

    console.log('---------------------------------------------------------');
    console.log('Database initialization completed successfully!');
    console.log('Default Super Admin: admin@opendoormatrimony.org / Password@123');
    console.log('Demo Male User: joshua.masih@example.com / Password@123');
    console.log('Demo Female User: grace.matthew@example.com / Password@123');
    console.log('---------------------------------------------------------');
  } catch (error) {
    console.error('✗ Database Initialization Error:', error.message);
    console.error('Please ensure MySQL service is running and credentials in .env are correct.');
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
