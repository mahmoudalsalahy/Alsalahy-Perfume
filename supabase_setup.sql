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

-- =============================================
-- RLS Policies
-- =============================================

-- Users profile table, used by auth, saved carts, and order prefill.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  cart JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cart JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE UNIQUE INDEX IF NOT EXISTS users_id_unique ON public.users (id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

CREATE OR REPLACE FUNCTION public.handle_auth_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, phone, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.users.name),
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_profile_saved ON auth.users;
CREATE TRIGGER on_auth_user_profile_saved
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_profile();

INSERT INTO public.users (id, name, email, phone, updated_at)
SELECT
  id,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1),
    'User'
  ),
  email,
  COALESCE(raw_user_meta_data->>'phone', ''),
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  name = COALESCE(EXCLUDED.name, public.users.name),
  email = COALESCE(EXCLUDED.email, public.users.email),
  phone = COALESCE(EXCLUDED.phone, public.users.phone),
  updated_at = NOW();

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own order items" ON order_items;
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND auth.uid()::text = orders.user_id::text
    )
  );

DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Products readable by everyone
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- =============================================
-- Update Product Prices
-- =============================================
UPDATE products SET price = 300, original_price_50ml = 350;

-- =============================================
-- Add Cart column to users table
-- =============================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cart JSONB DEFAULT '[]'::JSONB;

-- =============================================
-- Enable Realtime for Cart Sync
-- =============================================
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;
