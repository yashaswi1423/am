// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import database based on environment
const useSupabaseClient = process.env.USE_SUPABASE_CLIENT === 'true' || !process.env.DATABASE_URL;
const db = useSupabaseClient
  ? (await import('./config/database-supabase-client.js')).default
  : (await import('./config/database-postgres.js')).default;

console.log(`🗄️  Using ${useSupabaseClient ? 'Supabase Client' : 'PostgreSQL'} database`);
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - Allow both main website and admin dashboard
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview URLs and production URLs
    if (origin.includes('vercel.app') || 
        origin.includes('localhost') ||
        origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    // Allow specific origins from environment variables
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all other origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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

// Database is imported at the top based on USE_SUPABASE_CLIENT or DATABASE_URL
// Supabase Client if USE_SUPABASE_CLIENT=true, otherwise PostgreSQL

// Test database connection
await db.testConnection();

// Database is imported at the top and used directly in controllers
// No need for app.locals.db anymore

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database query
    const testQuery = await db.getOne('SELECT 1 as test');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: testQuery ? 'Connected' : 'Error'
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Error: ' + error.message
    });
  }
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

// Start server (for Render, Railway, or local development)
// Only skip for Vercel serverless
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.closePool().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  }).catch(() => {
    process.exit(0);
  });
});

// Export for Vercel serverless
export default app;