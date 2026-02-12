// config/database-supabase-client.js
// Using Supabase Client for reliable serverless connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  throw new Error('Supabase credentials not configured');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

console.log('✅ Supabase client initialized');

// Helper to execute raw SQL via Supabase RPC
const executeSQL = async (sql, params = []) => {
  // For Supabase, we'll use the table API instead of raw SQL
  // This is more reliable and doesn't require RPC functions
  throw new Error('Use table API methods instead of raw SQL');
};

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('product_id').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// Get one record - use RPC to execute SQL
const getOne = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sql,
      params: params.map(p => String(p))
    });
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
};

// Get many records
const getMany = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sql,
      params: params.map(p => String(p))
    });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
};

// Insert record
const insert = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sql, 
      params: params 
    });
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Insert error:', error.message);
    throw error;
  }
};

// Update records
const update = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sql, 
      params: params 
    });
    
    if (error) throw error;
    return data ? data.length : 0;
  } catch (error) {
    console.error('Update error:', error.message);
    throw error;
  }
};

// Delete records
const deleteRecord = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      query: sql, 
      params: params 
    });
    
    if (error) throw error;
    return data ? data.length : 0;
  } catch (error) {
    console.error('Delete error:', error.message);
    throw error;
  }
};

// Query function
const query = async (sql, params = []) => {
  const data = await getMany(sql, params);
  return { rows: data };
};

// Dummy functions for compatibility
const getPool = () => ({ query: query });
const beginTransaction = async () => ({ query: query });
const commitTransaction = async () => true;
const rollbackTransaction = async () => true;
const closePool = async () => true;
const executeQuery = getMany;

export default {
  supabase,
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
