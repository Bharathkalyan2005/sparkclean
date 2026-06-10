import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Loader2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
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
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        navigate('/auth');
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
           localStorage.removeItem('token');
           localStorage.removeItem('user');
           navigate('/auth');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to update your profile');
      navigate('/auth');
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
        toast.success(data.message || 'Profile updated successfully!');
        
        // Update local storage user details if needed
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          currentUser.fullName = formData.fullName;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#0AFFE6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] pt-24 pb-12 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-[#0AFFE6] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D1D3E] py-8 px-6 shadow-2xl sm:rounded-2xl border border-white/5"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Your Profile</h2>
            <p className="mt-2 text-sm text-gray-400">Update your personal details below</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                Home Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-[#0A1628] border border-white/10 rounded-xl py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0AFFE6]/50 focus:border-transparent transition-all sm:text-sm"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0A1628] bg-gradient-to-r from-[#0AFFE6] to-[#0A8FE6] hover:from-[#08E5CE] hover:to-[#087BD0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0AFFE6] focus:ring-offset-[#0D1D3E] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
        </motion.div>
      </div>
    </div>
  );
}
