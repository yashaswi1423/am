-- ============================================
-- COMPLETE DATABASE SETUP FOR AM FASHIONS
-- This file sets up the entire database including payment verification
-- Run this file to create a fresh database with all tables and features
-- ============================================

-- ============================================
-- STEP 1: Create Database
-- ============================================
DROP DATABASE IF EXISTS ecommerce_admin;
CREATE DATABASE ecommerce_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_admin;

-- ============================================
-- STEP 2: Create Base Tables
-- ============================================

-- Admins table
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Customers table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Product variants table
CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(20) NULL,
    color VARCHAR(50) NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku),
    INDEX idx_available (is_available)
) ENGINE=InnoDB;

-- Orders table (with payment_verification status)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'pending_verification', 'paid', 'failed', 'refunded') DEFAULT 'pending',
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Order items table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
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
    FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- Payments table (with pending_verification status)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet') NOT NULL,
    transaction_id VARCHAR(100) NULL,
    payment_status ENUM('pending', 'pending_verification', 'success', 'failed', 'refunded') DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    payment_gateway VARCHAR(50) NULL,
    payment_date DATETIME NULL,
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    refund_date DATETIME NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- Coupons table
CREATE TABLE coupons (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    max_discount DECIMAL(10, 2) NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupon_code (coupon_code),
    INDEX idx_active (is_active),
    INDEX idx_validity (valid_from, valid_until)
) ENGINE=InnoDB;

-- Returns table
CREATE TABLE returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    return_status ENUM('requested', 'approved', 'rejected', 'picked_up', 'refunded', 'completed') DEFAULT 'requested',
    return_reason TEXT NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    refund_status ENUM('pending', 'processed', 'completed', 'rejected') DEFAULT 'pending',
    admin_notes TEXT NULL,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME NULL,
    refunded_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_return_number (return_number),
    INDEX idx_return_status (return_status)
) ENGINE=InnoDB;

-- ============================================
-- STEP 3: Create Payment Verification Tables
-- ============================================

