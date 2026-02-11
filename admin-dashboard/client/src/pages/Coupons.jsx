import { useEffect, useState } from 'react'
import { couponsAPI } from '../services/api'
import { Plus, Trash2, Tag, Percent, DollarSign, Calendar, ToggleLeft, ToggleRight } from 'lucide-react'

const Coupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await couponsAPI.getAll()
      
      if (res.data.success) {
        setCoupons(res.data.data)
      } else {
        setCoupons([])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      setError('Failed to load coupons. Please try again.')
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const response = await couponsAPI.delete(id)
        if (response.data.success) {
          fetchCoupons()
        }
      } catch (error) {
        console.error('Error deleting coupon:', error)
        alert('Failed to delete coupon')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await couponsAPI.toggleStatus(id)
      if (response.data.success) {
        fetchCoupons()
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error)
      alert('Failed to update coupon status')
    }
  }

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date()
  }

  const isNotStarted = (validFrom) => {
    return new Date(validFrom) > new Date()
  }

  const getCouponStatus = (coupon) => {
    if (!coupon.is_active) return { text: 'Inactive', color: 'bg-gray-100 text-gray-800' }
    if (isExpired(coupon.valid_until)) return { text: 'Expired', color: 'bg-red-100 text-red-800' }
    if (isNotStarted(coupon.valid_from)) return { text: 'Scheduled', color: 'bg-blue-100 text-blue-800' }
    return { text: 'Active', color: 'bg-green-100 text-green-800' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title mb-6">Coupons & Discounts</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Coupons ({coupons.length})</h2>
          <div className="flex space-x-2">
            <button 
              onClick={fetchCoupons}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coupon</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Coupon Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Min Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Valid Period</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => {
                  const status = getCouponStatus(coupon)
                  return (
                    <tr key={coupon.coupon_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-blue-600" />
                          <span className="font-mono font-bold text-gray-800">
                            {coupon.coupon_code}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {coupon.description || 'No description'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1">
                          {coupon.discount_type === 'percentage' ? (
                            <>
                              <Percent className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-800">
                                {parseFloat(coupon.discount_value)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-800">
                                ₹{parseFloat(coupon.discount_value).toFixed(2)}
                              </span>
                            </>
                          )}
                          {coupon.max_discount && (
                            <span className="text-xs text-gray-500">
                              (max ₹{parseFloat(coupon.max_discount).toFixed(2)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        ₹{parseFloat(coupon.min_order_value).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {coupon.used_count || 0}
                        {coupon.usage_limit && (
                          <span className="text-gray-400"> / {coupon.usage_limit}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(coupon.valid_from).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <span>to</span>
                            <span>{new Date(coupon.valid_until).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleToggleStatus(coupon.coupon_id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title={coupon.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {coupon.is_active ? (
                              <ToggleRight className="w-5 h-5" />
                            ) : (
                              <ToggleLeft className="w-5 h-5" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDelete(coupon.coupon_id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Coupon</h2>
            <p className="text-gray-600 mb-4">Coupon creation form coming soon...</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Coupons