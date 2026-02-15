// Vercel serverless entry point
// Updated: 2026-02-15 23:30 - Force rebuild v1.0.3
// AM Fashions Backend API - Serverless Function
import app from './server.js';

// Export the Express app as a Vercel serverless function
export default async (req, res) => {
  // Ensure CORS headers are set
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin');
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass to Express app
  return app(req, res);
};

