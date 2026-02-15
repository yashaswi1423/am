// services/supabaseStorage.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key for backend operations (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

// Only initialize if credentials are provided
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Storage initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error.message);
    console.warn('⚠️  File uploads will not work. Please configure Supabase credentials.');
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. File uploads will not work.');
  console.warn('   Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
  console.warn('   See SETUP_INSTRUCTIONS.md for details');
}

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Name for the file
 * @param {string} mimeType - MIME type of the file
 * @param {string} bucket - Storage bucket name (default: 'payment-screenshots')
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadFile = async (fileBuffer, fileName, mimeType, bucket = 'payment-screenshots') => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.');
  }

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath, bucket = 'payment-screenshots') => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    throw error;
  }
};

/**
 * Get public URL for a file
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucket - Storage bucket name
 * @returns {string}
 */
export const getPublicUrl = (filePath, bucket = 'payment-screenshots') => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Check if Supabase Storage is configured
 * @returns {boolean}
 */
export const isStorageConfigured = () => {
  return supabase !== null;
};

// Export aliases for compatibility
export const uploadToSupabase = uploadFile;
export const deleteFromSupabase = deleteFile;

export default {
  uploadFile,
  deleteFile,
  uploadToSupabase,
  deleteFromSupabase,
  getPublicUrl,
  isStorageConfigured
};
