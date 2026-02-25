// Test endpoint to check image data in database
// Add this to your server routes temporarily to debug

export const testImagesEndpoint = async (req, res) => {
  try {
    const db = req.app.get('db'); // Get database instance
    
    // Check products with images
    const productsQuery = `
      SELECT 
        p.product_id,
        p.product_name,
        p.is_active,
        COUNT(pi.image_id) as image_count,
        json_agg(
          json_build_object(
            'image_id', pi.image_id,
            'image_url', pi.image_url,
            'is_primary', pi.is_primary
          )
        ) FILTER (WHERE pi.image_id IS NOT NULL) as images
      FROM products p
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      GROUP BY p.product_id, p.product_name, p.is_active
      ORDER BY p.product_name;
    `;
    
    const products = await db.getMany(productsQuery);
    
    // Check offers with images
    const offersQuery = `
      SELECT 
        o.offer_id,
        o.offer_name,
        o.is_active,
        COUNT(oi.image_id) as image_count,
        json_agg(
          json_build_object(
            'image_id', oi.image_id,
            'image_url', oi.image_url,
            'is_primary', oi.is_primary
          )
        ) FILTER (WHERE oi.image_id IS NOT NULL) as images
      FROM offers o
      LEFT JOIN offer_images oi ON o.offer_id = oi.offer_id
      GROUP BY o.offer_id, o.offer_name, o.is_active
      ORDER BY o.offer_name;
    `;
    
    const offers = await db.getMany(offersQuery);
    
    // Summary
    const summary = {
      total_products: products.length,
      products_with_images: products.filter(p => p.image_count > 0).length,
      products_without_images: products.filter(p => p.image_count === 0).length,
      total_offers: offers.length,
      offers_with_images: offers.filter(o => o.image_count > 0).length,
      offers_without_images: offers.filter(o => o.image_count === 0).length
    };
    
    res.json({
      success: true,
      summary,
      products,
      offers
    });
  } catch (error) {
    console.error('Test images endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// To use this, add to your routes file:
// router.get('/test/images', testImagesEndpoint);
