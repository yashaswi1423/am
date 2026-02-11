// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import database based on environment
const usePostgres = process.env.DATABASE_URL ? true : false;
const db = usePostgres 
  ? (await import('./config/database-postgres.js')).default
  : (await import('./config/database.js')).default;

console.log(`🗄️  Using ${usePostgres ? 'PostgreSQL' : 'MySQL'} database`);
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - Allow both main website and admin dashboard
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',  // Main website
  process.env.ADMIN_URL || 'http://localhost:3001',      // Admin dashboard
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',  // Alternative port for main website
  'http://localhost:3003'   // Another alternative port
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware (development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

// Database is imported at the top based on DATABASE_URL environment variable
// PostgreSQL if DATABASE_URL exists, MySQL otherwise

// Test database connection
if (usePostgres) {
  await db.testConnection();
} else {
  db.pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    }
    console.log('✅ Database connected successfully');
    connection.release();
  });
}

// Export db for use in controllers
app.locals.db = usePostgres ? db : db.promisePool;

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Root endpoint for Vercel
app.get('/', (req, res) => {
  res.json({ 
    message: 'AM Fashions API Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders',
      customers: '/api/customers',
      dashboard: '/api/dashboard',
      analytics: '/api/analytics',
      coupons: '/api/coupons',
      paymentVerification: '/api/payment-verification',
      auth: '/api/auth'
    }
  });
});

// Test email endpoint (for debugging)
app.get('/api/test-email', async (req, res) => {
  try {
    const { testEmailConfig } = await import('./services/emailService.js');
    const result = await testEmailConfig();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import route modules
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import dashboardRoutes from './routes/dashboard.js';
import analyticsRoutes from './routes/analytics.js';
import couponRoutes from './routes/coupons.js';
import paymentVerificationRoutes from './routes/paymentVerification.js';
import authRoutes from './routes/auth.js';

// Register routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payment-verification', paymentVerificationRoutes);
app.use('/api/auth', authRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER START
// ============================================

const PORT = process.env.PORT || 5000;

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (usePostgres) {
    db.closePool().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  } else {
    db.pool.end(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  }
});

// Export for Vercel serverless
export default app;