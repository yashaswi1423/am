import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [approvalToken, setApprovalToken] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  // Poll for approval status
  useEffect(() => {
    if (!waitingForApproval || !approvalToken) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/check-status?token=${approvalToken}`
        );
        const data = await response.json();

        if (data.status === 'approved') {
          // Login approved!
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminUsername', credentials.username);
          setStatusMessage('✅ Login approved! Redirecting...');
          
          setTimeout(() => {
            navigate('/');
            alert('Login successful! You can now access the Admin Dashboard from the menu.');
          }, 1500);
        } else if (data.status === 'rejected') {
          setWaitingForApproval(false);
          setError('❌ Login request was rejected by admin');
          setApprovalToken(null);
        } else if (data.status === 'expired') {
          setWaitingForApproval(false);
          setError('⏰ Approval request expired. Please try again.');
          setApprovalToken(null);
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    // Check status every 3 seconds
    const interval = setInterval(checkStatus, 3000);

    // Cleanup
    return () => clearInterval(interval);
  }, [waitingForApproval, approvalToken, credentials.username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setStatusMessage('');

    // Simple authentication (in production, use proper backend authentication)
    // Default credentials: admin / admin123
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      try {
        // Request approval from admin
        const response = await fetch('http://localhost:5000/api/auth/request-approval', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username
          })
        });

        const data = await response.json();

        if (data.success) {
          setApprovalToken(data.requestToken);
          setWaitingForApproval(true);
          setStatusMessage('📧 Approval request sent! Check your email to approve this login.');
        } else {
          setError('Failed to send approval request. Please try again.');
        }
      } catch (error) {
        console.error('Error requesting approval:', error);
        setError('Network error. Please check your connection and try again.');
      }
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleCancelWaiting = () => {
    setWaitingForApproval(false);
    setApprovalToken(null);
    setStatusMessage('');
  };

  return (
    <div className="min-h-screen pt-20 px-6 py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-3xl p-8 shadow-2xl animate-scale-in">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-accent mb-2">Admin Login</h1>
            <p className="text-gray-600">Secure access with email approval</p>
          </div>

          {/* Waiting for Approval */}
          {waitingForApproval && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-500 rounded-xl animate-pulse">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-bold text-blue-700 text-center mb-2">
                Waiting for Approval
              </h3>
              <p className="text-sm text-blue-600 text-center mb-4">
                {statusMessage || 'An approval email has been sent. Please check your inbox and click the approval link.'}
              </p>
              <div className="text-xs text-blue-500 text-center mb-4">
                ⏰ Request expires in 10 minutes
              </div>
              <button
                onClick={handleCancelWaiting}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && !waitingForApproval && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-xl animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          {!waitingForApproval && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Enter admin username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-accent hover:bg-gray-700 hover:shadow-xl active:scale-95'
                }`}
              >
                {isLoading ? 'Requesting Approval...' : 'Request Login'}
              </button>
            </form>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              <strong>🔐 Two-Factor Security:</strong><br />
              Login requires admin approval via email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
