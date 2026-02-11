import { useEffect, useState } from 'react'
import { customersAPI } from '../services/api'
import { User, Mail, Phone, Calendar, Eye, Edit, Trash2, ShoppingBag } from 'lucide-react'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [customerStats, setCustomerStats] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await customersAPI.getAll()
      
      if (res.data.success) {
        setCustomers(res.data.data)
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('Failed to load customers. Please try again.')
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await customersAPI.delete(id)
        if (response.data.success) {
          fetchCustomers()
        }
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Failed to delete customer')
      }
    }
  }

  const viewCustomerDetails = async (id) => {
    try {
      const [customerRes, statsRes] = await Promise.all([
        customersAPI.getById(id),
        customersAPI.getStats(id)
      ])
      
      if (customerRes.data.success && statsRes.data.success) {
        setSelectedCustomer(customerRes.data.data)
        setCustomerStats(statsRes.data.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
      alert('Failed to load customer details')
    }
  }

  const toggleCustomerStatus = async (id, currentStatus) => {
    try {
      const response = await customersAPI.updateStatus(id, !currentStatus)
      if (response.data.success) {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error updating customer status:', error)
      alert('Failed to update customer status')
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
      <h1 className="page-title mb-6">Customer Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Customers ({customers.length})</h2>
          <button 
            onClick={fetchCustomers}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-800">{customer.customer_id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {customer.first_name} {customer.last_name}
                          </p>
                          {customer.email_verified && (
                            <span className="text-xs text-green-600">✓ Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {customer.city && customer.state 
                        ? `${customer.city}, ${customer.state}` 
                        : customer.city || customer.state || 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleCustomerStatus(customer.customer_id, customer.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(customer.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewCustomerDetails(customer.customer_id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert('Edit functionality coming soon')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.customer_id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedCustomer && customerStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Customer Details - {selectedCustomer.first_name} {selectedCustomer.last_name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCustomer.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCustomer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Verified</p>
                  <p className="font-medium text-gray-800">
                    {selectedCustomer.email_verified ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.country || 'N/A'}</p>
                </div>
              </div>

              {(selectedCustomer.address_line1 || selectedCustomer.city) && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Address</p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {selectedCustomer.address_line1 && (
                      <p className="text-gray-800">{selectedCustomer.address_line1}</p>
                    )}
                    {selectedCustomer.address_line2 && (
                      <p className="text-gray-800">{selectedCustomer.address_line2}</p>
                    )}
                    <p className="text-gray-800">
                      {[selectedCustomer.city, selectedCustomer.state, selectedCustomer.postal_code]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-3">Purchase Statistics</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <ShoppingBag className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{customerStats.total_orders || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-2">₹</div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{parseFloat(customerStats.total_spent || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{parseFloat(customerStats.avg_order_value || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers