const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support for large base64 images
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

module.exports = app;
