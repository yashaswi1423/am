// config/database-postgres.js
import pkg from 'pg';
const { Pool } = pkg;

// Singleton pool instance
let pool = null;

// Get or create pool
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
    });
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const currentPool = getPool();
    const client = await currentPool.connect();
    console.log('✅ PostgreSQL Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL Database connection failed:', error.message);
    return false;
  }
};

// Execute a query with error handling
const executeQuery = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const result = await currentPool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Get a single row
const getOne = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const result = await currentPool.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Get multiple rows
const getMany = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const result = await currentPool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Insert a record and return the inserted row
const insert = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    // PostgreSQL uses RETURNING clause to get inserted ID
    const sqlWithReturning = sql.includes('RETURNING') ? sql : sql + ' RETURNING *';
    const result = await currentPool.query(sqlWithReturning, params);
    return result.rows[0];
  } catch (error) {
    console.error('Insert error:', error.message);
    throw error;
  }
};

// Update records and return affected rows count
const update = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const result = await currentPool.query(sql, params);
    return result.rowCount;
  } catch (error) {
    console.error('Update error:', error.message);
    throw error;
  }
};

// Delete records and return affected rows count
const deleteRecord = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const result = await currentPool.query(sql, params);
    return result.rowCount;
  } catch (error) {
    console.error('Delete error:', error.message);
    throw error;
  }
};

// Begin transaction
const beginTransaction = async () => {
  const currentPool = getPool();
  const client = await currentPool.connect();
  await client.query('BEGIN');
  return client;
};

// Commit transaction
const commitTransaction = async (client) => {
  await client.query('COMMIT');
  client.release();
};

// Rollback transaction
const rollbackTransaction = async (client) => {
  await client.query('ROLLBACK');
  client.release();
};

// Close pool gracefully
const closePool = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('Database pool closed');
    }
  } catch (error) {
    console.error('Error closing database pool:', error.message);
    throw error;
  }
};

// Query function for direct access
const query = async (sql, params = []) => {
  const currentPool = getPool();
  return currentPool.query(sql, params);
};

export default {
  getPool,
  testConnection,
  executeQuery,
  getOne,
  getMany,
  insert,
  update,
  deleteRecord,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  closePool,
  query
};
