import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, Users } from 'lucide-react';

const PaymentVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'pending' 
        ? 'http://localhost:5000/api/payment-verification/pending'
        : `http://localhost:5000/api/payment-verification/all?status=${filter}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.success) {
        setVerifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verificationId) => {
    if (!window.confirm('Are you sure you want to verify this payment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/payment-verification/${verificationId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: 1,
          admin_notes: adminNotes || 'Payment verified successfully'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Payment verified successfully! Order status updated to confirmed.');
        setSelectedVerification(null);
        setAdminNotes('');
        fetchVerifications();
      } else {
        alert('Failed to verify payment: ' + data.message);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Error verifying payment. Please try again.');
    }
  };

  const handleReject = async (verificationId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this payment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/payment-verification/${verificationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: 1,
          rejection_reason: rejectionReason
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Payment rejected. Customer will be notified.');
        setSelectedVerification(null);
        setRejectionReason('');
        fetchVerifications();
      } else {
        alert('Failed to reject payment: ' + data.message);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Error rejecting payment. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      verified: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon size={14} />
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Payment Verifications</h1>
          <p className="text-secondary">Review and verify customer payment submissions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card p-2 rounded-xl inline-flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-smooth ${
            filter === 'pending'
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
              : 'text-secondary hover:text-primary hover:bg-glass'
          }`}
        >
          Pending ({verifications.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-smooth ${
            filter === 'verified'
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
              : 'text-secondary hover:text-primary hover:bg-glass'
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-smooth ${
            filter === 'rejected'
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
              : 'text-secondary hover:text-primary hover:bg-glass'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Verifications List */}
      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-secondary">Loading verifications...</p>
        </div>
      ) : verifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-secondary mb-4" />
          <p className="text-xl text-secondary">No {filter} verifications found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {verifications.map((verification) => (
            <div key={verification.verification_id} className="glass-card p-6 hover-glow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">
                    Order #{verification.order_number}
                  </h3>
                  <p className="text-sm text-secondary">Transaction ID: {verification.transaction_id}</p>
                </div>
                {getStatusBadge(verification.verification_status)}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Users size={18} />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-secondary"><span className="text-primary font-medium">Name:</span> {verification.customer_name}</p>
                    <p className="text-secondary"><span className="text-primary font-medium">Email:</span> {verification.customer_email}</p>
                    <p className="text-secondary"><span className="text-primary font-medium">Phone:</span> {verification.customer_phone || 'N/A'}</p>
                    <p className="text-secondary"><span className="text-primary font-medium">Amount:</span> ₹{verification.payment_amount}</p>
                    <p className="text-secondary"><span className="text-primary font-medium">Method:</span> {verification.payment_method}</p>
                    <p className="text-secondary"><span className="text-primary font-medium">Submitted:</span> {new Date(verification.submitted_at).toLocaleString()}</p>
                    {verification.days_pending && (
                      <p className="text-orange-400"><span className="font-medium">Pending:</span> {verification.days_pending} days</p>
                    )}
                  </div>
                </div>

                {/* Screenshot */}
                <div>
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <Eye size={18} />
                    Payment Screenshot
                  </h4>
                  {verification.screenshot_filename ? (
                    <img
                      src={`http://localhost:5000/api/payment-verification/screenshot/${verification.screenshot_filename}`}
                      alt="Payment Screenshot"
                      className="w-full h-64 object-contain bg-dark/50 rounded-lg cursor-pointer hover:scale-105 transition-smooth border border-glass"
                      onClick={() => window.open(`http://localhost:5000/api/payment-verification/screenshot/${verification.screenshot_filename}`, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-64 bg-dark/50 rounded-lg flex items-center justify-center border border-glass">
                      <p className="text-muted">No screenshot available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for Pending */}
              {verification.verification_status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-glass">
                  {selectedVerification === verification.verification_id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Admin Notes (Optional)</label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="w-full px-4 py-3 bg-dark/50 border border-glass rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Add any notes about this verification..."
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Rejection Reason (Required for rejection)</label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-4 py-3 bg-dark/50 border border-glass rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-red-500"
                          rows="2"
                          placeholder="Reason for rejection..."
                        ></textarea>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerify(verification.verification_id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-smooth flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Verify Payment
                        </button>
                        <button
                          onClick={() => handleReject(verification.verification_id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-smooth flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Reject Payment
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification(null);
                            setAdminNotes('');
                            setRejectionReason('');
                          }}
                          className="px-6 glass-button py-3 rounded-lg font-semibold transition-smooth"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedVerification(verification.verification_id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-smooth"
                    >
                      Review Payment
                    </button>
                  )}
                </div>
              )}

              {/* Show verification details for verified/rejected */}
              {verification.verification_status !== 'pending' && (
                <div className="mt-6 pt-6 border-t border-glass">
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm text-secondary mb-1">
                      <span className="text-primary font-medium">Verified by:</span> {verification.verified_by_name || 'Admin'}
                    </p>
                    <p className="text-sm text-secondary mb-1">
                      <span className="text-primary font-medium">Date:</span> {verification.verified_at ? new Date(verification.verified_at).toLocaleString() : 'N/A'}
                    </p>
                    {verification.admin_notes && (
                      <p className="text-sm text-secondary mt-2">
                        <span className="text-primary font-medium">Notes:</span> {verification.admin_notes}
                      </p>
                    )}
                    {verification.rejection_reason && (
                      <p className="text-sm text-red-400 mt-2">
                        <span className="font-medium">Rejection Reason:</span> {verification.rejection_reason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentVerifications;
