import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Chatbot from './components/Chatbot';
import Maintenance from './pages/Maintenance';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AppContent({ cartItems, addToCart, removeFromCart, updateQuantity }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar cartCount={cartItems.length} />
      <div className="flex-grow overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={
            <Cart 
              cartItems={cartItems} 
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  // Check maintenance mode on app load
  useEffect(() => {
    checkMaintenanceMode();
    // Check every 30 seconds
    const interval = setInterval(checkMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const response = await axios.get(`${API_URL}/system/maintenance/status`);
      if (response.data.success) {
        setMaintenanceMode(response.data.data.enabled);
        setMaintenanceMessage(response.data.data.message);
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      // If API fails, assume not in maintenance mode
      setMaintenanceMode(false);
    } finally {
      setCheckingMaintenance(false);
    }
  };

  const handleInitialLoadComplete = () => {
    setIsInitialLoading(false);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.size === product.size);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id && item.size === product.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems(cartItems.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId, size);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Show loading while checking maintenance mode
  if (checkingMaintenance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Show maintenance page if enabled
  if (maintenanceMode) {
    return <Maintenance message={maintenanceMessage} />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isInitialLoading ? (
        <LoadingScreen onLoadComplete={handleInitialLoadComplete} />
      ) : (
        <AppContent 
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      )}
    </Router>
  );
}

export default App;
