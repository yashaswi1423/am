// config/database.js - Main database configuration
// Automatically uses PostgreSQL for Supabase or MySQL for local development

import dotenv from 'dotenv';
dotenv.config();

// Check if using Supabase/PostgreSQL or MySQL
const usePostgres = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NODE_ENV === 'production';

let db;

if (usePostgres) {
  console.log('🗄️  Using PostgreSQL database (Supabase)');
  const { default: postgresDb } = await import('./database-postgres.js');
  db = postgresDb;
} else {
  console.log('🗄️  Using MySQL database (Local)');
  const { default: mysqlDb } = await import('./database.js');
  db = mysqlDb;
}

export default db;