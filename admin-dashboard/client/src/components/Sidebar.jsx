import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Users, 
  BarChart3, 
  X,
  Sparkles,
  CreditCard
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Payment Verifications', path: '/payment-verifications', icon: CreditCard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel transition-smooth lg:translate-x-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-primary tracking-wide">Admin Panel</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden glass-button p-1.5 rounded-lg text-secondary hover:text-primary transition-smooth"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-smooth group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-primary shadow-lg shadow-blue-500/30'
                    : 'text-secondary hover:bg-glass hover:text-primary hover:border hover:border-glass'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={20} 
                    className={`transition-smooth ${
                      isActive 
                        ? 'text-white' 
                        : 'text-secondary group-hover:text-blue-400'
                    }`}
                  />
                  <span className={`font-medium ${
                    isActive 
                      ? 'text-white' 
                      : 'group-hover:text-primary'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-glass">
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-secondary">System Status</span>
            </div>
            <p className="text-xs text-muted">All systems operational</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar