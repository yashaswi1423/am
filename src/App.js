import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';

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
