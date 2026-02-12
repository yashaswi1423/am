// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import database based on environment
// Prioritize USE_SUPABASE_CLIENT flag
const useSupabaseClient = process.env.USE_SUPABASE_CLIENT === 'true';
const db = useSupabaseClient
  ? (await import('./config/database-supabase-client.js')).default
  : (await import('./config/database-postgres.js')).default;

console.log(`🗄️  Using ${useSupabaseClient ? 'Supabase Client' : 'PostgreSQL'} database`);
const app = express();

// ============================================
// CORS CONFIGURATION - MUST BE FIRST
// ============================================

// Handle preflight requests first
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.status(200).end();
});

// Apply CORS to all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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