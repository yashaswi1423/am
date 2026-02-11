// API Service for communicating with backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Customer API
export const customerAPI = {
  // Create or get customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data.data || response.data;
  },
  
  getCustomerByEmail: async (email) => {
    const response = await api.get(`/customers/email/${encodeURIComponent(email)}`);
    return response.data.data || response.data;
  },
};

// Order API
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data || response.data;
  },
  
  // Get order by ID
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data || response.data;
  },
  
  // Get orders by customer email
  getCustomerOrders: async (email) => {
    const response = await api.get(`/orders/customer/${email}`);
    return response.data.data || response.data;
  },
};

// Product API
export const productAPI = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  // Get product by ID
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  // Check product availability
  checkAvailability: async (productId, variantId) => {
    const response = await api.get(`/products/${productId}/variants/${variantId}/availability`);
    return response.data;
  },
};

// Coupon API
export const couponAPI = {
  // Validate coupon
  validateCoupon: async (couponCode, orderAmount) => {
    const response = await api.post('/coupons/validate', {
      coupon_code: couponCode,
      order_amount: orderAmount,
    });
    return response.data;
  },
};

export default api;
