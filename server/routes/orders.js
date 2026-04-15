import { Router } from 'express';
import { dbAll, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const { customer_name, phone, address, city, notes, items, user_id } = req.body;

    if (!customer_name || !phone || !address || !city || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderResult = dbRun(
      'INSERT INTO orders (user_id, customer_name, phone, address, city, notes, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id || null, customer_name, phone, address, city, notes || '', total]
    );

    const orderId = orderResult.lastInsertRowid;

    for (const item of items) {
      dbRun(
        'INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.size, item.quantity, item.price]
      );
    }

    res.status(201).json({ id: orderId, total, status: 'pending' });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/my
router.get('/my', authenticateToken, (req, res) => {
  try {
    const orders = dbAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    
    for (const order of orders) {
      order.items = dbAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    }

    res.json(orders);
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
