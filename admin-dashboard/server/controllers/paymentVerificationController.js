// controllers/paymentVerificationController.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/payment-screenshots';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
    const db = req.app.locals.db;
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
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot is required'
      });
    }

    const screenshot_path = req.file.path;
    const screenshot_filename = req.file.filename;

    // Insert verification record
    const result = await db.query(
      `INSERT INTO payment_verifications 
       (order_id, transaction_id, payment_method, payment_amount, screenshot_path, screenshot_filename, customer_name, customer_email, customer_phone, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING verification_id`,
      [
        order_id,
        transaction_id,
        payment_method || 'upi',
        payment_amount,
        screenshot_path,
        screenshot_filename,
        customer_name,
        customer_email,
        customer_phone || null
      ]
    );

    const verification_id = result.rows[0].verification_id;

    res.status(201).json({
      success: true,
      message: 'Payment verification submitted successfully',
      data: {
        verification_id,
        order_id,
        transaction_id,
        status: 'pending_verification'
      }
    });
  } catch (error) {
    console.error('Submit payment verification error:', error);
    
    // Delete uploaded file if database operation failed
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
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
    const db = req.app.locals.db;
    const verifications = await db.getMany(
      `SELECT * FROM vw_pending_verifications ORDER BY submitted_at ASC`
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
    const db = req.app.locals.db;
    const { status, limit = 100, offset = 0 } = req.query;
    
    let query = `SELECT * FROM vw_all_verifications`;
    const params = [];
    
    if (status) {
      query += ` WHERE verification_status = $1`;
      params.push(status);
    }
    
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
    const db = req.app.locals.db;
    const verification = await db.getOne(
      `SELECT * FROM vw_all_verifications WHERE verification_id = $1`,
      [req.params.id]
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    // Get verification logs
    const logs = await db.getMany(
      `SELECT * FROM payment_verification_logs WHERE verification_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...verification,
        logs
      }
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
    const db = req.app.locals.db;
    const { admin_id, admin_notes } = req.body;
    const verification_id = req.params.id;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required'
      });
    }

    // Update verification status
    await db.update(
      `UPDATE payment_verifications 
       SET verification_status = 'verified', verified_at = NOW(), verified_by = $1, admin_notes = $2
       WHERE verification_id = $3`,
      [admin_id, admin_notes || 'Payment verified', verification_id]
    );

    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
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
    const db = req.app.locals.db;
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
       SET verification_status = 'rejected', verified_at = NOW(), verified_by = $1, admin_notes = $2
       WHERE verification_id = $3`,
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
   Serve payment screenshot
=========================== */
export const getScreenshot = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join('uploads', 'payment-screenshots', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot not found'
      });
    }

    res.sendFile(path.resolve(filepath));
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
    const db = req.app.locals.db;
    const verification = await db.getOne(
      `SELECT * FROM vw_all_verifications WHERE order_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
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
    const db = req.app.locals.db;
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
