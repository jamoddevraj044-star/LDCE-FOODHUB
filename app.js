const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const api = require('./routes/api');

const app = express();
app.disable('x-powered-by');
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((value) => value.trim()).filter(Boolean);
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)) }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

const ensureDB = async (req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/menu')) {
    connectDB(1500).catch(() => {});
    return next();
  }
  try {
    await connectDB(2000);
    next();
  } catch (error) {
    res.status(503).json({ success: false, message: 'Database is unavailable. Check the MONGODB_URI setting.' });
  }
};

app.use('/api', ensureDB, api);
app.use('/.netlify/functions/api', ensureDB, api);

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { extensions: ['html'] }));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/.netlify/')) return next();
  res.sendFile(path.join(publicDir, 'index.html'), (error) => error && next(error));
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
app.use((error, req, res, next) => {
  console.error('Request failed:', error);
  res.status(error.status || 500).json({ success: false, message: error.status ? error.message : 'Internal server error.' });
});

module.exports = app;
