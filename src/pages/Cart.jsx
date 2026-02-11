import React, { useState } from 'react';
import { customerAPI, orderAPI } from '../services/api';
import Payment from './Payment';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const [addressForm, setAddressForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    alert('Address saved successfully!');
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!addressForm.name || !addressForm.email || !addressForm.phone || !addressForm.address) {
      alert('Please fill in all address details first!');
      return;
    }

    // Prepare order data and show payment modal
    setOrderData({
      name: addressForm.name,
      email: addressForm.email,
      phone: addressForm.phone,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state,
      postalCode: addressForm.postalCode,
      total: total,
      items: cartItems,
      orderId: 'ORD' + Date.now()
    });
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async (paymentData) => {
    setShowPaymentModal(false);
    setIsProcessing(true);

    try {
      // Split name into first and last name
      const nameParts = addressForm.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Step 1: Create or get customer
      let customer;
      try {
        customer = await customerAPI.getCustomerByEmail(addressForm.email);
      } catch (error) {
        // Customer doesn't exist, create new one
        customer = await customerAPI.createCustomer({
          email: addressForm.email,
          password_hash: 'web_customer',
          first_name: firstName,
          last_name: lastName,
          phone: addressForm.phone,
          address_line1: addressForm.address,
          city: addressForm.city || 'N/A',
          state: addressForm.state || 'N/A',
          postal_code: addressForm.postalCode || '000000',
          country: 'India',
        });
      }

      // Step 2: Create order with pending_verification status
      const orderDataToSend = {
        customer_id: customer.customer_id,
        order_status: 'pending',
        payment_status: 'pending_verification',
        subtotal: total,
        discount_amount: 0,
        tax_amount: 0,
        shipping_cost: 0,
        total_amount: total,
        shipping_address: `${addressForm.name}\n${addressForm.phone}\n${addressForm.address}\n${addressForm.city || ''} ${addressForm.state || ''} ${addressForm.postalCode || ''}`,
        billing_address: `${addressForm.name}\n${addressForm.phone}\n${addressForm.address}\n${addressForm.city || ''} ${addressForm.state || ''} ${addressForm.postalCode || ''}`,
        items: cartItems.map(item => ({
          product_id: null,
          variant_id: null,
          product_name: item.name,
          variant_details: `Size: ${item.size}${item.color ? `, Color: ${item.color}` : ''}`,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        })),
        payment_method: 'upi',
        transaction_id: paymentData.transactionId
      };

      const order = await orderAPI.createOrder(orderDataToSend);

      // Step 3: Submit payment verification with screenshot
      const formData = new FormData();
      formData.append('order_id', order.order_id);
      formData.append('transaction_id', paymentData.transactionId);
      formData.append('payment_method', paymentData.paymentMethod);
      formData.append('payment_amount', total);
      formData.append('customer_name', addressForm.name);
      formData.append('customer_email', addressForm.email);
      formData.append('customer_phone', addressForm.phone);
      formData.append('screenshot', paymentData.screenshot);

      const verificationResponse = await fetch('http://localhost:5000/api/payment-verification/submit', {
        method: 'POST',
        body: formData
      });

      if (!verificationResponse.ok) {
        throw new Error('Failed to submit payment verification');
      }

      // Success!
      setOrderSuccess(true);
      setOrderNumber(order.order_number);
      
      // Clear cart
      cartItems.forEach(item => removeFromCart(item.id, item.size));
      alert(`Order placed successfully! Order Number: ${order.order_number}\n\nPayment verification submitted. You will receive confirmation email within 24-48 hours after verification.`);

    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Failed to place order: ${error.response?.data?.error || error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen pt-20 px-6 py-16 overflow-x-hidden">
      {/* Payment Modal */}
      {showPaymentModal && (
        <Payment
          orderData={orderData}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-accent mb-12 animate-fade-in-up">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-card rounded-3xl p-12 text-center shadow-lg animate-scale-in hover-glow">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-xl text-gray-500 animate-fade-in-up stagger-1">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-card rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up hover-lift group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-6">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                          {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-125 hover:rotate-90"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="w-8 h-8 rounded-xl bg-gray-200 hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-lg font-medium w-8 text-center transition-all duration-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-8 h-8 rounded-xl bg-gray-200 hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-2xl font-bold text-accent transition-all duration-300 group-hover:scale-110">₹{(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Address Form */}
            <div className="bg-card rounded-3xl p-6 shadow-lg animate-slide-left hover-glow">
              <h2 className="text-2xl font-semibold text-accent mb-6">Delivery Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={addressForm.email}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="10-digit mobile number"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder="Your delivery address"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    pattern="[0-9]{6}"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="6-digit PIN code"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 text-white py-3 rounded-2xl font-medium hover:bg-gray-700 transition-all duration-500 hover:shadow-xl active:scale-95 transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="relative z-10">Save Address</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div id="payment-section" className="bg-accent rounded-3xl p-6 shadow-2xl text-white animate-slide-left stagger-1 hover-glow">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-200">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={isProcessing || orderSuccess}
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl active:scale-95 transform hover:-translate-y-1 relative overflow-hidden group ${
                  isProcessing || orderSuccess
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-white text-accent hover:bg-gray-100 animate-pulse-slow'
                }`}
              >
                <span className="relative z-10">
                  {isProcessing ? 'Processing Order...' : orderSuccess ? `Order Placed! #${orderNumber}` : 'Proceed to Payment'}
                </span>
                {!isProcessing && !orderSuccess && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
