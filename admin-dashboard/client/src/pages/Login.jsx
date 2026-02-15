import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [approvalToken, setApprovalToken] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'https://am-git-main-yashaswis-projects-bedecf50.vercel.app/api';

  // Main admin credentials
  const MAIN_ADMIN = {
    username: 'admin',
    password: 'admin123'
  };

  // Poll for approval status
  useEffect(() => {
    if (!waitingApproval || !approvalToken) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/auth/check-approval?token=${approvalToken}`);
        const data = await response.json();

        if (data.status === 'approved') {
          clearInterval(pollInterval);
          // Login successful
          localStorage.setItem('adminToken', approvalToken);
          localStorage.setItem('adminUsername', data.username);
          onLogin(data.username);
          navigate('/dashboard');
        } else if (data.status === 'rejected') {
          clearInterval(pollInterval);
          setError('Login request was rejected by admin');
          setWaitingApproval(false);
        } else if (data.status === 'expired') {
          clearInterval(pollInterval);
          setError('Login request expired. Please try again.');
          setWaitingApproval(false);
        }
      } catch (err) {
        console.error('Error checking approval status:', err);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollInterval);
  }, [waitingApproval, approvalToken, navigate, onLogin, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if main admin
      if (username === MAIN_ADMIN.username && password === MAIN_ADMIN.password) {
        // Direct login for main admin
        localStorage.setItem('adminToken', 'main-admin-token');
        localStorage.setItem('adminUsername', username);
        onLogin(username);
        navigate('/dashboard');
        return;
      }

      // For other users, request approval
      const response = await fetch(`${API_URL}/auth/request-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setApprovalToken(data.requestToken);
        setWaitingApproval(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (waitingApproval) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 p-4">
        <div className="glass-panel max-w-md w-full p-8 rounded-2xl text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-primary mb-4">Waiting for Approval</h2>
          <p className="text-secondary mb-6">
            An approval request has been sent to the main admin. Please wait...
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          <p className="text-sm text-secondary">
            The admin will receive an email with approve/reject links
          </p>

          <button
            onClick={() => {
              setWaitingApproval(false);
              setApprovalToken('');
            }}
            className="mt-6 glass-button px-6 py-2 rounded-lg text-secondary hover:text-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-secondary">AM Fashions Dashboard</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you're not the main admin, your login request will be sent for approval via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
