import { Menu, Bell, User } from 'lucide-react'

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden">
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-800">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
