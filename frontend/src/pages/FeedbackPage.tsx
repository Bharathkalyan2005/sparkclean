import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import axiosInstance from '../lib/axiosInstance';
// @ts-ignore
import Confetti from 'react-confetti';

const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Try to pre-fill if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('sucihome_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.email) setCustomerEmail(decoded.email);
        if (decoded.fullName) setCustomerName(decoded.fullName);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a star rating');
    if (comment.length < 20) return toast.error('Review must be at least 20 characters long');
    if (!customerName) return toast.error('Name is required');

    setLoading(true);
    try {
      await axiosInstance.post('/feedback', {
        customerName,
        customerEmail,
        phone,
        area,
        serviceName,
        rating,
        comment,
      });
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2D4A35]">
        <Navbar />
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Confetti numberOfPieces={200} recycle={false} />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 relative z-10 mt-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center p-8 rounded-2xl shadow-xl"
            style={{ background: '#FFFFFF', border: '1px solid #EDE8DC' }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-[#1B4332]">Thank you!</h2>
            <p style={{ color: '#5C6B5E' }} className="mb-6">Your review has been submitted and is pending approval.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl font-bold text-white transition-opacity bg-[#1B4332] hover:bg-[#0D2B1F]"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2D4A35]">
      <Navbar />
      
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-12 md:py-20 mt-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#1B4332]">Share Your Experience</h1>
          <p style={{ color: '#5C6B5E' }}>Help others know about SuciHome</p>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="p-6 md:p-8 rounded-2xl shadow-xl bg-white"
          style={{ border: '1px solid #EDE8DC' }}
        >
          <div className="mb-8 flex flex-col items-center">
            <label className="block text-sm font-semibold mb-3 text-[#2D4A35]">Rate our service <span className="text-red-500">*</span></label>
            <StarRating value={rating} onChange={setRating} size={40} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2 text-[#2D4A35]">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                className="w-full p-3 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#2D4A35]">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2 text-[#2D4A35]">Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332]"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-[#2D4A35]">Area / Location</label>
              <select
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332]"
              >
                <option value="">Select Area</option>
                <option value="MVP Colony">MVP Colony</option>
                <option value="Seethammadhara">Seethammadhara</option>
                <option value="Gajuwaka">Gajuwaka</option>
                <option value="Madhurawada">Madhurawada</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 text-[#2D4A35]">Service Used</label>
            <select
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332]"
            >
              <option value="">Select Service</option>
              <option value="Home Deep Cleaning">Home Deep Cleaning</option>
              <option value="Bathroom Cleaning">Bathroom Cleaning</option>
              <option value="Sofa Cleaning">Sofa Cleaning</option>
              <option value="Kitchen Cleaning">Kitchen Cleaning</option>
            </select>
          </div>

          <div className="mb-8 relative">
            <label className="block text-sm mb-2 text-[#2D4A35]">Your Review <span className="text-red-500">*</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              placeholder="Tell us what you loved about the service..."
              className="w-full p-4 rounded-xl bg-white border border-[#EDE8DC] text-[#2D4A35] outline-none focus:border-[#1B4332] h-32 resize-none"
              maxLength={1000}
            />
            <div className="absolute bottom-3 right-3 text-xs" style={{ color: comment.length < 20 ? '#C62828' : '#5C6B5E' }}>
              {comment.length} / 1000
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all bg-[#1B4332] hover:bg-[#0D2B1F] disabled:opacity-50 text-lg flex justify-center items-center gap-2"
          >
            {loading ? 'Submitting...' : 'Submit My Review ✦'}
          </button>

        </motion.form>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
