-- ============================================
-- ADD LOGIN_REQUESTS TABLE FOR POSTGRESQL/SUPABASE
-- Run this in Supabase SQL Editor to add admin login approval functionality
-- ============================================

-- Create login_requests table for admin login approval system
CREATE TABLE IF NOT EXISTS login_requests (
    request_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    request_token VARCHAR(100) NOT NULL UNIQUE,
    ip_address VARCHAR(50) NULL,
    user_agent TEXT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_login_requests_token ON login_requests(request_token);
CREATE INDEX IF NOT EXISTS idx_login_requests_status ON login_requests(status);
CREATE INDEX IF NOT EXISTS idx_login_requests_expires_at ON login_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_login_requests_username ON login_requests(username);

-- Add comment
COMMENT ON TABLE login_requests IS 'Stores admin login approval requests with email verification';

SELECT 'Login requests table created successfully!' as message;
