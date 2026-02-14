// Test script to check orders and order_items
import db from './config/database.js';

async function testOrders() {
  try {
    console.log('=== TESTING ORDERS ===\n');
    
    // Get all orders
    const orders = await db.getMany('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    console.log(`Found ${orders.length} orders:\n`);
    
    for (const order of orders) {
      console.log(`Order ID: ${order.order_id}`);
      console.log(`Order Number: ${order.order_number}`);
      console.log(`Customer ID: ${order.customer_id}`);
      console.log(`Total: ₹${order.total_amount}`);
      console.log(`Status: ${order.order_status}`);
      console.log(`Payment Status: ${order.payment_status}`);
      
      // Get order items for this order
      const items = await db.getMany(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.order_id]
      );
      
      console.log(`\n  📦 Order Items (${items.length}):`);
      if (items.length === 0) {
        console.log('  ⚠️  NO ITEMS FOUND FOR THIS ORDER!');
      } else {
        items.forEach((item, idx) => {
          console.log(`  ${idx + 1}. ${item.product_name}`);
          console.log(`     Details: ${item.variant_details || 'N/A'}`);
          console.log(`     Quantity: ${item.quantity}`);
          console.log(`     Price: ₹${item.unit_price}`);
          console.log(`     Subtotal: ₹${item.subtotal}`);
        });
      }
      console.log('\n' + '='.repeat(60) + '\n');
    }
    
    // Check if order_items table exists and has data
    const itemCount = await db.getOne('SELECT COUNT(*) as count FROM order_items');
    console.log(`\nTotal order items in database: ${itemCount.count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testOrders();
