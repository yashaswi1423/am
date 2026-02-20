import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    offer_price: '',
    stock_quantity: '',
    category: 'Special Offers',
    is_active: true,
    is_featured: false,
    valid_until: ''
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/offers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.data.success) {
        setOffers(res.data.data)
      } else {
        setOffers([])
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      setError('Failed to load offers. Please try again.')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
        const response = await axios.delete(`${API_URL}/offers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.success) {
          fetchOffers()
        }
      } catch (error) {
        console.error('Error deleting offer:', error)
        alert('Failed to delete offer')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      const payload = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        offer_price: parseFloat(formData.offer_price),
        stock_quantity: parseInt(formData.stock_quantity) || 0
      }

      if (editingOffer) {
        await axios.put(`${API_URL}/offers/${editingOffer.offer_id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/offers`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      setShowModal(false)
      setEditingOffer(null)
      resetForm()
      fetchOffers()
    } catch (error) {
      console.error('Error saving offer:', error)
      alert(error.response?.data?.message || 'Failed to save offer')
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      name: offer.offer_name,
      description: offer.description || '',
      original_price: offer.original_price,
      offer_price: offer.offer_price,
      stock_quantity: offer.stock_quantity,
      category: offer.category || 'Special Offers',
      is_active: offer.is_active,
      is_featured: offer.is_featured,
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      original_price: '',
      offer_price: '',
      stock_quantity: '',
      category: 'Special Offers',
      is_active: true,
      is_featured: false,
      valid_until: ''
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOffer(null)
    resetForm()
  }

  const calculateDiscount = (original, offer) => {
    if (!original || !offer) return 0
    return Math.round(((original - offer) / original) * 100)
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
      <h1 className="page-title mb-6 text-black">Offers Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">All Offers ({offers.length})</h2>
          <div className="flex space-x-2">
            <button 
              onClick={fetchOffers}
              className="bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Offer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-black">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Original Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Offer Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <tr key={offer.offer_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-black">{offer.offer_id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        {offer.image_url || (offer.images && offer.images.length > 0) ? (
                          <img 
                            src={offer.image_url || offer.images[0].image_url} 
                            alt={offer.offer_name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-black">{offer.offer_name}</p>
                          {offer.is_featured && (
                            <span className="text-xs text-blue-600">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-black line-through">
                      ₹{parseFloat(offer.original_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-green-600">
                      ₹{parseFloat(offer.offer_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {parseFloat(offer.discount_percentage || 0).toFixed(0)}% OFF
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-black">
                      {offer.stock_quantity}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        offer.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEdit(offer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(offer.offer_id)} 
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
                  <td colSpan="8" className="px-4 py-8 text-center text-black">
                    No offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Offer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="e.g., Winter Special Combo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  rows="3"
                  placeholder="Describe the offer..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="1600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.offer_price}
                    onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="999"
                  />
                </div>
              </div>

              {formData.original_price && formData.offer_price && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-black">
                    Discount: <span className="font-bold">
                      {calculateDiscount(parseFloat(formData.original_price), parseFloat(formData.offer_price))}% OFF
                    </span>
                  </p>
                  <p className="text-sm text-black">
                    Savings: <span className="font-bold">
                      ₹{(parseFloat(formData.original_price) - parseFloat(formData.offer_price)).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Special Offers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-black">Active</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-black">Featured</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Offers
