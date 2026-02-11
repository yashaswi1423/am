import React, { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
  TrendingUp
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsRes, ordersRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentOrders(5),
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.data)
      }
      
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Total Revenue',
      value: `₹${parseFloat(stats.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={18} />
      case 'confirmed':
      case 'processing':
        return <Truck className="text-blue-400" size={18} />
      case 'shipped':
        return <Truck className="text-indigo-400" size={18} />
      case 'delivered':
        return <CheckCircle className="text-green-400" size={18} />
      case 'cancelled':
        return <XCircle className="text-red-400" size={18} />
      default:
        return <Clock className="text-gray-400" size={18} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning'
      case 'confirmed':
      case 'processing':
        return 'badge-info'
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
      case 'delivered':
        return 'badge-success'
      case 'cancelled':
        return 'badge-error'
      default:
        return 'bg-glass border-glass text-muted'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
          </div>
          <p className="text-secondary text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass-card p-8 rounded-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-400" size={32} />
          </div>
          <p className="text-primary font-semibold mb-2 text-lg">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-primary px-6 py-2.5 rounded-lg mt-4 inline-flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">Dashboard</h1>
          <p className="text-secondary text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-primary px-4 py-2.5 rounded-lg flex items-center space-x-2 hover-lift"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="glass-card p-6 hover-lift glow-on-hover group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-secondary text-sm font-medium mb-2">{card.title}</p>
                <h3 className="text-2xl font-bold text-primary">
                  {card.value}
                </h3>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="text-xs text-green-400">Live</span>
                </div>
              </div>
              <div className={`${card.iconBg} p-4 rounded-xl transition-smooth group-hover:scale-110`}>
                <card.icon className={card.iconColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 hover-lift glow-on-hover group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-secondary text-sm font-medium mb-2">Pending Orders</p>
              <h3 className="text-2xl font-bold text-primary">
                {stats.pendingOrders || 0}
              </h3>
              <p className="text-xs text-muted mt-1">Awaiting processing</p>
            </div>
            <div className="bg-yellow-500/20 p-4 rounded-xl transition-smooth group-hover:scale-110">
              <Clock className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 hover-lift glow-on-hover group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-secondary text-sm font-medium mb-2">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-primary">
                {stats.lowStockCount || 0}
              </h3>
              <p className="text-xs text-muted mt-1">Needs restocking</p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-xl transition-smooth group-hover:scale-110">
              <Package className="text-red-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary">Recent Orders</h2>
            <p className="text-sm text-secondary mt-1">Latest customer orders</p>
          </div>
          <span className="text-xs text-muted bg-glass px-3 py-1 rounded-full border border-glass">
            Last 5 orders
          </span>
        </div>
        <div className="space-y-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => (
              <div
                key={order.order_id}
                className="flex items-center justify-between p-4 bg-glass border border-glass rounded-lg hover:border-blue-500/30 transition-smooth hover-lift cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-panel rounded-lg flex items-center justify-center">
                    {getStatusIcon(order.order_status)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary group-hover:text-blue-400 transition-smooth">
                      #{order.order_number}
                    </p>
                    <p className="text-sm text-secondary">{order.customer_name || 'Guest'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-lg mb-1">
                    ₹{parseFloat(order.total_amount).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-muted" size={32} />
              </div>
              <p className="text-secondary">No recent orders</p>
              <p className="text-xs text-muted mt-1">Orders will appear here once placed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard