import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Loader2, Save, X, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userRole?: string;
}

export default function ProfileModal({ isOpen, onClose, onLogout, userRole }: ProfileModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const getAuthToken = () => localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      setInitialLoading(true);
      const token = getAuthToken();
      if (!token) {
        onLogout();
        return;
      }
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            fullName: data.fullName || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        } else if (response.status === 401 || response.status === 403) {
           onLogout();
        } else {
          toast.error("Failed to load profile details.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to connect to server.");
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchProfile();
  }, [isOpen, onLogout, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to update your profile');
      onLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Profile updated successfully!');
        
        // Update local storage user details
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          currentUser.fullName = formData.fullName;
          localStorage.setItem('user', JSON.stringify(currentUser));
          // Dispatch a custom event to notify Navbar of the update
          window.dispatchEvent(new Event('profileUpdated'));
        }
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md bg-[#0D1D3E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-tight">Your Profile</h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {initialLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#0AFFE6] animate-spin mb-4" />
                <p className="text-sm text-gray-400">Loading your details...</p>
              </div>
            ) : (
              <div className="p-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="fullName" className="block text-[13px] font-medium text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[13px] font-medium text-gray-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-[13px] font-medium text-gray-300 mb-1.5">
                      Home Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                        placeholder="123 Main St, City, State 12345"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0A1628] bg-[#0AFFE6] hover:bg-[#00E5CC] focus:outline-none transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
                  {userRole === 'ADMIN' && (
                    <button 
                      onClick={() => { onClose(); navigate('/admin'); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-[#0AFFE6] bg-[#0AFFE6]/10 hover:bg-[#0AFFE6]/20 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Secure Logout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}