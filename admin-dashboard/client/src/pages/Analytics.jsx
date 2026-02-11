import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { analyticsAPI } from '../services/api'
import { TrendingUp, Package, Users, ShoppingCart, DollarSign } from 'lucide-react'

const Analytics = () => {
  const [overview, setOverview] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState([])
  const [monthlyTrends, setMonthlyTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('daily')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [overviewRes, revenueRes, productsRes, customersRes, statusRes, trendsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getRevenueData(period),
        analyticsAPI.getTopProducts(5),
        analyticsAPI.getTopCustomers(5),
        analyticsAPI.getOrdersByStatus(),
        analyticsAPI.getMonthlyTrends()
      ])

      if (overviewRes.data.success) setOverview(overviewRes.data.data)
      if (revenueRes.data.success) setRevenueData(revenueRes.data.data)
      if (productsRes.data.success) setTopProducts(productsRes.data.data)
      if (customersRes.data.success) setTopCustomers(customersRes.data.data)
      if (statusRes.data.success) setOrdersByStatus(statusRes.data.data)
      if (trendsRes.data.success) setMonthlyTrends(trendsRes.data.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const formatCurrency = (value) => `₹${parseFloat(value).toFixed(2)}`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Analytics & Insights</h1>
        <button 
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {formatCurrency(overview.totalRevenue)}
                </h3>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {overview.totalOrders}
                </h3>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <ShoppingCart className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {overview.totalCustomers}
                </h3>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {overview.totalProducts}
                </h3>
              </div>
              <div className="bg-orange-500 p-3 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Revenue Trend</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products by Sales</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'total_revenue') return formatCurrency(value)
                  return value
                }} />
                <Legend />
                <Bar dataKey="total_sold" fill="#10b981" name="Units Sold" />
                <Bar dataKey="total_revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No product data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Orders by Status</h2>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="count"
                  nameKey="order_status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.order_status}: ${entry.count}`}
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No order data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Customers</h2>
        {topCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Orders</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={customer.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">{customer.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">{customer.order_count}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                      {formatCurrency(customer.total_spent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No customer data available</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends (Last 12 Months)</h2>
        {monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue' || name === 'avg_order_value') return formatCurrency(value)
                return value
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="avg_order_value" stroke="#f59e0b" strokeWidth={2} name="Avg Order Value" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No trend data available</p>
        )}
      </div>
    </div>
  )
}

export default Analytics