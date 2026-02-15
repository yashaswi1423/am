-- ============================================
-- E-COMMERCE ADMIN DASHBOARD - SAMPLE DATA
-- This file can be run multiple times safely
-- ============================================

USE ecommerce_admin;

-- ============================================
-- CLEAR EXISTING DATA (in correct order due to foreign keys)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM customers;
DELETE FROM coupons;
DELETE FROM admins;
DELETE FROM returns;

-- Reset auto-increment counters
ALTER TABLE admins AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE product_variants AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE order_items AUTO_INCREMENT = 1;
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE coupons AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERT ADMINS
-- Password for both: "admin123" (hashed with bcrypt)
-- ============================================
INSERT INTO admins (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@shop.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Admin User', 'super_admin'),
('manager', 'manager@shop.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Manager User', 'admin');

-- ============================================
-- INSERT CUSTOMERS
-- ============================================
INSERT INTO customers (email, password_hash, first_name, last_name, phone, address_line1, city, state, postal_code, country) VALUES
('john.doe@example.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'John', 'Doe', '+919876543210', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', 'India'),
('jane.smith@example.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Jane', 'Smith', '+919876543211', '456 Oak Avenue', 'Delhi', 'Delhi', '110001', 'India'),
('mike.johnson@example.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Mike', 'Johnson', '+919876543212', '789 Pine Road', 'Bangalore', 'Karnataka', '560001', 'India'),
('sarah.williams@example.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'Sarah', 'Williams', '+919876543213', '321 Elm Street', 'Chennai', 'Tamil Nadu', '600001', 'India'),
('david.brown@example.com', '$2a$10$rZ8qNW5zE5K5K5K5K5K5K.K5K5K5K5K5K5K5K5K5K5K5K5K5K', 'David', 'Brown', '+919876543214', '654 Maple Drive', 'Pune', 'Maharashtra', '411001', 'India');

-- ============================================
-- INSERT PRODUCTS
-- ============================================
INSERT INTO products (product_name, description, category, brand, base_price, discount_percentage, is_active, is_featured, image_url) VALUES
('Classic White T-Shirt', 'Premium cotton t-shirt, comfortable and stylish', 'T-Shirts', 'AM Fashions', 599.00, 10.00, TRUE, TRUE, '/images/tshirt-white.jpg'),
('Blue Denim Jeans', 'Comfortable slim fit jeans, perfect for casual wear', 'Jeans', 'AM Fashions', 1999.00, 15.00, TRUE, TRUE, '/images/jeans-blue.jpg'),
('Black Leather Jacket', 'Genuine leather jacket, premium quality', 'Jackets', 'AM Fashions', 4999.00, 20.00, TRUE, TRUE, '/images/jacket-black.jpg'),
('Red Hoodie', 'Warm fleece hoodie, perfect for winter', 'Hoodies', 'AM Fashions', 1299.00, 10.00, TRUE, FALSE, '/images/hoodie-red.jpg'),
('Gray Sweatpants', 'Comfortable jogger pants, ideal for workouts', 'Pants', 'AM Fashions', 899.00, 5.00, TRUE, FALSE, '/images/pants-gray.jpg'),
('White Sneakers', 'Casual sports shoes, lightweight and comfortable', 'Shoes', 'AM Fashions', 2499.00, 10.00, TRUE, TRUE, '/images/sneakers-white.jpg'),
('Summer Floral Dress', 'Beautiful floral print dress, perfect for summer', 'Dresses', 'AM Fashions', 1799.00, 15.00, TRUE, TRUE, '/images/dress-floral.jpg'),
('Navy Blue Polo Shirt', 'Classic polo shirt, smart casual', 'Shirts', 'AM Fashions', 799.00, 0.00, TRUE, FALSE, '/images/polo-navy.jpg'),
('Winter Puffer Coat', 'Heavy winter coat, keeps you warm', 'Coats', 'AM Fashions', 3999.00, 25.00, TRUE, FALSE, '/images/coat-winter.jpg'),
('Khaki Cargo Shorts', 'Multi-pocket shorts, perfect for summer', 'Shorts', 'AM Fashions', 999.00, 10.00, TRUE, FALSE, '/images/shorts-khaki.jpg');

-- ============================================
-- INSERT PRODUCT VARIANTS
-- ============================================
INSERT INTO product_variants (product_id, size, color, sku, stock_quantity, price_adjustment) VALUES
-- T-Shirt variants
(1, 'S', 'White', 'TSH-WHT-S-001', 50, 0.00),
(1, 'M', 'White', 'TSH-WHT-M-001', 75, 0.00),
(1, 'L', 'White', 'TSH-WHT-L-001', 60, 0.00),
(1, 'XL', 'White', 'TSH-WHT-XL-001', 40, 0.00),

-- Jeans variants
(2, '30', 'Blue', 'JNS-BLU-30-001', 30, 0.00),
(2, '32', 'Blue', 'JNS-BLU-32-001', 45, 0.00),
(2, '34', 'Blue', 'JNS-BLU-34-001', 35, 0.00),
(2, '36', 'Blue', 'JNS-BLU-36-001', 25, 0.00),

-- Jacket variants
(3, 'M', 'Black', 'JKT-BLK-M-001', 15, 0.00),
(3, 'L', 'Black', 'JKT-BLK-L-001', 20, 0.00),
(3, 'XL', 'Black', 'JKT-BLK-XL-001', 10, 0.00);

-- ============================================
-- INSERT ORDERS
-- ============================================
INSERT INTO orders (order_number, customer_id, order_status, payment_status, subtotal, discount_amount, tax_amount, shipping_cost, total_amount, coupon_code, shipping_address) VALUES
('ORD-2026-0001', 1, 'delivered', 'paid', 2598.00, 259.80, 467.64, 50.00, 2855.84, 'SAVE10', '123 Main Street, Mumbai, Maharashtra, 400001, India'),
('ORD-2026-0002', 2, 'shipped', 'paid', 4999.00, 999.80, 719.82, 0.00, 4719.02, 'WELCOME20', '456 Oak Avenue, Delhi, Delhi, 110001, India'),
('ORD-2026-0003', 3, 'processing', 'paid', 1999.00, 0.00, 359.82, 50.00, 2408.82, NULL, '789 Pine Road, Bangalore, Karnataka, 560001, India'),
('ORD-2026-0004', 4, 'pending', 'pending', 2598.00, 0.00, 467.64, 50.00, 3115.64, NULL, '321 Elm Street, Chennai, Tamil Nadu, 600001, India'),
('ORD-2026-0005', 5, 'delivered', 'paid', 2499.00, 0.00, 449.82, 50.00, 2998.82, NULL, '654 Maple Drive, Pune, Maharashtra, 411001, India'),
('ORD-2026-0006', 1, 'delivered', 'paid', 1799.00, 0.00, 323.82, 50.00, 2172.82, NULL, '123 Main Street, Mumbai, Maharashtra, 400001, India'),
('ORD-2026-0007', 2, 'shipped', 'paid', 1398.00, 0.00, 251.64, 50.00, 1699.64, NULL, '456 Oak Avenue, Delhi, Delhi, 110001, India');

-- ============================================
-- INSERT ORDER ITEMS
-- ============================================
INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_details, quantity, unit_price, subtotal) VALUES
-- Order 1 items
(1, 1, 2, 'Classic White T-Shirt', 'Size: M, Color: White', 2, 599.00, 1198.00),
(1, 5, NULL, 'Gray Sweatpants', 'Size: L', 1, 899.00, 899.00),
(1, 8, NULL, 'Navy Blue Polo Shirt', 'Size: M', 1, 799.00, 799.00),

-- Order 2 items
(2, 3, 9, 'Black Leather Jacket', 'Size: M, Color: Black', 1, 4999.00, 4999.00),

-- Order 3 items
(3, 2, 5, 'Blue Denim Jeans', 'Size: 30, Color: Blue', 1, 1999.00, 1999.00),

-- Order 4 items
(4, 4, NULL, 'Red Hoodie', 'Size: L', 2, 1299.00, 2598.00),

-- Order 5 items
(5, 6, NULL, 'White Sneakers', 'Size: 9', 1, 2499.00, 2499.00),

-- Order 6 items
(6, 7, NULL, 'Summer Floral Dress', 'Size: M', 1, 1799.00, 1799.00),

-- Order 7 items
(7, 1, 1, 'Classic White T-Shirt', 'Size: S, Color: White', 1, 599.00, 599.00),
(7, 8, NULL, 'Navy Blue Polo Shirt', 'Size: L', 1, 799.00, 799.00);

-- ============================================
-- INSERT PAYMENTS
-- ============================================
INSERT INTO payments (order_id, payment_method, transaction_id, payment_status, amount, payment_gateway, payment_date) VALUES
(1, 'upi', 'TXN-2026-0001', 'success', 2855.84, 'Razorpay', '2026-02-01 10:30:00'),
(2, 'credit_card', 'TXN-2026-0002', 'success', 4719.02, 'Razorpay', '2026-02-02 14:15:00'),
(3, 'debit_card', 'TXN-2026-0003', 'success', 2408.82, 'Razorpay', '2026-02-03 09:45:00'),
(4, 'cod', NULL, 'pending', 3115.64, NULL, NULL),
(5, 'upi', 'TXN-2026-0005', 'success', 2998.82, 'Razorpay', '2026-02-05 16:20:00'),
(6, 'credit_card', 'TXN-2026-0006', 'success', 2172.82, 'Razorpay', '2026-02-06 11:00:00'),
(7, 'upi', 'TXN-2026-0007', 'success', 1699.64, 'Razorpay', '2026-02-07 13:30:00');

-- ============================================
-- INSERT COUPONS
-- ============================================
INSERT INTO coupons (coupon_code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, is_active, valid_from, valid_until) VALUES
('SAVE10', '10% off on all orders above ₹500', 'percentage', 10.00, 500.00, 500.00, 100, 5, TRUE, '2026-01-01 00:00:00', '2026-12-31 23:59:59'),
('WELCOME20', '20% off for new customers', 'percentage', 20.00, 1000.00, 1000.00, 50, 3, TRUE, '2026-01-01 00:00:00', '2026-06-30 23:59:59'),
('FLAT50', 'Flat ₹50 off on orders above ₹200', 'fixed', 50.00, 200.00, 50.00, NULL, 0, TRUE, '2026-01-01 00:00:00', '2026-12-31 23:59:59'),
('SUMMER15', '15% off on summer collection', 'percentage', 15.00, 750.00, 750.00, 200, 0, TRUE, '2026-03-01 00:00:00', '2026-08-31 23:59:59'),
('NEWUSER', '25% off for first-time buyers', 'percentage', 25.00, 0.00, 1000.00, 100, 0, TRUE, '2026-01-01 00:00:00', '2026-12-31 23:59:59');

-- ============================================
-- VERIFICATION QUERIES (Optional - for testing)
-- ============================================

-- Check inserted data
-- SELECT COUNT(*) as admin_count FROM admins;
-- SELECT COUNT(*) as customer_count FROM customers;
-- SELECT COUNT(*) as product_count FROM products;
-- SELECT COUNT(*) as variant_count FROM product_variants;
-- SELECT COUNT(*) as order_count FROM orders;
-- SELECT COUNT(*) as order_item_count FROM order_items;
-- SELECT COUNT(*) as payment_count FROM payments;
-- SELECT COUNT(*) as coupon_count FROM coupons;

-- ============================================
-- END OF SEED DATA
-- ============================================
