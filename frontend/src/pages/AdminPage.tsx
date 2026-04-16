import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase, Booking } from '../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { formatIndianCurrency } from '../data/services';

const ADMIN_EMAIL = 'admin@sparkclean.in';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'revenue'>('dashboard');

  // Check existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthed(true);
        fetchBookings();
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });
    if (error) {
      toast.error('Invalid credentials');
    } else {
      setAuthed(true);
      fetchBookings();
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
  };

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Status updated to ${status}`);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Area', 'Services', 'Total', 'Payment', 'Date', 'Time', 'Status', 'Created'];
    const rows = bookings.map(b => [
      b.id, b.customer_name, b.phone, b.area,
      Array.isArray(b.services) ? b.services.map((s: any) => s.name).join('; ') : '',
      b.total_price, b.payment_method, b.scheduled_date, b.scheduled_time, b.status, b.created_at
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkclean-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.created_at?.startsWith(today));
  const totalRevenue = bookings.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total_price || 0), 0);
  const pending = bookings.filter(b => b.status === 'pending').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  // Revenue chart data (last 7 days)
  const revenueData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayBookings = bookings.filter(b => b.scheduled_date === dateStr && b.payment_status === 'paid');
    return {
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue: dayBookings.reduce((s, b) => s + (b.total_price || 0), 0),
      bookings: dayBookings.length,
    };
  });

  // Area distribution
  const areaData = bookings.reduce((acc: Record<string, number>, b) => {
    if (b.area) acc[b.area] = (acc[b.area] || 0) + 1;
    return acc;
  }, {});

  // Filtered bookings
  const filtered = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => filterArea === 'all' || b.area === filterArea)
    .filter(b => {
      if (!searchQuery) return true;
      return b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone?.includes(searchQuery);
    });

  const uniqueAreas = [...new Set(bookings.map(b => b.area).filter(Boolean))];

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-400/20 text-yellow-400',
      confirmed: 'bg-blue-400/20 text-blue-400',
      completed: 'bg-green-400/20 text-green-400',
      cancelled: 'bg-red-400/20 text-red-400',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-dm font-semibold ${colors[status] || 'glass text-white/50'}`}>
        {status}
      </span>
    );
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #07101E 100%)' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-3xl p-10 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✦</div>
            <h1 className="font-syne font-bold text-2xl text-white">SparkClean Admin</h1>
            <p className="text-white/40 font-dm text-sm mt-1">Management Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 font-dm">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder={ADMIN_EMAIL}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5 font-dm">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
            <button type="submit" disabled={loginLoading} className="btn-teal w-full py-3.5 mt-2">
              {loginLoading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs font-dm mt-6">
            Authorized personnel only
          </p>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen" style={{ background: '#07101E' }}>
      {/* Admin Navbar */}
      <div className="glass-dark border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-teal-400 text-2xl font-bold">✦</span>
            <div>
              <span className="font-syne font-bold text-white">SparkClean</span>
              <span className="text-white/40 text-sm font-dm ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchBookings} className="glass px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-dm transition-colors">
              ↻ Refresh
            </button>
            <button onClick={() => navigate('/')} className="glass px-4 py-2 rounded-lg text-white/60 hover:text-white text-sm font-dm transition-colors">
              View Site
            </button>
            <button onClick={handleLogout} className="glass px-4 py-2 rounded-lg text-red-400/70 hover:text-red-400 text-sm font-dm transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['dashboard', 'bookings', 'revenue'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`category-tab capitalize ${activeTab === tab ? 'active' : 'text-white/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Today's Bookings", value: todayBookings.length, icon: '📅', color: '#0AFFE6' },
                { label: 'Total Revenue', value: formatIndianCurrency(totalRevenue), icon: '💰', color: '#4ADE80' },
                { label: 'Pending Jobs', value: pending, icon: '⏳', color: '#FACC15' },
                { label: 'Completed', value: completed, icon: '✅', color: '#A78BFA' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <p className="text-white/40 text-xs font-dm">{stat.label}</p>
                  <p className="font-syne font-bold text-2xl mt-1" style={{ color: stat.color }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Area distribution */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-syne font-bold text-white text-lg mb-4">Bookings by Area</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(areaData)
                  .sort(([, a], [, b]) => b - a)
                  .map(([area, count]) => (
                    <div key={area} className="glass-teal flex items-center gap-2 rounded-full px-4 py-1.5">
                      <span className="text-teal-400 font-dm text-sm font-medium">{area}</span>
                      <span className="bg-teal-400/20 text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent bookings */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-syne font-bold text-white text-lg mb-4">Recent Bookings</h3>
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="w-10 h-10 glass-teal rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-400 font-syne font-bold text-sm">{b.customer_name?.[0] || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-dm font-medium text-white text-sm truncate">{b.customer_name}</p>
                    <p className="text-white/40 text-xs font-dm">{b.area} · {b.scheduled_date}</p>
                  </div>
                  <StatusBadge status={b.status || 'pending'} />
                  <p className="font-syne font-bold text-teal-400 flex-shrink-0 text-sm">
                    {formatIndianCurrency(b.total_price || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name or phone..."
                className="form-input max-w-60"
              />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="form-input max-w-40" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <option value="all" style={{ background: '#0A1628' }}>All Status</option>
                {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                  <option key={s} value={s} style={{ background: '#0A1628' }}>{s}</option>
                ))}
              </select>
              <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
                className="form-input max-w-48" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <option value="all" style={{ background: '#0A1628' }}>All Areas</option>
                {uniqueAreas.map(a => (
                  <option key={a} value={a} style={{ background: '#0A1628' }}>{a}</option>
                ))}
              </select>
              <button onClick={exportCSV} className="btn-teal px-4 py-2 text-sm ml-auto">
                ↓ Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Customer', 'Area', 'Service', 'Date & Time', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left py-4 px-4 text-white/40 font-dm text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} className="text-center py-12 text-white/40 font-dm">Loading...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-12 text-white/40 font-dm">No bookings found</td></tr>
                    ) : filtered.map(b => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-dm font-medium text-white text-sm">{b.customer_name}</p>
                          <p className="text-white/40 text-xs">{b.phone}</p>
                        </td>
                        <td className="py-4 px-4 text-white/70 font-dm text-sm">{b.area}</td>
                        <td className="py-4 px-4">
                          <p className="text-white/70 font-dm text-xs max-w-xs truncate">
                            {Array.isArray(b.services) ? b.services.map((s: any) => s.name).join(', ') : '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-white/60 font-dm text-sm">
                          {b.scheduled_date} <br />
                          <span className="text-white/30 text-xs">{b.scheduled_time}</span>
                        </td>
                        <td className="py-4 px-4 font-syne font-bold text-teal-400 text-sm">
                          {formatIndianCurrency(b.total_price || 0)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-dm font-semibold ${
                            b.payment_status === 'paid' ? 'bg-green-400/15 text-green-400' : 'bg-yellow-400/15 text-yellow-400'
                          }`}>
                            {b.payment_method === 'cod' ? 'COD' : b.payment_status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={b.status || 'pending'} />
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={b.status}
                            onChange={e => updateStatus(b.id!, e.target.value as BookingStatus)}
                            className="text-xs glass rounded-lg px-2 py-1.5 text-white/70"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                          >
                            {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                              <option key={s} value={s} style={{ background: '#0A1628' }}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-syne font-bold text-white text-lg mb-6">Revenue — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontFamily: 'DM Sans', fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontFamily: 'DM Sans', fontSize: 12 }}
                    tickFormatter={v => `₹${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#0D1D3E', border: '1px solid rgba(10,255,230,0.2)', borderRadius: '12px', fontFamily: 'DM Sans' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    formatter={(value: any) => [`₹${(value || 0).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#0AFFE6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-syne font-bold text-white text-lg mb-6">Bookings per Day</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontFamily: 'DM Sans', fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontFamily: 'DM Sans', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: '#0D1D3E', border: '1px solid rgba(10,255,230,0.2)', borderRadius: '12px', fontFamily: 'DM Sans' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Bar dataKey="bookings" fill="#A78BFA" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
