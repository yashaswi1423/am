// controllers/paymentVerificationController.js
import db from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { uploadFile, deleteFile, getPublicUrl } from '../services/supabaseStorage.js';
import { sendPaymentConfirmation } from '../services/emailService.js';

// Configure multer for memory storage (we'll upload to Supabase instead of disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const uploadMiddleware = upload.single('screenshot');

/* ===========================
   POST /api/payment-verification/submit
   Submit payment verification with screenshot
=========================== */
export const submitPaymentVerification = async (req, res) => {
  try {
    console.log('Payment verification request received');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'Present' : 'Missing');

    const {
      order_id,
      transaction_id,
      payment_method,
      payment_amount,
      customer_name,
      customer_email,
      customer_phone
    } = req.body;

    // Validate required fields
    if (!order_id || !transaction_id || !payment_amount || !customer_name || !customer_email) {
      console.error('Missing required fields:', { order_id, transaction_id, payment_amount, customer_name, customer_email });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot is required'
      });
    }

    console.log('Uploading file to Supabase...');
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'payment-' + uniqueSuffix + path.extname(req.file.originalname);

    // Upload to Supabase Storage
    let uploadResult;
    try {
      uploadResult = await uploadFile(
        req.file.buffer,
        fileName,
        req.file.mimetype
      );
      console.log('File uploaded successfully:', uploadResult);
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      // Fallback: use a placeholder URL if Supabase upload fails
      console.warn('Using fallback - storing without Supabase URL');
      uploadResult = {
        path: fileName,
        url: `https://placeholder.com/screenshots/${fileName}` // Placeholder
      };
    }

    console.log('Inserting verification record...');
    // Insert verification record with Supabase URL
    const verificationId = await db.insert(
      `INSERT INTO payment_verifications 
       (order_id, transaction_id, payment_method, payment_amount, screenshot_path, screenshot_filename, screenshot_url, customer_name, customer_email, customer_phone, verification_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        transaction_id,
        payment_method || 'upi',
        payment_amount,
        uploadResult.path,
        fileName,
        uploadResult.url,
        customer_name,
        customer_email,
        customer_phone || null,
        'pending'
      ]
    );

    console.log('Verification record inserted:', verificationId);

    res.status(201).json({
      success: true,
      message: 'Payment verification submitted successfully',
      data: {
        verification_id: verificationId,
        order_id,
        transaction_id,
        status: 'pending_verification',
        screenshot_url: uploadResult.url
      }
    });
  } catch (error) {
    console.error('Submit payment verification error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/pending
   Get all pending verifications (Admin)
=========================== */
export const getPendingVerifications = async (req, res) => {
  try {
    const verifications = await db.getMany(
      `SELECT 
        pv.*,
        o.order_number,
        o.order_status,
        (c.first_name || ' ' || c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
       FROM payment_verifications pv
       LEFT JOIN orders o ON pv.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE pv.verification_status = ?
       ORDER BY pv.created_at ASC`,
      ['pending']
    );

    res.json({
      success: true,
      data: verifications,
      count: verifications.length
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/all
   Get all verifications (Admin)
=========================== */
export const getAllVerifications = async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;
    
    let query = `SELECT 
      pv.*,
      o.order_number,
      o.order_status,
      (c.first_name || ' ' || c.last_name) as customer_name,
      c.email as customer_email,
      c.phone as customer_phone
     FROM payment_verifications pv
     LEFT JOIN orders o ON pv.order_id = o.order_id
     LEFT JOIN customers c ON o.customer_id = c.customer_id`;
    const params = [];
    
    if (status) {
      query += ` WHERE pv.verification_status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY pv.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const verifications = await db.getMany(query, params);

    res.json({
      success: true,
      data: verifications,
      count: verifications.length
    });
  } catch (error) {
    console.error('Get all verifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/:id
   Get verification by ID
=========================== */
export const getVerificationById = async (req, res) => {
  try {
    const verification = await db.getOne(
      `SELECT 
        pv.*,
        o.order_number,
        o.order_status,
        (c.first_name || ' ' || c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
       FROM payment_verifications pv
       LEFT JOIN orders o ON pv.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE pv.verification_id = ?`,
      [req.params.id]
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Get verification by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   POST /api/payment-verification/:id/verify
   Verify payment (Admin action)
=========================== */
export const verifyPayment = async (req, res) => {
  try {
    const { admin_id, admin_notes } = req.body;
    const verification_id = req.params.id;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required'
      });
    }

    // Get verification details before updating
    const verification = await db.getOne(
      `SELECT 
        pv.*,
        o.order_number
       FROM payment_verifications pv
       LEFT JOIN orders o ON pv.order_id = o.order_id
       WHERE pv.verification_id = ?`,
      [verification_id]
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    console.log('📋 Verification details:', {
      id: verification.verification_id,
      email: verification.customer_email,
      name: verification.customer_name,
      orderId: verification.order_id,
      amount: verification.payment_amount
    });

    // Update verification status
    await db.update(
      `UPDATE payment_verifications 
       SET verification_status = 'verified', verified_at = NOW(), verified_by = ?, admin_notes = ?
       WHERE verification_id = ?`,
      [admin_id, admin_notes || 'Payment verified', verification_id]
    );

    // Send payment confirmation email to customer
    console.log('📧 Preparing to send payment confirmation email...');
    
    if (!verification.customer_email) {
      console.error('❌ Customer email not found in verification record');
      console.error('❌ Verification data:', JSON.stringify(verification, null, 2));
      
      return res.json({
        success: true,
        message: 'Payment verified successfully',
        emailSent: false,
        emailError: 'Customer email not found in verification record'
      });
    }
    
    console.log('📧 Sending email to:', verification.customer_email);
    
    try {
      const emailResult = await sendPaymentConfirmation({
        customerEmail: verification.customer_email,
        customerName: verification.customer_name || 'Valued Customer',
        orderId: verification.order_id,
        transactionId: verification.transaction_id,
        paymentAmount: verification.payment_amount,
        verifiedAt: new Date()
      });

      if (emailResult.success) {
        console.log('✅ Payment confirmation email sent successfully to:', verification.customer_email);
      } else {
        console.error('❌ Failed to send payment confirmation email:', emailResult.error);
        console.error('❌ Email error details:', emailResult.details);
      }
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.error
      });
    } catch (emailError) {
      console.error('❌ Exception while sending email:', emailError);
      console.error('❌ Email exception stack:', emailError.stack);
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        emailSent: false,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   POST /api/payment-verification/:id/reject
   Reject payment (Admin action)
=========================== */
export const rejectPayment = async (req, res) => {
  try {
    const { admin_id, rejection_reason } = req.body;
    const verification_id = req.params.id;

    if (!admin_id || !rejection_reason) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID and rejection reason are required'
      });
    }

    // Update verification status
    await db.update(
      `UPDATE payment_verifications 
       SET verification_status = 'rejected', verified_at = NOW(), verified_by = ?, admin_notes = ?
       WHERE verification_id = ?`,
      [admin_id, rejection_reason, verification_id]
    );

    res.json({
      success: true,
      message: 'Payment rejected successfully'
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/screenshot/:filename
   Get screenshot URL (returns the Supabase URL)
=========================== */
export const getScreenshot = async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Get verification by filename to get the URL
    const verification = await db.getOne(
      `SELECT screenshot_url, screenshot_path FROM payment_verifications WHERE screenshot_filename = ?`,
      [filename]
    );

    if (!verification || !verification.screenshot_url) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot not found'
      });
    }

    // Redirect to Supabase public URL
    res.redirect(verification.screenshot_url);
  } catch (error) {
    console.error('Get screenshot error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/order/:orderId
   Get verification by order ID
=========================== */
export const getVerificationByOrderId = async (req, res) => {
  try {
    const verification = await db.getOne(
      `SELECT 
        pv.*,
        o.order_number,
        o.order_status,
        (c.first_name || ' ' || c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
       FROM payment_verifications pv
       LEFT JOIN orders o ON pv.order_id = o.order_id
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE pv.order_id = ?
       ORDER BY pv.created_at DESC
       LIMIT 1`,
      [req.params.orderId]
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'No verification found for this order'
      });
    }

    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Get verification by order ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===========================
   GET /api/payment-verification/stats
   Get verification statistics (Admin)
=========================== */
export const getVerificationStats = async (req, res) => {
  try {
    const stats = await db.getMany(
      `SELECT 
        verification_status,
        COUNT(*) as count,
        SUM(payment_amount) as total_amount
       FROM payment_verifications
       GROUP BY verification_status`
    );

    const totalPending = await db.getOne(
      `SELECT COUNT(*) as count FROM payment_verifications WHERE verification_status = 'pending'`
    );

    res.json({
      success: true,
      data: {
        by_status: stats,
        pending_count: totalPending.count
      }
    });
  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
