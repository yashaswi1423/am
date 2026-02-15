// Quick test script to verify Supabase connection
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = 'postgresql://postgres.ghekzhxusoijeolsjnlo:AM_fashions1102@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Check tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('orders', 'order_items', 'customers', 'products')
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables found:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });
    
    // Check row counts
    const ordersCount = await client.query('SELECT COUNT(*) FROM orders');
    const itemsCount = await client.query('SELECT COUNT(*) FROM order_items');
    const customersCount = await client.query('SELECT COUNT(*) FROM customers');
    
    console.log('\n📊 Row counts:');
    console.log(`  Orders: ${ordersCount.rows[0].count}`);
    console.log(`  Order Items: ${itemsCount.rows[0].count}`);
    console.log(`  Customers: ${customersCount.rows[0].count}`);
    
    // Test insert
    console.log('\n🧪 Testing INSERT with RETURNING...');
    const testResult = await client.query(`
      INSERT INTO customers (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING customer_id
    `, ['test@test.com', 'hash123', 'Test', 'User', '1234567890']);
    
    console.log('✅ Insert successful, returned ID:', testResult.rows[0].customer_id);
    
    // Clean up test data
    await client.query('DELETE FROM customers WHERE email = $1', ['test@test.com']);
    console.log('✅ Test data cleaned up');
    
    client.release();
    await pool.end();
    
    console.log('\n✅ All tests passed! Database is ready.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testConnection();
