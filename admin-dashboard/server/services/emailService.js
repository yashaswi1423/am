// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const EMAIL_CONFIG = {
  // Gmail configuration
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'madasumiteesh@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'mnfc xdxe ojpi rtzf'
  }
};

// Admin notification email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'madasumiteesh@gmail.com';

// Create transporter
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Send admin login approval request
export const sendLoginApprovalRequest = async (requestDetails) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('Email transporter not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const { username, ipAddress, timestamp, userAgent, approvalToken } = requestDetails;

  // Create approval and rejection links
  const approvalLink = `http://localhost:5000/api/auth/approve-login?token=${approvalToken}&action=approve`;
  const rejectLink = `http://localhost:5000/api/auth/approve-login?token=${approvalToken}&action=reject`;

  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: ADMIN_EMAIL,
    subject: '🔐 Admin Login Approval Required - Action Needed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .alert-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .info-table td:first-child {
            font-weight: bold;
            width: 150px;
            color: #ff6b6b;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          .approve-button {
            display: inline-block;
            padding: 15px 40px;
            margin: 10px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            transition: all 0.3s;
          }
          .reject-button {
            display: inline-block;
            padding: 15px 40px;
            margin: 10px;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
            transition: all 0.3s;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
          .warning {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            color: #721c24;
          }
          .expires {
            text-align: center;
            color: #856404;
            font-weight: bold;
            margin: 15px 0;
            padding: 10px;
            background: #fff3cd;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🔐</div>
            <h1 style="margin: 0;">Login Approval Required</h1>
            <p style="margin: 10px 0 0 0;">Someone is trying to access your admin dashboard</p>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚠️ Action Required:</strong> A login attempt requires your approval before access is granted.
            </div>
            
            <h2 style="color: #ff6b6b;">Login Request Details</h2>
            <table class="info-table">
              <tr>
                <td>👤 Username:</td>
                <td><strong>${username}</strong></td>
              </tr>
              <tr>
                <td>🕐 Time:</td>
                <td>${new Date(timestamp).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'full',
                  timeStyle: 'long'
                })}</td>
              </tr>
              <tr>
                <td>🌐 IP Address:</td>
                <td>${ipAddress || 'Unknown'}</td>
              </tr>
              <tr>
                <td>💻 Device:</td>
                <td>${userAgent || 'Unknown'}</td>
              </tr>
            </table>
            
            <div class="expires">
              ⏰ This request will expire in 10 minutes
            </div>

            <div class="button-container">
              <h3 style="margin-top: 0; color: #333;">Choose Your Action:</h3>
              <a href="${approvalLink}" class="approve-button">
                ✅ APPROVE LOGIN
              </a>
              <br>
              <a href="${rejectLink}" class="reject-button">
                ❌ REJECT LOGIN
              </a>
            </div>
            
            <div class="warning">
              <strong>🛡️ Security Warning:</strong><br>
              • Only approve if you recognize this login attempt<br>
              • If you didn't initiate this login, click REJECT immediately<br>
              • Consider changing your password if you see suspicious activity<br>
              • This link will expire in 10 minutes for security
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated security notification from your Admin Dashboard.</p>
            <p>If you didn't request this login, please reject it and secure your account.</p>
            <p>© ${new Date().getFullYear()} AM Fashions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Admin Dashboard Login Approval Required
      
      Someone is trying to access your admin dashboard and needs your approval.
      
      Login Request Details:
      - Username: ${username}
      - Time: ${new Date(timestamp).toLocaleString()}
      - IP Address: ${ipAddress || 'Unknown'}
      - Device: ${userAgent || 'Unknown'}
      
      APPROVE LOGIN: ${approvalLink}
      
      REJECT LOGIN: ${rejectLink}
      
      This request will expire in 10 minutes.
      
      If you didn't request this login, please reject it immediately.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Login approval request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending login approval email:', error);
    return { success: false, error: error.message };
  }
};

// Send login notification
export const sendLoginNotification = async (loginDetails) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('Email transporter not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const { username, ipAddress, timestamp, userAgent } = loginDetails;

  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: ADMIN_EMAIL,
    subject: '🔐 Admin Dashboard Login Alert',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .alert-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .info-table td:first-child {
            font-weight: bold;
            width: 150px;
            color: #667eea;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🔐</div>
            <h1 style="margin: 0;">Admin Login Alert</h1>
            <p style="margin: 10px 0 0 0;">Someone just logged into your admin dashboard</p>
          </div>
          
          <div class="content">
            <div class="alert-box">
              <strong>⚠️ Security Notice:</strong> A new admin login was detected on your dashboard.
            </div>
            
            <h2 style="color: #667eea;">Login Details</h2>
            <table class="info-table">
              <tr>
                <td>👤 Username:</td>
                <td><strong>${username}</strong></td>
              </tr>
              <tr>
                <td>🕐 Time:</td>
                <td>${new Date(timestamp).toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'full',
                  timeStyle: 'long'
                })}</td>
              </tr>
              <tr>
                <td>🌐 IP Address:</td>
                <td>${ipAddress || 'Unknown'}</td>
              </tr>
              <tr>
                <td>💻 Device:</td>
                <td>${userAgent || 'Unknown'}</td>
              </tr>
            </table>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <strong>🛡️ Security Tip:</strong> If this wasn't you, please change your admin password immediately and review your security settings.
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated security notification from your Admin Dashboard.</p>
            <p>© ${new Date().getFullYear()} AM Fashions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Admin Dashboard Login Alert
      
      Someone just logged into your admin dashboard.
      
      Login Details:
      - Username: ${username}
      - Time: ${new Date(timestamp).toLocaleString()}
      - IP Address: ${ipAddress || 'Unknown'}
      - Device: ${userAgent || 'Unknown'}
      
      If this wasn't you, please change your admin password immediately.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Login notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending login notification email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  const transporter = createTransporter();
  
  if (!transporter) {
    return { success: false, error: 'Email transporter not configured' };
  }

  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendLoginApprovalRequest,
  sendLoginNotification,
  testEmailConfig
};
