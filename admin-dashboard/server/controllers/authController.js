// controllers/authController.js
import { sendLoginApprovalRequest } from '../services/emailService.js';
import crypto from 'crypto';

// Request admin login approval
export const requestLoginApproval = async (req, res) => {
  try {
    const { username } = req.body;
    const db = req.app.locals.db;
    
    // Get client information
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
    const userAgent = req.get('user-agent') || 'Unknown';
    const timestamp = new Date().toISOString();

    // Generate unique approval token
    const approvalToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save login request to database
    const insertQuery = `
      INSERT INTO login_requests 
      (username, request_token, ip_address, user_agent, expires_at, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    
    await db.execute(insertQuery, [
      username,
      approvalToken,
      ipAddress,
      userAgent,
      expiresAt
    ]);

    // Prepare approval request details
    const requestDetails = {
      username,
      ipAddress,
      userAgent,
      timestamp,
      approvalToken
    };

    // Send approval email
    const emailResult = await sendLoginApprovalRequest(requestDetails);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Approval request sent. Please check your email.',
        requestToken: approvalToken
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send approval email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error in requestLoginApproval:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Check login approval status
export const checkApprovalStatus = async (req, res) => {
  try {
    const { token } = req.query;
    const db = req.app.locals.db;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Check request status
    const query = `
      SELECT status, expires_at, username
      FROM login_requests
      WHERE request_token = ?
    `;
    
    const [rows] = await db.execute(query, [token]);

    if (rows.length === 0) {
      return res.json({
        success: false,
        status: 'invalid',
        message: 'Invalid or expired request'
      });
    }

    const request = rows[0];
    const now = new Date();
    const expiresAt = new Date(request.expires_at);

    // Check if expired
    if (now > expiresAt && request.status === 'pending') {
      // Update status to expired
      await db.execute(
        'UPDATE login_requests SET status = ? WHERE request_token = ?',
        ['expired', token]
      );
      
      return res.json({
        success: false,
        status: 'expired',
        message: 'Request has expired. Please try logging in again.'
      });
    }

    res.json({
      success: true,
      status: request.status,
      username: request.username,
      message: request.status === 'approved' ? 'Login approved!' : 
               request.status === 'rejected' ? 'Login rejected' :
               'Waiting for approval...'
    });

  } catch (error) {
    console.error('Error in checkApprovalStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Handle approval/rejection from email link
export const handleApprovalAction = async (req, res) => {
  try {
    const { token, action } = req.query;
    const db = req.app.locals.db;

    if (!token || !action) {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .error { color: #dc3545; font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error">❌</div>
              <h2>Invalid Request</h2>
              <p>The approval link is invalid or incomplete.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Check if request exists and is pending
    const checkQuery = `
      SELECT status, expires_at, username
      FROM login_requests
      WHERE request_token = ?
    `;
    
    const [rows] = await db.execute(checkQuery, [token]);

    if (rows.length === 0) {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .error { color: #dc3545; font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="error">❌</div>
              <h2>Request Not Found</h2>
              <p>This login request does not exist or has already been processed.</p>
            </div>
          </body>
        </html>
      `);
    }

    const request = rows[0];
    const now = new Date();
    const expiresAt = new Date(request.expires_at);

    // Check if expired
    if (now > expiresAt) {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .warning { color: #ffc107; font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="warning">⏰</div>
              <h2>Request Expired</h2>
              <p>This login request has expired. The user will need to try logging in again.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Check if already processed
    if (request.status !== 'pending') {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .info { color: #17a2b8; font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="info">ℹ️</div>
              <h2>Already Processed</h2>
              <p>This login request has already been ${request.status}.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Update status based on action
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const updateQuery = `
      UPDATE login_requests
      SET status = ?, approved_at = NOW(), approved_by = ?
      WHERE request_token = ?
    `;
    
    await db.execute(updateQuery, [newStatus, 'admin', token]);

    // Send success response
    if (action === 'approve') {
      res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
              .success { color: #28a745; font-size: 64px; animation: bounce 0.5s; }
              @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
              h2 { color: #28a745; }
              .username { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✅</div>
              <h2>Login Approved!</h2>
              <p>You have successfully approved the login request for:</p>
              <div class="username">${request.username}</div>
              <p>The user can now access the admin dashboard.</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">You can close this window.</p>
            </div>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); }
              .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
              .reject { color: #dc3545; font-size: 64px; animation: shake 0.5s; }
              @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
              h2 { color: #dc3545; }
              .username { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="reject">🚫</div>
              <h2>Login Rejected</h2>
              <p>You have rejected the login request for:</p>
              <div class="username">${request.username}</div>
              <p>The user will not be able to access the admin dashboard.</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">You can close this window.</p>
            </div>
          </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('Error in handleApprovalAction:', error);
    res.status(500).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .error { color: #dc3545; font-size: 48px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error">❌</div>
            <h2>Server Error</h2>
            <p>An error occurred while processing your request. Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }
};

export default {
  requestLoginApproval,
  checkApprovalStatus,
  handleApprovalAction
};
