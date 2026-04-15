import { Router } from 'express';
import { dbAll, dbGet } from '../db/database.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