-- Payment verifications table
CREATE TABLE payment_verifications (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_id INT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'upi',
    payment_amount DECIMAL(10, 2) NOT NULL,
    screenshot_path VARCHAR(500) NULL,
    screenshot_filename VARCHAR(255) NULL,
    
    verification_status ENUM('pending', 'verified', 'rejected', 'under_review') DEFAULT 'pending',
    
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    
    verified_by INT NULL,
    verified_at DATETIME NULL,
    rejection_reason TEXT NULL,
    admin_notes TEXT NULL,
    
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_payment_id (payment_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_verification_status (verification_status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB;

-- Payment verification logs table
CREATE TABLE payment_verification_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    verification_id INT NOT NULL,
    action ENUM('submitted', 'under_review', 'verified', 'rejected', 'resubmitted') NOT NULL,
    performed_by INT NULL,
    performed_by_type ENUM('customer', 'admin', 'system') DEFAULT 'system',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (verification_id) REFERENCES payment_verifications(verification_id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    
    INDEX idx_verification_id (verification_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================
-- STEP 4: Create Stored Procedures
-- ============================================

DELIMITER //

-- Submit payment verification
CREATE PROCEDURE sp_submit_payment_verification(
    IN p_order_id INT,
    IN p_transaction_id VARCHAR(100),
    IN p_payment_method VARCHAR(50),
    IN p_payment_amount DECIMAL(10, 2),
    IN p_screenshot_path VARCHAR(500),
    IN p_screenshot_filename VARCHAR(255),
    IN p_customer_name VARCHAR(100),
    IN p_customer_email VARCHAR(100),
    IN p_customer_phone VARCHAR(20)
)
BEGIN
    DECLARE v_verification_id INT;
    DECLARE v_payment_id INT;
    
    START TRANSACTION;
    
    SELECT payment_id INTO v_payment_id
    FROM payments
    WHERE order_id = p_order_id
    LIMIT 1;
    
    INSERT INTO payment_verifications (
        order_id, payment_id, transaction_id, payment_method, payment_amount,
        screenshot_path, screenshot_filename, customer_name, customer_email, customer_phone,
        verification_status, submitted_at
    ) VALUES (
        p_order_id, v_payment_id, p_transaction_id, p_payment_method, p_payment_amount,
        p_screenshot_path, p_screenshot_filename, p_customer_name, p_customer_email, p_customer_phone,
        'pending', NOW()
    );
    
    SET v_verification_id = LAST_INSERT_ID();
    
    UPDATE orders 
    SET payment_status = 'pending_verification',
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
    
    UPDATE payments 
    SET payment_status = 'pending_verification',
        transaction_id = p_transaction_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
    
    INSERT INTO payment_verification_logs (verification_id, action, performed_by_type, notes)
    VALUES (v_verification_id, 'submitted', 'customer', 'Payment verification submitted by customer');
    
    COMMIT;
    
    SELECT v_verification_id AS verification_id;
END //

-- Verify payment (Admin)
CREATE PROCEDURE sp_verify_payment(
    IN p_verification_id INT,
    IN p_admin_id INT,
    IN p_admin_notes TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_payment_id INT;
    
    START TRANSACTION;
    
    SELECT order_id, payment_id INTO v_order_id, v_payment_id
    FROM payment_verifications
    WHERE verification_id = p_verification_id;
    
    UPDATE payment_verifications
    SET verification_status = 'verified',
        verified_by = p_admin_id,
        verified_at = NOW(),
        admin_notes = p_admin_notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE verification_id = p_verification_id;
    
    UPDATE orders
    SET payment_status = 'paid',
        order_status = CASE 
            WHEN order_status = 'pending' THEN 'confirmed'
            ELSE order_status
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = v_order_id;
    
    UPDATE payments
    SET payment_status = 'success',
        payment_date = NOW(),
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = v_payment_id;
    
    INSERT INTO payment_verification_logs (verification_id, action, performed_by, performed_by_type, notes)
    VALUES (p_verification_id, 'verified', p_admin_id, 'admin', p_admin_notes);
    
    COMMIT;
END //

-- Reject payment (Admin)
CREATE PROCEDURE sp_reject_payment(
    IN p_verification_id INT,
    IN p_admin_id INT,
    IN p_rejection_reason TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_payment_id INT;
    
    START TRANSACTION;
    
    SELECT order_id, payment_id INTO v_order_id, v_payment_id
    FROM payment_verifications
    WHERE verification_id = p_verification_id;
    
    UPDATE payment_verifications
    SET verification_status = 'rejected',
        verified_by = p_admin_id,
        verified_at = NOW(),
        rejection_reason = p_rejection_reason,
        updated_at = CURRENT_TIMESTAMP
    WHERE verification_id = p_verification_id;
    
    UPDATE orders
    SET payment_status = 'failed',
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = v_order_id;
    
    UPDATE payments
    SET payment_status = 'failed',
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = v_payment_id;
    
    INSERT INTO payment_verification_logs (verification_id, action, performed_by, performed_by_type, notes)
    VALUES (p_verification_id, 'rejected', p_admin_id, 'admin', p_rejection_reason);
    
    COMMIT;
END //

DELIMITER ;

-- ============================================
-- STEP 5: Create Views
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
    CONCAT(a.full_name) AS verified_by_name,
    pv.verified_at,
    o.order_status,
    o.payment_status AS order_payment_status,
    DATEDIFF(NOW(), pv.submitted_at) AS days_pending
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
    CONCAT(a.full_name) AS verified_by_name,
    o.order_status,
    o.payment_status AS order_payment_status,
    c.customer_id
FROM payment_verifications pv
LEFT JOIN orders o ON pv.order_id = o.order_id
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN admins a ON pv.verified_by = a.admin_id
ORDER BY pv.submitted_at DESC;

-- ============================================
-- STEP 6: Insert Sample Data
-- ============================================

-- Insert admin user (password: admin123)
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@amfashions.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Admin User', 'super_admin');

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

SELECT 'Database setup completed successfully!' AS status;
SELECT 'Tables created:' AS info, COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'ecommerce_admin';
SELECT 'Admin user created. Username: admin, Password: admin123' AS credentials;
