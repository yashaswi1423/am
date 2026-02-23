import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Power, AlertTriangle, Save, RefreshCw } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Settings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fixing, setFixing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    fetchMaintenanceStatus()
  }, [])

  const fetchMaintenanceStatus = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/system/maintenance/status`)
      
      if (res.data.success) {
        setMaintenanceMode(res.data.data.enabled)
        setMaintenanceMessage(res.data.data.message)
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error)
      setError('Failed to load maintenance status')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMaintenance = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      const username = localStorage.getItem('adminUsername') || 'admin'
      
      const response = await axios.post(
        `${API_URL}/system/maintenance/toggle`,
        {
          enabled: !maintenanceMode,
          message: maintenanceMessage,
          updated_by: username
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data.success) {
        setMaintenanceMode(!maintenanceMode)
        setSuccess(response.data.message)
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error)
      setError(error.response?.data?.message || 'Failed to toggle maintenance mode')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveMessage = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      const username = localStorage.getItem('adminUsername') || 'admin'
      
      await axios.put(
        `${API_URL}/system/settings/maintenance_message`,
        {
          value: maintenanceMessage,
          updated_by: username
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setSuccess('Maintenance message updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error saving message:', error)
      setError('Failed to save maintenance message')
    } finally {
      setSaving(false)
    }
  }

  const handleFixVariants = async () => {
    if (!window.confirm('This will enable all disabled variants and set stock to 10 for variants with 0 stock. Continue?')) {
      return
    }

    try {
      setFixing(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token')
      
      const response = await axios.post(
        `${API_URL}/system/fix-variants`,
        { default_stock: 10 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data.success) {
        const summary = response.data.data.summary
        setSuccess(
          `✅ Fixed all variants!\n` +
          `Total variants: ${summary.total_variants}\n` +
          `Available: ${summary.available_variants}\n` +
          `With stock: ${summary.variants_with_stock}\n` +
          `Total stock: ${summary.total_stock}`
        )
      }
    } catch (error) {
      console.error('Error fixing variants:', error)
      setError(error.response?.data?.message || 'Failed to fix variants')
    } finally {
      setFixing(false)
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
      <h1 className="page-title mb-6 text-black">System Settings</h1>
      
      {/* Maintenance Mode Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-lg ${maintenanceMode ? 'bg-red-100' : 'bg-green-100'}`}>
            <Power className={`w-6 h-6 ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Maintenance Mode</h2>
            <p className="text-sm text-gray-600">
              {maintenanceMode ? 'Website is currently in maintenance mode' : 'Website is live and accessible'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-black flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-black">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* Toggle Button */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-black">Enable Maintenance Mode</p>
              <p className="text-sm text-gray-600">
                When enabled, customers will see a maintenance page instead of the website
              </p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              disabled={saving}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Maintenance Message */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Maintenance Message
            </label>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Enter the message to display during maintenance..."
            />
            <button
              onClick={handleSaveMessage}
              disabled={saving}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Message'}</span>
            </button>
          </div>

          {/* Warning */}
          {maintenanceMode && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Warning</p>
                <p className="text-sm text-yellow-700">
                  Your website is currently in maintenance mode. Customers cannot access the site.
                  Remember to disable maintenance mode when you're done updating.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Settings Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">General Settings</h2>
            <p className="text-sm text-gray-600">Configure system-wide settings</p>
          </div>
        </div>

        {/* Fix Variants Button */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-black mb-1">Fix Disabled Variants</h3>
              <p className="text-sm text-gray-600 mb-3">
                Enable all disabled product variants and set default stock quantity (10 units) for variants with zero stock.
                This will make all size/color combinations available for purchase.
              </p>
            </div>
            <button
              onClick={handleFixVariants}
              disabled={fixing}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${fixing ? 'animate-spin' : ''}`} />
              <span>{fixing ? 'Fixing...' : 'Fix All Variants'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
