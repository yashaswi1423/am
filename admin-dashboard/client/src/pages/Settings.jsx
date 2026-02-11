import React, { useState } from 'react'
import { User, Store, Bell, Lock, CreditCard, Truck, Mail, Phone, MapPin, Globe, Save } from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('store')
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'My E-Commerce Store',
    storeEmail: 'admin@mystore.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123, MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India',
    gstNumber: '29ABCDE1234F1Z5',
    currency: 'INR'
  })

  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@mystore.com',
    phone: '+91 98765 43210',
    role: 'Super Admin'
  })

  const [paymentSettings, setPaymentSettings] = useState({
    upiEnabled: true,
    upiId: 'mystore@paytm',
    codEnabled: true,
    codCharge: 50,
    razorpayEnabled: false,
    razorpayKey: '',
    paytmEnabled: false,
    paytmMerchantId: ''
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500,
    standardShippingCost: 50,
    expressShippingCost: 100,
    deliveryTimeStandard: '5-7 business days',
    deliveryTimeExpress: '2-3 business days'
  })

  const handleSave = () => {
    alert('Settings saved successfully! (This is a demo - no backend integration)')
  }

  const tabs = [
    { id: 'store', label: 'Store Information', icon: Store },
    { id: 'admin', label: 'Admin Profile', icon: User },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'shipping', label: 'Shipping Settings', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your store configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Store Information</h2>
                  <p className="text-gray-600 text-sm mb-6">Update your store's basic information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Store className="inline mr-2" size={16} />
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-2" size={16} />
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Store Phone
                    </label>
                    <input
                      type="tel"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={storeSettings.gstNumber}
                      onChange={(e) => setStoreSettings({...storeSettings, gstNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="29ABCDE1234F1Z5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline mr-2" size={16} />
                      Store Address
                    </label>
                    <input
                      type="text"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={storeSettings.city}
                      onChange={(e) => setStoreSettings({...storeSettings, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={storeSettings.state}
                      onChange={(e) => setStoreSettings({...storeSettings, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Tamil Nadu</option>
                      <option>West Bengal</option>
                      <option>Gujarat</option>
                      <option>Rajasthan</option>
                      <option>Uttar Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={storeSettings.pincode}
                      onChange={(e) => setStoreSettings({...storeSettings, pincode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="560001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="inline mr-2" size={16} />
                      Country
                    </label>
                    <input
                      type="text"
                      value={storeSettings.country}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Profile</h2>
                  <p className="text-gray-600 text-sm mb-6">Manage your admin account details</p>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={48} />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (Max 2MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={adminProfile.phone}
                      onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={adminProfile.role}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Methods</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure payment options for your customers</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">UPI Payment</h3>
                          <p className="text-sm text-gray-500">Accept payments via UPI</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={paymentSettings.upiEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, upiEnabled: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {paymentSettings.upiEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                        <input
                          type="text"
                          value={paymentSettings.upiId}
                          onChange={(e) => setPaymentSettings({...paymentSettings, upiId: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="yourstore@paytm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold">₹</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Cash on Delivery (COD)</h3>
                          <p className="text-sm text-gray-500">Accept cash payments on delivery</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={paymentSettings.codEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, codEnabled: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {paymentSettings.codEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">COD Charge (₹)</label>
                        <input
                          type="number"
                          value={paymentSettings.codCharge}
                          onChange={(e) => setPaymentSettings({...paymentSettings, codCharge: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="50"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Razorpay</h3>
                          <p className="text-sm text-gray-500">Online payment gateway</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={paymentSettings.razorpayEnabled}
                          onChange={(e) => setPaymentSettings({...paymentSettings, razorpayEnabled: e.target.checked})}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {paymentSettings.razorpayEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay API Key</label>
                        <input
                          type="text"
                          value={paymentSettings.razorpayKey}
                          onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKey: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="rzp_test_xxxxxxxxxxxxx"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Settings</h2>
                  <p className="text-gray-600 text-sm mb-6">Configure shipping rates and delivery options</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standard Shipping Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.standardShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, standardShippingCost: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Express Shipping Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingSettings.expressShippingCost}
                      onChange={(e) => setShippingSettings({...shippingSettings, expressShippingCost: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standard Delivery Time
                    </label>
                    <input
                      type="text"
                      value={shippingSettings.deliveryTimeStandard}
                      onChange={(e) => setShippingSettings({...shippingSettings, deliveryTimeStandard: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Express Delivery Time
                    </label>
                    <input
                      type="text"
                      value={shippingSettings.deliveryTimeExpress}
                      onChange={(e) => setShippingSettings({...shippingSettings, deliveryTimeExpress: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Email Notifications</h2>
                  <p className="text-gray-600 text-sm mb-6">Choose which emails you want to receive</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'New order notifications', description: 'Get notified when new orders are placed' },
                    { label: 'Low stock alerts', description: 'Receive alerts when products are running low' },
                    { label: 'Customer registrations', description: 'Get notified about new customer signups' },
                    { label: 'Return requests', description: 'Receive notifications for return requests' },
                    { label: 'Payment confirmations', description: 'Get notified when payments are received' },
                    { label: 'Weekly sales report', description: 'Receive weekly summary of your sales' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Security Settings</h2>
                  <p className="text-gray-600 text-sm mb-6">Manage your account security</p>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">Current Session</p>
                          <p className="text-sm text-gray-500">Parrot OS • Chrome • Bangalore, IN</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Active Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings