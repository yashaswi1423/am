// config/database-supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// Get a single row
const getOne = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      query: sql, 
      params: params 
    });
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Get multiple rows
const getMany = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      query: sql, 
      params: params 
    });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Insert a record
const insert = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
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
    const { data, error } = await supabase.rpc('exec_sql', { 
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
    const { data, error } = await supabase.rpc('exec_sql', { 
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

// Execute query
const query = async (sql, params = []) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      query: sql, 
      params: params 
    });
    if (error) throw error;
    return { rows: data || [] };
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

export default {
  supabase,
  testConnection,
  getOne,
  getMany,
  insert,
  update,
  deleteRecord,
  query
};
