-- Add login_requests table for admin login approval system
USE ecommerce_admin;

-- Create login_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS login_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    request_token VARCHAR(100) NOT NULL UNIQUE,
    ip_address VARCHAR(50) NULL,
    user_agent TEXT NULL,
    status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    expires_at DATETIME NOT NULL,
    approved_at DATETIME NULL,
    approved_by VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_request_token (request_token),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- Show success message
SELECT 'Login approval table created successfully!' AS status;
