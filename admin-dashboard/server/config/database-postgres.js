// config/database-postgres.js
import pkg from 'pg';
const { Pool } = pkg;

// Singleton pool instance
let pool = null;

// Get or create pool
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    
    pool.on('error', (err) => {
      console.error('Database pool error:', err.message);
    });
    
    console.log('✅ PostgreSQL pool initialized');
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const currentPool = getPool();
    const client = await currentPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL Database connection failed:', error.message);
    return false;
  }
};

// Helper function to convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
const convertPlaceholders = (sql) => {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
};

// Query function for direct access with automatic parameter conversion
const query = async (sql, params = []) => {
  const currentPool = getPool();
  const convertedSql = convertPlaceholders(sql);
  return currentPool.query(convertedSql, params);
};

// Execute a query with error handling and automatic parameter conversion
const executeQuery = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const convertedSql = convertPlaceholders(sql);
    const result = await currentPool.query(convertedSql, params);
    return result.rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Get a single row with automatic parameter conversion
const getOne = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const convertedSql = convertPlaceholders(sql);
    const result = await currentPool.query(convertedSql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Get multiple rows with automatic parameter conversion
const getMany = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const convertedSql = convertPlaceholders(sql);
    const result = await currentPool.query(convertedSql, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Insert a record and return the inserted row (for MySQL compatibility)
const insert = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const convertedSql = convertPlaceholders(sql);
    // Add RETURNING clause if not present
    const sqlWithReturning = convertedSql.includes('RETURNING') 
      ? convertedSql 
      : convertedSql.replace(/;?\s*$/, ' RETURNING *;');
    
    const result = await currentPool.query(sqlWithReturning, params);
    
    // Return the full row object (not just the ID)
    if (result.rows && result.rows.length > 0) {
      return result.rows[0];
    }
    return result;
  } catch (error) {
    console.error('Insert error:', error.message);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

// Update records and return affected rows count
const update = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const convertedSql = convertPlaceholders(sql);
    const result = await currentPool.query(convertedSql, params);
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
    const convertedSql = convertPlaceholders(sql);
    const result = await currentPool.query(convertedSql, params);
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
