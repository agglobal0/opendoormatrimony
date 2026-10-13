const app = require('./app');
const { testConnection } = require('./config/db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('===========================================================');
  console.log('  The Open Door Church, Khojewala Matrimonial Platform');
  console.log('  Open Door Matrimony Server - Faith. Family. Forever.');
  console.log('===========================================================');

  // Test Database Connection
  await testConnection();

  app.listen(PORT, () => {
    console.log(`✓ API Server listening on: http://localhost:${PORT}`);
    console.log(`✓ Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`✓ Ready to serve client requests with complete security.`);
    console.log('===========================================================');
  });
}

startServer();
