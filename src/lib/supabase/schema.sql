-- ============================================
-- Premiora Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    gallery_urls TEXT[],
    supplier_price INT DEFAULT 0,
    markup_amount INT DEFAULT 0,
    markup_percentage NUMERIC(5,2) DEFAULT 0,
    selling_price INT GENERATED ALWAYS AS (
        supplier_price + markup_amount + FLOOR(supplier_price * markup_percentage / 100)
    ) STORED,
    supplier_product_code TEXT,
    warranty_duration TEXT DEFAULT '1 Bulan',
    estimated_process TEXT DEFAULT '1-5 Menit',
    benefits TEXT[],
    activation_guide TEXT,
    dynamic_fields JSONB DEFAULT '[]',
    faq JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    stock INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    rating_avg NUMERIC(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- 3. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT NOT NULL,
    total_orders INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_whatsapp ON customers(whatsapp);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending_payment',
    subtotal INT DEFAULT 0,
    total INT DEFAULT 0,
    notes TEXT,
    customer_data JSONB,
    paid_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_invoice ON orders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    price INT NOT NULL,
    quantity INT DEFAULT 1,
    subtotal INT NOT NULL,
    credentials JSONB,
    dynamic_field_values JSONB,
    supplier_order_id TEXT,
    supplier_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 6. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway TEXT DEFAULT 'midtrans',
    transaction_id TEXT,
    payment_type TEXT,
    status TEXT DEFAULT 'pending',
    gross_amount INT DEFAULT 0,
    raw_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

-- 7. SUPPLIER LOGS
CREATE TABLE IF NOT EXISTS supplier_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    request_url TEXT,
    request_body JSONB,
    response_body JSONB,
    response_code INT,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_logs_order ON supplier_logs(order_id);

-- 8. PRODUCT REVIEWS
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);

-- 9. SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO settings (key, value, description) VALUES
    ('site_name', '"Premiora"', 'Nama website'),
    ('site_description', '"Marketplace Akun Premium Digital Terpercaya"', 'Deskripsi website'),
    ('whatsapp_number', '"6281234567890"', 'Nomor WhatsApp support'),
    ('default_markup_amount', '5000', 'Markup default nominal (Rp)'),
    ('default_markup_percentage', '0', 'Markup default persentase (%)'),
    ('midtrans_mode', '"sandbox"', 'Mode Midtrans'),
    ('auto_process_order', 'true', 'Auto process order ke supplier')
ON CONFLICT (key) DO NOTHING;

-- 10. TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_payments_updated BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 11. RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read visible reviews" ON product_reviews FOR SELECT USING (is_visible = true);
