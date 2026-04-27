import { Router } from 'express';
import { dbAll, dbGet } from '../db/database.js';
import { fallbackProducts, getFallbackProductById } from '../data/products.js';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products');
    res.json(products.length > 0 ? products : fallbackProducts);
  } catch (err) {
    console.error('Products error:', err);
    res.json(fallbackProducts);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [Number(req.params.id)]);
    if (!product) {
      const fallbackProduct = getFallbackProductById(req.params.id);
      if (!fallbackProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(fallbackProduct);
    }
    res.json(product);
  } catch (err) {
    console.error('Product error:', err);
    const fallbackProduct = getFallbackProductById(req.params.id);
    if (!fallbackProduct) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(fallbackProduct);
  }
});

export default router;
