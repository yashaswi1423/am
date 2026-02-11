import React, { useState } from 'react';

const Payment = ({ orderData, onPaymentComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: QR Code, 2: Submit Details, 3: Confirmation
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    paymentMethod: 'UPI (GPay, PhonePe, Paytm)',
    screenshot: null,
    screenshotPreview: null
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentDetails({
        ...paymentDetails,
        screenshot: file,
        screenshotPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = () => {
    if (!paymentDetails.transactionId || !paymentDetails.screenshot) {
      alert('Please enter transaction ID and upload payment screenshot');
      return;
    }
    setCurrentStep(3);
    // Call the completion handler with payment details including screenshot file
    setTimeout(() => {
      onPaymentComplete({
        ...orderData,
        transactionId: paymentDetails.transactionId,
        paymentMethod: paymentDetails.paymentMethod,
        screenshot: paymentDetails.screenshot, // Pass the actual file object
        paymentStatus: 'pending_verification'
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        
        {/* Step 1: QR Code Payment */}
        {currentStep === 1 && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-accent">Complete Payment</h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Payment Details Section */}
            <div className="bg-gradient-to-r from-accent to-gray-700 rounded-2xl p-6 mb-6 text-white">
              <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">PAYMENT DETAILS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">₹{orderData?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">{orderData?.orderId || 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-2xl p-8 mb-6 text-center shadow-lg">
              <div className="inline-block bg-gradient-to-br from-purple-500 to-blue-500 p-6 rounded-2xl mb-4">
                <img
                  src="/WhatsApp Image 2026-02-09 at 10.28.41 PM.jpeg"
                  alt="Payment QR Code"
                  className="w-64 h-64 object-contain bg-white rounded-xl"
                />
              </div>
              <p className="text-gray-600 text-sm">Scan QR Code with any UPI app</p>
              <p className="text-accent font-semibold mt-2">Pay to: AM Fashions</p>
              
              {/* UPI ID Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Or use UPI ID directly:</p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-mono font-bold text-purple-700">6281534110-2@ybl</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('6281534110-2@ybl');
                        alert('UPI ID copied to clipboard!');
                      }}
                      className="p-2 hover:bg-purple-100 rounded-lg transition-all"
                      title="Copy UPI ID"
                    >
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                PAYMENT INSTRUCTIONS
              </h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">1.</span>
                  <span>Scan QR with UPI app (GPay, PhonePe, Paytm)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">2.</span>
                  <span>Pay exact amount: ₹{orderData?.total || 0}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">3.</span>
                  <span>Take screenshot of confirmation</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">4.</span>
                  <span>Note transaction ID (12-digit number)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-orange-600">5.</span>
                  <span>Click "I've Completed Payment" below</span>
                </li>
              </ol>
            </div>

            {/* Important Notice */}
            <div className="bg-pink-50 border-l-4 border-pink-400 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-pink-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                IMPORTANT
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Verification takes 24-48 hours</li>
                <li>• Keep transaction ID safe</li>
                <li>• Screenshot must show success & ID</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 active:scale-95"
              >
                CANCEL
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 active:scale-95 animate-pulse-slow"
              >
                I'VE COMPLETED PAYMENT
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Submit Payment Details */}
        {currentStep === 2 && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-accent">Submit Payment Details</h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Submitting For Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 text-white">
              <h3 className="text-lg font-semibold mb-3">SUBMITTING FOR:</h3>
              <div className="space-y-1 text-sm">
                <p>Name: {orderData?.name || 'Customer'}</p>
                <p>Order Amount: ₹{orderData?.total || 0}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction ID / UPI Reference Number *
                </label>
                <input
                  type="text"
                  value={paymentDetails.transactionId}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                  placeholder="Enter 12-digit transaction ID"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  maxLength="12"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentDetails.paymentMethod}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option>UPI (GPay, PhonePe, Paytm)</option>
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-purple-50 hover:bg-purple-100 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {paymentDetails.screenshotPreview ? (
                      <div>
                        <img
                          src={paymentDetails.screenshotPreview}
                          alt="Payment Screenshot"
                          className="max-h-48 mx-auto rounded-xl mb-2"
                        />
                        <p className="text-sm text-green-600 font-semibold">Screenshot uploaded ✓</p>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-16 h-16 mx-auto text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-purple-600 font-semibold mb-1">Upload payment screenshot</p>
                        <p className="text-xs text-gray-500">Click to choose file</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Verification Process */}
              <div className="bg-orange-50 border-l-4 border-orange-400 rounded-xl p-6">
                <h4 className="font-bold text-orange-800 mb-2">VERIFICATION PROCESS</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Verification within 24-48 hours</li>
                  <li>• Email confirmation once approved</li>
                  <li>• Account upgraded automatically</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 active:scale-95"
                >
                  BACK
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 active:scale-95"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="p-8 text-center">
            <div className="mb-6 animate-scale-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-accent mb-2">Payment Submitted!</h2>
              <p className="text-gray-600">Your order has been placed successfully</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono font-semibold">{orderData?.orderId || 'Processing...'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold">₹{orderData?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{paymentDetails.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-orange-600 font-semibold">Pending Verification</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-6 mb-6 text-left">
              <h4 className="font-bold text-blue-800 mb-2">What's Next?</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>We'll verify your payment within 24-48 hours</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>You'll receive email confirmation</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Your order will be processed and shipped</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Track your order via email updates</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onPaymentComplete}
              className="w-full bg-accent text-white py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300 active:scale-95"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
