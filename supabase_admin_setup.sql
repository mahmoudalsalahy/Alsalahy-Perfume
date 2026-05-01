-- Alsalahy Perfume - Admin dashboard setup
-- Run this in Supabase SQL Editor, then add your admin email at the bottom.

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE active = true
      AND LOWER(email) = LOWER(auth.jwt()->>'email')
  );
$$;

DROP POLICY IF EXISTS "Admins can read admin users" ON public.admin_users;
CREATE POLICY "Admins can read admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin() OR LOWER(email) = LOWER(auth.jwt()->>'email'));

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS payment_proof_path TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS payment_reviewed_at TIMESTAMPTZ;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all order items" ON public.order_items;
CREATE POLICY "Admins can read all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.is_admin());

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS desc_ar TEXT,
  ADD COLUMN IF NOT EXISTS desc_en TEXT,
  ADD COLUMN IF NOT EXISTS notes_ar TEXT,
  ADD COLUMN IF NOT EXISTS notes_en TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC,
  ADD COLUMN IF NOT EXISTS price_50ml NUMERIC,
  ADD COLUMN IF NOT EXISTS original_price NUMERIC,
  ADD COLUMN IF NOT EXISTS original_price_50ml NUMERIC,
  ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '["50 ml"]'::JSONB,
  ADD COLUMN IF NOT EXISTS prices JSONB DEFAULT '{"50 ml": 300}'::JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all products" ON public.products;
CREATE POLICY "Admins can read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.site_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_ar TEXT NOT NULL,
  message_en TEXT,
  active BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active announcements" ON public.site_announcements;
CREATE POLICY "Anyone can read active announcements"
  ON public.site_announcements FOR SELECT
  TO anon, authenticated
  USING (active = true);

UPDATE public.site_announcements
SET starts_at = NULL,
    ends_at = NULL
WHERE starts_at IS NOT NULL
   OR ends_at IS NOT NULL;

DROP POLICY IF EXISTS "Admins can read all announcements" ON public.site_announcements;
CREATE POLICY "Admins can read all announcements"
  ON public.site_announcements FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert announcements" ON public.site_announcements;
CREATE POLICY "Admins can insert announcements"
  ON public.site_announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update announcements" ON public.site_announcements;
CREATE POLICY "Admins can update announcements"
  ON public.site_announcements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Anyone can read product images" ON storage.objects;
CREATE POLICY "Anyone can read product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Admin account allowed to access /admin.html.
-- Create this user in Supabase Authentication with the password you chose,
-- then run this insert to grant dashboard access.
INSERT INTO public.admin_users (email) VALUES ('alsalahyperfume@admin.com')
ON CONFLICT (email) DO UPDATE SET active = true;
