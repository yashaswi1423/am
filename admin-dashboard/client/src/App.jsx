import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Customers from './pages/Customers'
import Analytics from './pages/Analytics'
import PaymentVerifications from './pages/PaymentVerifications'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
            
            {/* Right side placeholder for future user menu */}
            <div className="w-10 h-10 glass-button rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App