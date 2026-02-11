import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
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

export default api