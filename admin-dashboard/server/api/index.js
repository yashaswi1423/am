// Vercel serverless function wrapper
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import database
const db = (await import('../config/database.js')).default;

const app = express();

// ============================================
// CORS - Handle at function level for Vercel
// ============================================
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================
app.get('/api/health', async (req, res) => {
  try {
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

app.get('/', (req, res) => {
  res.json({ 
    message: 'AM Fashions API Server',
    status: 'running'
  });
});

// Import routes
import productRoutes from '../routes/products.js';
import orderRoutes from '../routes/orders.js';
import customerRoutes from '../routes/customers.js';
import dashboardRoutes from '../routes/dashboard.js';
import analyticsRoutes from '../routes/analytics.js';
import couponRoutes from '../routes/coupons.js';
import paymentVerificationRoutes from '../routes/paymentVerification.js';
import authRoutes from '../routes/auth.js';

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
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Export handler for Vercel
export default async function handler(req, res) {
  // Set CORS headers explicitly
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Pass to Express
  return app(req, res);
}
