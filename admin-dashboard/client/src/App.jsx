import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import PaymentVerifications from './pages/PaymentVerifications'
import Offers from './pages/Offers'
import Login from './pages/Login'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const username = localStorage.getItem('adminUsername')
    if (token && username) {
      setIsAuthenticated(true)
      setAdminUsername(username)
    }
  }, [])

  const handleLogin = (username) => {
    setIsAuthenticated(true)
    setAdminUsername(username)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUsername')
    setIsAuthenticated(false)
    setAdminUsername('')
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-main overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-smooth ${
          sidebarOpen ? 'ml-0 md:ml-0' : 'ml-0'
        }`}
      >
        {/* Glass Header/Navbar */}
        <header className="glass-panel border-b border-glass backdrop-blur-glass sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="glass-button p-2 rounded-lg text-secondary hover:text-primary"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-xl font-semibold text-primary tracking-wide">
              Admin Dashboard
            </h1>
            
            {/* User menu with logout */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary hidden md:block">
                {adminUsername}
              </span>
              <button
                onClick={handleLogout}
                className="glass-button px-4 py-2 rounded-lg text-secondary hover:text-red-500 transition-all flex items-center gap-2"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content with Smooth Transition */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-main p-6 animate-fade-in">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payment-verifications" element={<PaymentVerifications />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App