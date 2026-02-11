import React from 'react'
import { Package, AlertTriangle, TrendingDown, Search } from 'lucide-react'

const Inventory = () => {
  const inventoryItems = [
    { id: 1, product: 'Cotton T-Shirt', sku: 'TSH-001', stock: 50, reorderLevel: 20, status: 'in_stock' },
    { id: 2, product: 'Denim Jeans', sku: 'JNS-002', stock: 8, reorderLevel: 15, status: 'low_stock' },
    { id: 3, product: 'Running Shoes', sku: 'SHO-003', stock: 0, reorderLevel: 10, status: 'out_of_stock' }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800'
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock'
      case 'low_stock':
        return 'Low Stock'
      case 'out_of_stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Monitor and manage your product stock levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">3</h3>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">1</h3>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <AlertTriangle className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">1</h3>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Stock Levels</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Current Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Reorder Level</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-800">{item.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-mono">{item.sku}</td>
                  <td className="px-4 py-4">
                    <span className={`font-semibold ${
                      item.stock === 0 ? 'text-red-600' : 
                      item.stock < item.reorderLevel ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{item.reorderLevel} units</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          <strong>Note:</strong> This is a demo inventory page. Stock levels shown are for demonstration purposes. 
          Backend integration for inventory management is not yet implemented.
        </p>
      </div>
    </div>
  )
}

export default Inventory