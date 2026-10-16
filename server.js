try {
  require('dotenv').config();
} catch (e) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envFile = path.join(__dirname, '.env');
    if (fs.existsSync(envFile)) {
      fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[k]) process.env[k] = v;
          }
        }
      });
    }
  } catch (_) {}
}
const app = require('./app');
const connectDB = require('./config/db');
const { autoSeed, ensureAdmin } = require('./config/starterMenu');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const startServer = async () => {
  let dbConnected = false;
  try {
    await connectDB(2000);
    dbConnected = true;
    console.log('MongoDB connected successfully.');
    await autoSeed().catch((err) => console.warn('Auto-seed check failed:', err.message));
    await ensureAdmin().catch((err) => console.warn('Admin check failed:', err.message));
  } catch (err) {
    console.warn(`[Notice] MongoDB is not running locally (${err.message}). Starting server in fallback mode.`);
  }

  app.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`LDCE FoodHub is ready at http://${HOST}:${PORT}`);
    console.log(`Mode: ${dbConnected ? 'Database Connected' : 'Fallback / Offline Menu Ready'}`);
    console.log(`Admin Login:`);
    console.log(`  Username: admin`);
    console.log(`  Password: Admin@123456`);
    console.log(`  Dashboard: http://${HOST}:${PORT}/admin/dashboard.html`);
    console.log(`====================================================`);
  });
};

startServer();
