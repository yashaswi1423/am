-- Fix order_items table to allow NULL product_id for web orders
-- This allows orders from the website where products might not be in the database yet

USE ecommerce_admin;

-- Drop the foreign key constraint first
ALTER TABLE order_items DROP FOREIGN KEY order_items_ibfk_2;

-- Modify product_id to allow NULL
ALTER TABLE order_items MODIFY COLUMN product_id INT NULL;

-- Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE order_items 
ADD CONSTRAINT order_items_ibfk_2 
FOREIGN KEY (product_id) REFERENCES products(product_id) 
ON DELETE SET NULL;

-- Verify the change
DESCRIBE order_items;
