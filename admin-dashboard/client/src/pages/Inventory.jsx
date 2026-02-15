import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Package, 
  DollarSign,
  Tag,
  Upload,
  X,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'T-Shirts',
    base_price: '',
    is_active: true
  });
  
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const categories = [
    'T-Shirts', 'Shirts', 'Cargo', 'Shorts', 'Track pants', 'Coats',
    'Wallets', 'Jackets', 'Trousers', 'Night wear', 'Hoodies',
    'Gym wear', 'Sleepwear sets', 'Sweatshirts', 'Jeans'
  ];
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Grey', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Brown', 'Navy'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.product_name || product.name || '',
        description: product.description || '',
        category: product.category || 'T-Shirts',
        base_price: product.base_price || '',
        is_active: product.is_active !== false
      });
      setImages(product.images || []);
      setVariants(product.variants || []);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'T-Shirts',
      base_price: '',
      is_active: true
    });
    setImages([]);
    setVariants([]);
    setNewImageUrl('');
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CRITICAL: Validate required fields with detailed checks
    const errors = [];
    
    // Trim and validate name
    const trimmedName = formData.name?.trim() || '';
    if (!trimmedName) {
      errors.push('Product Name is required');
    }
    
    // Validate category
    const trimmedCategory = formData.category?.trim() || '';
    if (!trimmedCategory) {
      errors.push('Category is required');
    }
    
    // Validate price
    const priceValue = parseFloat(formData.base_price);
    if (!formData.base_price || isNaN(priceValue) || priceValue <= 0) {
      errors.push('Valid Base Price is required (must be greater than 0)');
    }
    
    // STOP if there are any errors
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      // Scroll to top of modal to show the fields
      const modalContent = document.querySelector('.overflow-y-auto');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
      return; // CRITICAL: Don't proceed with API call
    }
    
    // Double-check one more time before API call
    if (!trimmedName || !trimmedCategory || !formData.base_price || priceValue <= 0) {
      alert('Please fill in all required fields: Product Name, Category, and Base Price');
      return;
    }
    
    try {
      if (modalMode === 'add') {
        // Log what we're sending
        console.log('Sending product data:', formData);
        console.log('Form data values:', {
          name: formData.name,
          category: formData.category,
          base_price: formData.base_price,
          description: formData.description,
          is_active: formData.is_active
        });
        
        const response = await productsAPI.create(formData);
        console.log('Create product response:', response.data);
        
        if (response.data.success) {
          const productId = response.data.data.product_id;
          console.log('Product ID:', productId);
          
          if (!productId) {
            alert('Error: Product was created but ID is missing. Please refresh and try uploading images separately.');
            fetchProducts();
            setShowModal(false);
            resetForm();
            return;
          }
          
          // Add images
          for (const img of images) {
            if (img.isFile && img.file) {
              // Upload file
              console.log('Uploading file for product:', productId);
              await productsAPI.uploadImageFile(productId, img.file);
            } else if (img.image_url) {
              // Add URL
              console.log('Adding image URL for product:', productId);
              await productsAPI.addImage(productId, { image_url: img.image_url });
            }
          }
          
          // Add variants
          for (const variant of variants) {
            console.log('Adding variant for product:', productId);
            await productsAPI.addVariant(productId, variant);
          }
          
          alert('Product created successfully!');
          fetchProducts();
          setShowModal(false);
          resetForm();
        }
      } else {
        await productsAPI.update(selectedProduct.product_id, formData);
        alert('Product updated successfully!');
        fetchProducts();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      console.error('Error details:', error.response?.data);
      
      // Show more detailed error information
      const errorData = error.response?.data;
      let errorMessage = errorData?.message || error.message;
      
      if (errorData?.debug) {
        console.error('Debug info:', errorData.debug);
        errorMessage += '\n\nDebug: Check browser console for details';
      }
      
      if (errorData?.errors) {
        errorMessage = errorData.errors.join('\n');
      }
      
      alert('Failed to save product: ' + errorMessage);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { image_url: newImageUrl, display_order: images.length }]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e, productId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      
      if (productId) {
        // If editing existing product, upload immediately
        const response = await productsAPI.uploadImageFile(productId, file);
        if (response.data.success) {
          alert('Image uploaded successfully!');
          fetchProducts();
        }
      } else {
        // If creating new product, convert to base64 for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages([...images, { image_url: reader.result, display_order: images.length, isFile: true, file }]);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([...variants, {
      color: 'Black',
      size: 'M',
      stock_quantity: 0,
      price_adjustment: 0,
      is_available: true
    }]);
  };

  const handleUpdateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleUpdateStock = async (variantId, newStock) => {
    try {
      await productsAPI.updateVariantStock(variantId, { stock_quantity: newStock });
      alert('Stock updated successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Inventory Management</h1>
        <button
          onClick={() => handleOpenModal('add')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
                {!product.is_active && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Inactive
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.product_name || product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-xl font-bold text-blue-600 mb-3">₹{parseFloat(product.base_price).toFixed(2)}</p>

                {/* Variants Summary */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Variants: {product.variants?.length || 0}</p>
                  <p className="text-xs text-gray-600">
                    Total Stock: {product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal('edit', product)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Required Fields Warning */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Required fields:</strong> Product Name, Category, and Base Price must be filled before creating the product.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="e.g., Classic White Tee"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    rows="3"
                    placeholder="Product description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="299.00"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Product is active (visible on website)
                  </label>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> Fill in Product Name, Category, and Base Price above first. Images and variants are optional.
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Product Images (Optional)</h3>
                
                {/* File Upload Button */}
                <div className="flex items-center space-x-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Upload size={20} className="mr-2" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, selectedProduct?.product_id)}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <span className="text-sm text-gray-500">or</span>
                </div>
                
                {/* URL Input */}
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Or enter image URL"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.image_url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {img.isFile && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          New
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Variants (Colors & Sizes)</h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Add Variant</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={variant.color}
                        onChange={(e) => handleUpdateVariant(index, 'color', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      >
                        {colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>

                      <select
                        value={variant.size}
                        onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                      >
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={variant.stock_quantity}
                        onChange={(e) => handleUpdateVariant(index, 'stock_quantity', parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                        placeholder="Stock"
                        min="0"
                      />

                      <input
                        type="number"
                        value={variant.price_adjustment}
                        onChange={(e) => handleUpdateVariant(index, 'price_adjustment', parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                        placeholder="Price ±"
                        step="0.01"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name?.trim() || !formData.category || !formData.base_price || parseFloat(formData.base_price) <= 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  title={!formData.name?.trim() || !formData.category || !formData.base_price || parseFloat(formData.base_price) <= 0 ? 'Please fill in all required fields' : ''}
                >
                  <Save size={20} />
                  <span>{modalMode === 'add' ? 'Create Product' : 'Update Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
