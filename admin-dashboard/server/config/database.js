// config/database.js - Main database configuration
// Automatically uses PostgreSQL for production or MySQL for local development

import dotenv from 'dotenv';
dotenv.config();

// Check if using PostgreSQL (Neon/Supabase) or MySQL
const usePostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

let db;

if (usePostgres) {
  console.log('🗄️  Using PostgreSQL database');
  // Import PostgreSQL configuration
  const postgresModule = await import('./database-postgres.js');
  db = postgresModule.default;
} else {
  console.log('🗄️  Using MySQL database');
  // Import MySQL configuration
  const mysqlModule = await import('./database-mysql.js');
  db = mysqlModule.default;
}

// Test connection on startup
await db.testConnection();

export default db;
