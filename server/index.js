import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Init DB then start server
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║   ALSALAHY PERFUME - API Server      ║
  ║   Running on http://localhost:${PORT}   ║
  ╚══════════════════════════════════════╝
    `);
  });
}

start().catch(console.error);
