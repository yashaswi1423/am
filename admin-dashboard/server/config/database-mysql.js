// config/database-mysql.js - MySQL database wrapper
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Singleton pool instance
let pool = null;

// Get or create pool
const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_admin',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('✅ MySQL pool initialized');
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('✅ MySQL Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MySQL Database connection failed:', error.message);
    return false;
  }
};

// Query function for direct access
const query = async (sql, params = []) => {
  const currentPool = getPool();
  return currentPool.query(sql, params);
};

// Execute a query with error handling
const executeQuery = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const [rows] = await currentPool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Get a single row
const getOne = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const [rows] = await currentPool.query(sql, params);
    return rows[0] || null;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Get multiple rows
const getMany = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const [rows] = await currentPool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Insert a record and return the inserted ID
const insert = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const [result] = await currentPool.query(sql, params);
    return result.insertId;
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
    const [result] = await currentPool.query(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Update error:', error.message);
    throw error;
  }
};

// Delete records and return affected rows count
const deleteRecord = async (sql, params = []) => {
  try {
    const currentPool = getPool();
    const [result] = await currentPool.query(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Delete error:', error.message);
    throw error;
  }
};

// Begin transaction
const beginTransaction = async () => {
  const currentPool = getPool();
  const connection = await currentPool.getConnection();
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
