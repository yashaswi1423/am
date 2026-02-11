// config/database.js
import mysql from 'mysql2';

// Create a connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_admin',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Promisify the pool for async/await usage
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Execute a query with error handling
const executeQuery = async (sql, params = []) => {
  try {
    const [results] = await promisePool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Get a single row
const getOne = async (sql, params = []) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows[0] || null;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Get multiple rows
const getMany = async (sql, params = []) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Insert a record and return the inserted ID
const insert = async (sql, params = []) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error('Insert error:', error.message);
    throw error;
  }
};

// Update records and return affected rows count
const update = async (sql, params = []) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Update error:', error.message);
    throw error;
  }
};

// Delete records and return affected rows count
const deleteRecord = async (sql, params = []) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Delete error:', error.message);
    throw error;
  }
};

// Begin transaction
const beginTransaction = async () => {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();
  return connection;
};

// Commit transaction
const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

// Rollback transaction
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

// Close pool gracefully
const closePool = () => {
  return new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) {
        console.error('Error closing database pool:', err.message);
        reject(err);
      } else {
        console.log('Database pool closed');
        resolve();
      }
    });
  });
};

export default {
  pool,
  promisePool,
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
  query: promisePool.query.bind(promisePool) // Add query method for stored procedures
};