import axios from 'axios'

// API URL - uses environment variable or falls back to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://am2.vercel.app/api'

console.log('Admin Dashboard API URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: (limit = 10) => api.get('/dashboard/recent-orders', { params: { limit } }),
  getRecentCustomers: (limit = 10) => api.get('/dashboard/recent-customers', { params: { limit } }),
  getLowStock: (threshold = 10) => api.get('/dashboard/low-stock', { params: { threshold } }),
  getRevenueChart: (days = 7) => api.get('/dashboard/revenue-chart', { params: { days } }),
  getActivityLog: (limit = 20) => api.get('/dashboard/activity-log', { params: { limit } }),
}

export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
}

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  // Image management
  addImage: (id, data) => api.post(`/products/${id}/images`, data),
  uploadImageFile: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/products/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (imageId) => api.delete(`/products/images/${imageId}`),
  // Variant management
  addVariant: (id, data) => api.post(`/products/${id}/variants`, data),
  updateVariant: (variantId, data) => api.put(`/products/variants/${variantId}`, data),
  deleteVariant: (variantId) => api.delete(`/products/variants/${variantId}`),
  updateVariantStock: (variantId, data) => api.patch(`/products/variants/${variantId}/stock`, data),
  // Bulk pricing management
  addBulkPricing: (id, data) => api.post(`/products/${id}/bulk-pricing`, data),
  updateBulkPricing: (bulkPricingId, data) => api.put(`/products/bulk-pricing/${bulkPricingId}`, data),
  deleteBulkPricing: (bulkPricingId) => api.delete(`/products/bulk-pricing/${bulkPricingId}`),
  // Legacy endpoints
  updateStock: (id, variant_id, stock_quantity) => api.patch(`/products/${id}/stock`, { variant_id, stock_quantity }),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  search: (query) => api.get('/products/search/query', { params: { q: query } }),
}

export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getOrders: (id) => api.get(`/customers/${id}/orders`),
  getStats: (id) => api.get(`/customers/${id}/stats`),
  updateStatus: (id, is_active) => api.patch(`/customers/${id}/status`, { is_active }),
}

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getSalesData: (startDate, endDate) => api.get('/analytics/sales', { params: { startDate, endDate } }),
  getRevenueData: (period = 'daily') => api.get('/analytics/revenue', { params: { period } }),
  getTopProducts: (limit = 10) => api.get('/analytics/top-products', { params: { limit } }),
  getTopCustomers: (limit = 10) => api.get('/analytics/top-customers', { params: { limit } }),
  getOrdersByStatus: () => api.get('/analytics/orders-by-status'),
  getMonthlyTrends: () => api.get('/analytics/monthly-trends'),
}

export const couponsAPI = {
  getAll: (params) => api.get('/coupons', { params }),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (coupon_code, order_amount) => api.post('/coupons/validate', { coupon_code, order_amount }),
  toggleStatus: (id) => api.patch(`/coupons/${id}/toggle-status`),
}

export const returnsAPI = {
  getAll: (params) => api.get('/returns', { params }),
  getById: (id) => api.get(`/returns/${id}`),
  create: (data) => api.post('/returns', data),
  updateStatus: (id, status) => api.patch(`/returns/${id}/status`, { status }),
  delete: (id) => api.delete(`/returns/${id}`),
}

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
}

export const offersAPI = {
  getAll: (params) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (data) => api.post('/offers', data),
  update: (id, data) => api.put(`/offers/${id}`, data),
  delete: (id) => api.delete(`/offers/${id}`),
  // Image management
  addImage: (id, data) => api.post(`/offers/${id}/images`, data),
  uploadImageFile: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/offers/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (imageId) => api.delete(`/offers/images/${imageId}`),
  updateStock: (id, stock_quantity) => api.patch(`/offers/${id}/stock`, { stock_quantity }),
}

export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  toggleStatus: (id) => api.patch(`/categories/${id}/toggle`),
}

export const systemAPI = {
  getMaintenanceStatus: () => api.get('/system/maintenance/status'),
  toggleMaintenance: (data) => api.post('/system/maintenance/toggle', data),
}

export default api