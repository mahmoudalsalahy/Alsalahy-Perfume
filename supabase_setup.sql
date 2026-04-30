-- =============================================
-- Alsalahy Perfume - Supabase Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add Foreign Key: order_items.order_id → orders.id
ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- 2. Add Foreign Key: order_items.product_id → products.id
ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- 3. Add Foreign Key: orders.user_id → auth.users(id)
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =============================================
-- RLS Policies - Allow users to read their own orders
-- =============================================

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also allow anonymous order inserts (for guests)
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read order items for their own orders
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Anyone can insert order items
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Products should be readable by everyone
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);
