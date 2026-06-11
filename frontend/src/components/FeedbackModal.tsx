import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import axiosInstance from '../lib/axiosInstance';

interface FeedbackModalProps {
  isOpen: boolean;
  bookingId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, bookingId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [serviceName, setServiceName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return toast.error('Please select a rating');
    if (comment.length < 10) return toast.error('Review must be at least 10 characters');

    setLoading(true);
    try {
      // The backend uses JWT to set userId and email if logged in
      await axiosInstance.post('/feedback', {
        rating,
        serviceName,
        comment,
        bookingId,
        customerName: 'Customer', // Backend will accept this, or user can provide it if we have context. For modal, we assume they are logged in or just booked.
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full rounded-2xl p-8 text-center shadow-2xl bg-white border border-[#EDE8DC]"
        >
          {/* Logo / Header */}
          <div className="mx-auto w-12 h-12 flex items-center justify-center mb-4 rounded-full" style={{ background: 'rgba(27,67,50,0.1)' }}>
            <span style={{ color: '#1B4332', fontSize: '24px' }}>✦</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-[#1B4332]">How was your experience?</h2>
          <p style={{ color: '#5C6B5E' }} className="mb-6">Your feedback helps us improve</p>

          <div className="flex justify-center mb-6">
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="mb-4 text-left">
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-[#2D4A35] border border-[#EDE8DC] outline-none focus:border-[#1B4332] transition-colors"
            >
              <option value="">Select Service Used (Optional)</option>
              <option value="Home Deep Cleaning">Home Deep Cleaning</option>
              <option value="Bathroom Cleaning">Bathroom Cleaning</option>
              <option value="Sofa Cleaning">Sofa Cleaning</option>
              <option value="Kitchen Cleaning">Kitchen Cleaning</option>
            </select>
          </div>

          <div className="mb-6 relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full p-4 rounded-xl bg-white text-[#2D4A35] border border-[#EDE8DC] outline-none focus:border-[#1B4332] transition-colors h-32 resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs" style={{ color: comment.length < 10 ? '#C62828' : '#5C6B5E' }}>
              {comment.length}/500
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white mb-3 transition-opacity disabled:opacity-50 bg-[#1B4332] hover:bg-[#0D2B1F]"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>

          <button
            onClick={onClose}
            className="text-sm transition-colors hover:text-[#1B4332]"
            style={{ color: '#5C6B5E', background: 'transparent' }}
          >
            Maybe Later
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
