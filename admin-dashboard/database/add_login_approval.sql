-- ============================================
-- ADD LOGIN APPROVAL SYSTEM
-- Run this SQL in phpMyAdmin after setting up the main database
-- ============================================

USE ecommerce_admin;

-- Create login_requests table for approval system
CREATE TABLE IF NOT EXISTS login_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    request_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(100) NULL,
    INDEX idx_token (request_token),
    INDEX idx_status (status),
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Add index for faster lookups
CREATE INDEX idx_expires_at ON login_requests(expires_at);

SELECT 'Login approval table created successfully!' as message;
