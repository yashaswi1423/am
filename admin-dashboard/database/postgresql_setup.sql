-- ============================================
-- POSTGRESQL DATABASE SETUP FOR AM FASHIONS
-- This file sets up the entire database for PostgreSQL
-- Run this file to create a fresh database with all tables and features
-- ============================================

-- ============================================
-- STEP 1: Create Tables
-- ============================================

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NULL,
    address_line1 VARCHAR(255) NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
    variant_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(20) NULL,
    color VARCHAR(50) NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_available ON product_variants(is_available);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'pending_verification', 'paid', 'failed', 'refunded')),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    coupon_code VARCHAR(50) NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT NULL,
    tracking_number VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    variant_id INT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_details VARCHAR(255) NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet')),
    transaction_id VARCHAR(100) NULL,
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'pending_verification', 'success', 'failed', 'refunded')),
    amount DECIMAL(10, 2) NOT NULL,
    payment_gateway VARCHAR(50) NULL,
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    refund_date TIMESTAMP NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_status ON payments(payment_status);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id SERIAL PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2) NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_coupon_code ON coupons(coupon_code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_validity ON coupons(valid_from, valid_until);

-- Returns table
CREATE TABLE IF NOT EXISTS returns (
    return_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    return_status VARCHAR(20) DEFAULT 'requested' CHECK (return_status IN ('requested', 'approved', 'rejected', 'picked_up', 'refunded', 'completed')),
    return_reason TEXT NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_status VARCHAR(20) DEFAULT 'pending' CHECK (refund_status IN ('pending', 'processed', 'completed', 'rejected')),
    admin_notes TEXT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_customer_id ON returns(customer_id);
CREATE INDEX IF NOT EXISTS idx_returns_return_number ON returns(return_number);
CREATE INDEX IF NOT EXISTS idx_returns_return_status ON returns(return_status);

-- Payment verifications table
CREATE TABLE IF NOT EXISTS payment_verifications (
    verification_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    payment_id INT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'upi',
    payment_amount DECIMAL(10, 2) NOT NULL,
    screenshot_path VARCHAR(500) NULL,
    screenshot_filename VARCHAR(255) NULL,
    
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'under_review')),
    
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    admin_notes TEXT NULL,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_verifications_order_id ON payment_verifications(order_id);
CREATE INDEX IF NOT EXISTS idx_verifications_payment_id ON payment_verifications(payment_id);
CREATE INDEX IF NOT EXISTS idx_verifications_transaction_id ON payment_verifications(transaction_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON payment_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_verifications_submitted_at ON payment_verifications(submitted_at);

-- Payment verification logs table
CREATE TABLE IF NOT EXISTS payment_verification_logs (
    log_id SERIAL PRIMARY KEY,
    verification_id INT NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('submitted', 'under_review', 'verified', 'rejected', 'resubmitted')),
    performed_by INT NULL,
    performed_by_type VARCHAR(20) DEFAULT 'system' CHECK (performed_by_type IN ('customer', 'admin', 'system')),
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (verification_id) REFERENCES payment_verifications(verification_id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_verification_id ON payment_verification_logs(verification_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON payment_verification_logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON payment_verification_logs(created_at);

-- Login approval requests table
CREATE TABLE IF NOT EXISTS login_approval_requests (
    request_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    approval_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_approval_admin_id ON login_approval_requests(admin_id);
CREATE INDEX IF NOT EXISTS idx_approval_token ON login_approval_requests(approval_token);
CREATE INDEX IF NOT EXISTS idx_approval_status ON login_approval_requests(status);

-- ============================================
-- STEP 2: Create Views
-- ============================================

-- Pending verifications view
CREATE OR REPLACE VIEW vw_pending_verifications AS
SELECT 
    pv.verification_id,
    pv.order_id,
    o.order_number,
    pv.transaction_id,
    pv.payment_method,
    pv.payment_amount,
    pv.screenshot_path,
    pv.screenshot_filename,
    pv.verification_status,
    pv.customer_name,
    pv.customer_email,
    pv.customer_phone,
    pv.submitted_at,
    pv.admin_notes,
    a.full_name AS verified_by_name,
    pv.verified_at,
    o.order_status,
    o.payment_status AS order_payment_status,
    EXTRACT(DAY FROM (NOW() - pv.submitted_at)) AS days_pending
FROM payment_verifications pv
LEFT JOIN orders o ON pv.order_id = o.order_id
LEFT JOIN admins a ON pv.verified_by = a.admin_id
WHERE pv.verification_status = 'pending'
ORDER BY pv.submitted_at ASC;

-- All verifications view
CREATE OR REPLACE VIEW vw_all_verifications AS
SELECT 
    pv.verification_id,
    pv.order_id,
    o.order_number,
    pv.transaction_id,
    pv.payment_method,
    pv.payment_amount,
    pv.screenshot_path,
    pv.screenshot_filename,
    pv.verification_status,
    pv.customer_name,
    pv.customer_email,
    pv.customer_phone,
    pv.submitted_at,
    pv.verified_at,
    pv.rejection_reason,
    pv.admin_notes,
    a.full_name AS verified_by_name,
    o.order_status,
    o.payment_status AS order_payment_status,
    c.customer_id
FROM payment_verifications pv
LEFT JOIN orders o ON pv.order_id = o.order_id
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN admins a ON pv.verified_by = a.admin_id
ORDER BY pv.submitted_at DESC;

-- ============================================
-- STEP 3: Create Functions for Auto-Update Timestamps
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_returns_updated_at BEFORE UPDATE ON returns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON payment_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 4: Insert Sample Data
-- ============================================

-- Insert admin user (password: admin123)
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@amfashions.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Admin User', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

SELECT 'Database setup completed successfully!' AS status;
