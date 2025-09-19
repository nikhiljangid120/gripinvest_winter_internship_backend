// Main Express app - Setup server, routes, health
const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./config/database'); // Import for health

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const investmentRoutes = require('./routes/investments');
const logRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes); // Public
app.use('/products', productRoutes);
app.use('/investments', investmentRoutes);
app.use('/logs', logRoutes);

// Health endpoint - Check service + DB
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', db: 'Connected', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'Error', db: 'Disconnected' });
  }
});

// 404 handler
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app; // For testing