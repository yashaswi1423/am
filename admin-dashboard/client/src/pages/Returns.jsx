import { useEffect, useState } from 'react'
import { returnsAPI } from '../services/api'
import { Eye, CheckCircle, XCircle, Package, Calendar, User } from 'lucide-react'

const Returns = () => {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await returnsAPI.getAll()
      
      if (res.data.success) {
        setReturns(res.data.data || [])
      } else {
        setReturns([])
      }
    } catch (error) {
      console.error('Error fetching returns:', error)
      if (error.response && error.response.status !== 404) {
        setError('Failed to load returns. Please try again.')
      }
      setReturns([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (returnId, newStatus) => {
    try {
      const response = await returnsAPI.updateStatus(returnId, newStatus)
      if (response.data.success) {
        fetchReturns()
        if (showModal) {
          const updatedReturn = await returnsAPI.getById(returnId)
          if (updatedReturn.data.success) {
            setSelectedReturn(updatedReturn.data.data)
          }
        }
      }
    } catch (error) {
      console.error('Error updating return status:', error)
      alert('Failed to update return status')
    }
  }

  const viewReturnDetails = async (returnId) => {
    try {
      const response = await returnsAPI.getById(returnId)
      if (response.data.success) {
        setSelectedReturn(response.data.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching return details:', error)
      alert('Failed to load return details')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'picked_up':
        return 'bg-indigo-100 text-indigo-800'
      case 'refunded':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRefundStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processed':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
      <h1 className="page-title mb-6">Returns & Refunds</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Return Requests ({returns.length})</h2>
          <button 
            onClick={fetchReturns}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Return ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Return Reason</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Refund Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Return Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Refund Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Requested Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((returnItem) => (
                  <tr key={returnItem.return_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">
                          #{returnItem.return_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      #{returnItem.order_id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-800">
                          Customer ID: {returnItem.customer_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {returnItem.return_reason}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                      ₹{parseFloat(returnItem.refund_amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={returnItem.return_status}
                        onChange={(e) => handleStatusUpdate(returnItem.return_id, e.target.value)}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(returnItem.return_status)} border-0 cursor-pointer`}
                      >
                        <option value="requested">Requested</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="refunded">Refunded</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getRefundStatusColor(returnItem.refund_status)}`}>
                        {returnItem.refund_status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(returnItem.requested_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => viewReturnDetails(returnItem.return_id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 text-lg font-medium">No return requests found</p>
                    <p className="text-gray-400 text-sm mt-2">Return requests will appear here when customers initiate returns</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Return Details - {selectedReturn.return_number}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Return ID</p>
                  <p className="font-medium text-gray-800">{selectedReturn.return_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-800">#{selectedReturn.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer ID</p>
                  <p className="font-medium text-gray-800">{selectedReturn.customer_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refund Amount</p>
                  <p className="font-bold text-xl text-gray-800">
                    ₹{parseFloat(selectedReturn.refund_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Return Reason</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{selectedReturn.return_reason}</p>
                </div>
              </div>

              {selectedReturn.admin_notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Admin Notes</p>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-800">{selectedReturn.admin_notes}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Return Status</p>
                  <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedReturn.return_status)}`}>
                    {selectedReturn.return_status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Refund Status</p>
                  <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-medium ${getRefundStatusColor(selectedReturn.refund_status)}`}>
                    {selectedReturn.refund_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Requested At</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedReturn.requested_at).toLocaleString()}
                  </p>
                </div>
                {selectedReturn.approved_at && (
                  <div>
                    <p className="text-sm text-gray-500">Approved At</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedReturn.approved_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedReturn.refunded_at && (
                  <div>
                    <p className="text-sm text-gray-500">Refunded At</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedReturn.refunded_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                {selectedReturn.return_status === 'requested' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 'approved')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Return</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 'rejected')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Return</span>
                    </button>
                  </>
                )}
                {selectedReturn.return_status === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReturn.return_id, 'picked_up')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Mark as Picked Up
                  </button>
                )}
                {selectedReturn.return_status === 'picked_up' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReturn.return_id, 'refunded')}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Process Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Returns