// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// JWT Secret - Should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Special case: Handle main admin token
    if (token === 'main-admin-token') {
      req.user = {
        id: 1,
        email: 'admin@amfashions.com',
        role: 'superadmin',
        status: 'active',
        username: 'admin'
      };
      return next();
    }

    // Check if it's an approval token (not a JWT)
    if (token.length === 64 && !token.includes('.')) {
      // This is likely an approval token from login_requests
      const approvalQuery = `
        SELECT username, status, expires_at
        FROM login_requests
        WHERE request_token = ? AND status = 'approved'
      `;
      
      const approval = await db.getOne(approvalQuery, [token]);
      
      if (approval) {
        const now = new Date();
        const expiresAt = new Date(approval.expires_at);
        
        // Check if not expired (give 24 hours after approval)
        if (now < new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000)) {
          req.user = {
            id: 2,
            email: `${approval.username}@amfashions.com`,
            role: 'admin',
            status: 'active',
            username: approval.username
          };
          return next();
        }
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired approval token.' 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user exists in database
    const user = await db.getOne(
      'SELECT id, email, role, status FROM admins WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive.' 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }

  next();
};

// Check if user is superadmin
export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Super admin privileges required.' 
    });
  }

  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.getOne(
      'SELECT id, email, role, status FROM admins WHERE id = ?',
      [decoded.id]
    );

    if (user && user.status === 'active') {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Generate JWT token
export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify refresh token
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token required.' 
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    const user = await db.getOne(
      'SELECT id, email, role, status FROM admins WHERE id = ?',
      [decoded.id]
    );

    if (!user || user.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid refresh token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired refresh token.' 
    });
  }
};

// Export alias for compatibility
export const authenticateToken = verifyToken;

export default {
  verifyToken,
  authenticateToken,
  isAdmin,
  isSuperAdmin,
  optionalAuth,
  generateToken,
  verifyRefreshToken
};
