import React, { useState, useEffect } from 'react'
import { ordersAPI } from '../services/api'
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }
      const response = await ordersAPI.getAll(params)
      
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders. Please try again.')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateStatus(orderId, newStatus)
      if (response.data.success) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await ordersAPI.delete(orderId)
        if (response.data.success) {
          fetchOrders()
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order')
      }
    }
  }

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await ordersAPI.getById(orderId)
      if (response.data.success) {
        setSelectedOrder(response.data.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      alert('Failed to load order details')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />
      case 'confirmed':
      case 'processing':
        return <Truck className="text-blue-500" size={18} />
      case 'shipped':
        return <Truck className="text-indigo-500" size={18} />
      case 'delivered':
        return <CheckCircle className="text-green-500" size={18} />
      case 'cancelled':
        return <XCircle className="text-red-500" size={18} />
      default:
        return <Clock className="text-gray-500" size={18} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      order.order_number?.toLowerCase().includes(search) ||
      order.customer_name?.toLowerCase().includes(search) ||
      order.customer_email?.toLowerCase().includes(search) ||
      order.order_id?.toString().includes(search)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Orders</h1>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, number, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex items-center space-x-3">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order Number</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800">#{order.order_number}</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{order.customer_name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{order.customer_email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                          ₹{parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.order_status)} border-0 cursor-pointer`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => viewOrderDetails(order.order_id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.order_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Order Details #{selectedOrder.order_number}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">{selectedOrder.customer_name || 'Guest'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_email || 'N/A'}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                    {selectedOrder.order_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrder.payment_status)}`}>
                    {selectedOrder.payment_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-medium text-gray-800">
                    ₹{parseFloat(selectedOrder.subtotal).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-xl text-gray-800">
                    ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="text-gray-800">{selectedOrder.shipping_address}</p>
                </div>
              )}
              {selectedOrder.billing_address && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Billing Address</p>
                  <p className="text-gray-800">{selectedOrder.billing_address}</p>
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Notes</p>
                  <p className="text-gray-800">{selectedOrder.notes}</p>
                </div>
              )}
              {selectedOrder.tracking_number && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-mono text-gray-800">{selectedOrder.tracking_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders