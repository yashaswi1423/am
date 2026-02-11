-- ============================================
-- PAYMENT VERIFICATION SYSTEM
-- This adds payment verification functionality
-- ============================================

USE ecommerce_admin;

-- ============================================
-- TABLE: payment_verifications
-- Purpose: Store payment verification details with screenshots
-- ============================================
CREATE TABLE IF NOT EXISTS payment_verifications (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_id INT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'upi',
    payment_amount DECIMAL(10, 2) NOT NULL,
    screenshot_path VARCHAR(500) NULL,
    screenshot_filename VARCHAR(255) NULL,
    
    -- Verification status
    verification_status ENUM('pending', 'verified', 'rejected', 'under_review') DEFAULT 'pending',
    
    -- Customer details (for reference)
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    
    -- Admin verification details
    verified_by INT NULL,
    verified_at DATETIME NULL,
    rejection_reason TEXT NULL,
    admin_notes TEXT NULL,
    
    -- Timestamps
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_order_id (order_id),
    INDEX idx_payment_id (payment_id),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_verification_status (verification_status),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB;

-- ============================================
-- Update payments table to support pending_verification status
-- ============================================
ALTER TABLE payments 
MODIFY COLUMN payment_status ENUM('pending', 'pending_verification', 'success', 'failed', 'refunded') DEFAULT 'pending';

-- ============================================
-- Update orders table to support pending_verification status
-- ============================================
ALTER TABLE orders 
MODIFY COLUMN payment_status ENUM('pending', 'pending_verification', 'paid', 'failed', 'refunded') DEFAULT 'pending';

-- ============================================
-- Add transaction_id to payments table if not exists
-- ============================================
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100) NULL AFTER payment_method;

-- ============================================
-- TABLE: payment_verification_logs
-- Purpose: Track all verification actions for audit trail
-- ============================================
CREATE TABLE IF NOT EXISTS payment_verification_logs (
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
-- STORED PROCEDURE: Submit Payment Verification
-- ============================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_submit_payment_verification(
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
    
    -- Start transaction
    START TRANSACTION;
    
    -- Get payment_id from order
    SELECT payment_id INTO v_payment_id
    FROM payments
    WHERE order_id = p_order_id
    LIMIT 1;
    
    -- Insert verification record
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
    
    -- Update order payment status
    UPDATE orders 
    SET payment_status = 'pending_verification',
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
    
    -- Update payment record
    UPDATE payments 
    SET payment_status = 'pending_verification',
        transaction_id = p_transaction_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = p_order_id;
    
    -- Log the action
    INSERT INTO payment_verification_logs (verification_id, action, performed_by_type, notes)
    VALUES (v_verification_id, 'submitted', 'customer', 'Payment verification submitted by customer');
    
    COMMIT;
    
    -- Return verification ID
    SELECT v_verification_id AS verification_id;
END //

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Verify Payment (Admin Action)
-- ============================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_verify_payment(
    IN p_verification_id INT,
    IN p_admin_id INT,
    IN p_admin_notes TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_payment_id INT;
    
    START TRANSACTION;
    
    -- Get order and payment IDs
    SELECT order_id, payment_id INTO v_order_id, v_payment_id
    FROM payment_verifications
    WHERE verification_id = p_verification_id;
    
    -- Update verification status
    UPDATE payment_verifications
    SET verification_status = 'verified',
        verified_by = p_admin_id,
        verified_at = NOW(),
        admin_notes = p_admin_notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE verification_id = p_verification_id;
    
    -- Update order status
    UPDATE orders
    SET payment_status = 'paid',
        order_status = CASE 
            WHEN order_status = 'pending' THEN 'confirmed'
            ELSE order_status
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = v_order_id;
    
    -- Update payment status
    UPDATE payments
    SET payment_status = 'success',
        payment_date = NOW(),
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = v_payment_id;
    
    -- Log the action
    INSERT INTO payment_verification_logs (verification_id, action, performed_by, performed_by_type, notes)
    VALUES (p_verification_id, 'verified', p_admin_id, 'admin', p_admin_notes);
    
    COMMIT;
END //

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Reject Payment (Admin Action)
-- ============================================
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_reject_payment(
    IN p_verification_id INT,
    IN p_admin_id INT,
    IN p_rejection_reason TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_payment_id INT;
    
    START TRANSACTION;
    
    -- Get order and payment IDs
    SELECT order_id, payment_id INTO v_order_id, v_payment_id
    FROM payment_verifications
    WHERE verification_id = p_verification_id;
    
    -- Update verification status
    UPDATE payment_verifications
    SET verification_status = 'rejected',
        verified_by = p_admin_id,
        verified_at = NOW(),
        rejection_reason = p_rejection_reason,
        updated_at = CURRENT_TIMESTAMP
    WHERE verification_id = p_verification_id;
    
    -- Update order status
    UPDATE orders
    SET payment_status = 'failed',
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = v_order_id;
    
    -- Update payment status
    UPDATE payments
    SET payment_status = 'failed',
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_id = v_payment_id;
    
    -- Log the action
    INSERT INTO payment_verification_logs (verification_id, action, performed_by, performed_by_type, notes)
    VALUES (p_verification_id, 'rejected', p_admin_id, 'admin', p_rejection_reason);
    
    COMMIT;
END //

DELIMITER ;

-- ============================================
-- VIEW: Pending Payment Verifications (for Admin Dashboard)
-- ============================================
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

-- ============================================
-- VIEW: All Payment Verifications (for Admin Dashboard)
-- ============================================
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
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert a sample pending verification
-- INSERT INTO payment_verifications (
--     order_id, transaction_id, payment_method, payment_amount,
--     customer_name, customer_email, customer_phone,
--     verification_status
-- ) VALUES (
--     1, 'TEST123456789012', 'upi', 2855.84,
--     'Test Customer', 'test@example.com', '+919876543210',
--     'pending'
-- );

-- ============================================
-- USEFUL QUERIES FOR ADMIN
-- ============================================

-- Get all pending verifications
-- SELECT * FROM vw_pending_verifications;

-- Get verification history for an order
-- SELECT * FROM payment_verification_logs WHERE verification_id = ?;

-- Get statistics
-- SELECT 
--     verification_status,
--     COUNT(*) as count,
--     SUM(payment_amount) as total_amount
-- FROM payment_verifications
-- GROUP BY verification_status;

-- ============================================
-- END OF PAYMENT VERIFICATION SCHEMA
-- ============================================
