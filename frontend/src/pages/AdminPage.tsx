import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosInstance from '../lib/axiosInstance';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, ClipboardList, Users, Settings, 
  IndianRupee, Ticket, MessageSquare, LogOut, Loader2, Sparkles, Star
} from 'lucide-react';

// Types

const ADMIN_COLORS = {
  bg: '#0A0A0A',
  sidebar: '#111111',
  card: '#161616',
  accent: '#0AFFE6',
  border: 'rgba(255,255,255,0.08)',
  text: '#FFFFFF',
  muted: '#A0A0A0',
  emerald: '#22C55E',
  amber: '#F59E0B',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444'
};

const roleBadgeColor: Record<string, { bg: string, text: string }> = {
  CUSTOMER: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  ADMIN: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  CLEANER: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: ADMIN_COLORS.amber,
    CONFIRMED: ADMIN_COLORS.blue,
    ASSIGNED: ADMIN_COLORS.purple,
    IN_PROGRESS: ADMIN_COLORS.accent,
    COMPLETED: ADMIN_COLORS.emerald,
    CANCELLED: ADMIN_COLORS.red,
  };
  return (
    <span style={{
      background: colors[status] || ADMIN_COLORS.accent,
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 'bold'
    }}>
      {status}
    </span>
  );
};

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState<any>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Drive activeTab off the URL path natively
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const activeTab = currentPath === 'sparkadmin' ? 'dashboard' : currentPath;

  useEffect(() => {
    const token = localStorage.getItem('sparkclean_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setAdminUser(decoded);
      } catch {}
    }
  }, []);

  const fetchStats = async () => {
    try {
      const [{ data: sData }, { data: bData }] = await Promise.all([
        axiosInstance.get('/admin/stats'),
        axiosInstance.get('/admin/bookings?limit=5')
      ]);
      setStats(sData);
      setBookings(bData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/customers');
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/messages');
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axiosInstance.get('/feedback/all');
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromos = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/promos');
      setPromos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/services');
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'dashboard' || activeTab === 'bookings' || activeTab === 'revenue') fetchStats();
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'messages') fetchMessages();
    if (activeTab === 'feedback') fetchFeedbacks();
    if (activeTab === 'promos') fetchPromos();
    if (activeTab === 'services') fetchServices();
    
    // Provide a brief loading state simulation for placeholder pages
    if (['settings'].includes(activeTab)) {
      setTimeout(() => setLoading(false), 300);
    }
    
    const interval = setInterval(() => {
      if (activeTab === 'dashboard') fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('sparkclean_token');
    navigate('/auth');
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axiosInstance.patch(`/admin/bookings/${id}/status`, { status });
      toast.success('Status updated!');
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (newRole === 'ADMIN') {
      const confirm = window.confirm(
        'Are you sure you want to make this user an ADMIN? They will have full access to the dashboard.'
      );
      if (!confirm) return;
    }

    try {
      await axiosInstance.patch(`/admin/customers/${userId}/role`, { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      
      setCustomers(prev => 
        prev.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change role');
    }
  };

  const handleFeedbackAction = async (id: string, action: 'approve' | 'reject' | 'feature' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        await axiosInstance.delete(`/feedback/${id}`);
      } else {
        await axiosInstance.patch(`/feedback/${id}/${action}`, action === 'feature' ? { featured: true } : {});
      }
      toast.success(`Review ${action}d successfully`);
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to perform action');
    }
  };

  const handlePromoCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get('code'),
      discountType: formData.get('discountType'),
      discountValue: formData.get('discountValue'),
      minOrder: formData.get('minOrder'),
      maxUses: formData.get('maxUses'),
    };
    try {
      await axiosInstance.post('/admin/promos', data);
      toast.success('Promo created successfully');
      fetchPromos();
      // @ts-ignore
      e.target.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create promo');
    }
  };

  const handlePromoToggle = async (id: string, currentState: boolean) => {
    try {
      await axiosInstance.patch(`/admin/promos/${id}/toggle`, { isActive: !currentState });
      fetchPromos();
    } catch (error) {
      toast.error('Failed to toggle promo');
    }
  };

  const handlePromoDelete = async (id: string) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await axiosInstance.delete(`/admin/promos/${id}`);
      toast.success('Promo deleted');
      fetchPromos();
    } catch (error) {
      toast.error('Failed to delete promo');
    }
  };

  const handleServiceCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: formData.get('price'),
    };
    try {
      await axiosInstance.post('/admin/services', data);
      toast.success('Service created successfully');
      fetchServices();
      // @ts-ignore
      e.target.reset();
    } catch (error: any) {
      toast.error('Failed to create service');
    }
  };

  const handleServiceToggle = async (id: string, currentState: boolean) => {
    try {
      await axiosInstance.patch(`/admin/services/${id}`, { isActive: !currentState });
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (!window.confirm('Delete this service? Note: This might break past bookings using this service ID.')) return;
    try {
      await axiosInstance.delete(`/admin/services/${id}`);
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
          setLoading(true);
          navigate(id === 'dashboard' ? '/sparkadmin' : `/sparkadmin/${id}`);
        }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: isActive ? 'rgba(10,255,230,0.1)' : 'transparent',
          borderLeft: isActive ? `3px solid ${ADMIN_COLORS.accent}` : '3px solid transparent',
          color: isActive ? ADMIN_COLORS.accent : ADMIN_COLORS.muted,
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          marginBottom: '4px',
          textAlign: 'left'
        }}
      >
        <Icon size={18} />
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: ADMIN_COLORS.bg, color: ADMIN_COLORS.text, fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: ADMIN_COLORS.sidebar, borderRight: `1px solid ${ADMIN_COLORS.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${ADMIN_COLORS.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color={ADMIN_COLORS.accent} size={24} />
            <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>SparkClean</span>
          </div>
          <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px', marginTop: '4px' }}>Admin Panel</p>
        </div>
        
        <div style={{ padding: '16px', borderBottom: `1px solid ${ADMIN_COLORS.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: ADMIN_COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
            {adminUser?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: '600' }}>Admin User</p>
            <p style={{ fontSize: '12px', color: ADMIN_COLORS.muted, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{adminUser?.email}</p>
          </div>
        </div>

        <div style={{ padding: '16px 0', flex: 1, overflowY: 'auto' }}>
          <SidebarItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="bookings" label="Bookings" icon={ClipboardList} />
          <SidebarItem id="customers" label="Customers" icon={Users} />
          <SidebarItem id="services" label="Services" icon={Sparkles} />
          <SidebarItem id="revenue" label="Revenue" icon={IndianRupee} />
          <SidebarItem id="promos" label="Promo Codes" icon={Ticket} />
          <SidebarItem id="feedback" label="Feedback" icon={Star} />
          <SidebarItem id="messages" label="Messages" icon={MessageSquare} />
          <SidebarItem id="settings" label="Settings" icon={Settings} />
        </div>

        <div style={{ padding: '16px', borderTop: `1px solid ${ADMIN_COLORS.border}` }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: ADMIN_COLORS.red, fontSize: '14px', fontWeight: '500', width: '100%', padding: '8px' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        
        {loading && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" color={ADMIN_COLORS.accent} /></div>}
        
        {!loading && (
          <Routes>
            {/* DASHBOARD TAB */}
            <Route path="/" element={
              stats ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Overview</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: ADMIN_COLORS.emerald }}>
                      <div style={{ width: '8px', height: '8px', background: ADMIN_COLORS.emerald, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                      Live — updates every 30s
                    </div>
                  </div>

            {/* KPI ROW */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <KPI title="Today's Bookings" value={stats.cards.todayBookings.value} subtext={`vs yesterday: ${stats.cards.todayBookings.diff > 0 ? '+' : ''}${stats.cards.todayBookings.diff}`} icon={<ClipboardList />} color={ADMIN_COLORS.accent} rgb="10,255,230" />
              <KPI title="Today's Revenue" value={`₹${stats.cards.todayRevenue.value}`} subtext="collected today" icon={<IndianRupee />} color={ADMIN_COLORS.emerald} rgb="34,197,94" />
              <KPI title="Pending Jobs" value={stats.cards.pendingJobs.value} subtext="Need attention" icon={<Loader2 />} color={ADMIN_COLORS.amber} rgb="245,158,11" />
              <KPI title="Total Customers" value={stats.cards.totalCustomers.value} subtext={`+${stats.cards.totalCustomers.newThisWeek} this week`} icon={<Users />} color={ADMIN_COLORS.purple} rgb="139,92,246" />
            </div>

            {/* CHART ROW */}
            <div style={{ background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px', height: '400px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: ADMIN_COLORS.muted }}>Revenue — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke={ADMIN_COLORS.muted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke={ADMIN_COLORS.muted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ background: '#000', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill={ADMIN_COLORS.accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* TWO COLUMNS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
              
              {/* Recent Bookings */}
              <div style={{ background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Recent Bookings</h3>
                  <button onClick={() => navigate('/sparkadmin/bookings')} style={{ color: ADMIN_COLORS.accent, fontSize: '13px' }}>View All →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ color: ADMIN_COLORS.muted, borderBottom: `1px solid ${ADMIN_COLORS.border}`, textAlign: 'left' }}>
                      <th style={{ paddingBottom: '12px' }}>Booking ID</th>
                      <th style={{ paddingBottom: '12px' }}>Customer</th>
                      <th style={{ paddingBottom: '12px' }}>Amount</th>
                      <th style={{ paddingBottom: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: `1px solid ${ADMIN_COLORS.border}` }}>
                          <td style={{ padding: '12px 0' }}>
                            <span style={{
                              color      : '#0AFFE6',
                              fontFamily : 'monospace',
                              fontSize   : '13px',
                              fontWeight : '600',
                            }}>
                              {b.bookingNumber}
                            </span>
                          </td>
                        <td style={{ padding: '12px 0' }}>{b.customerName}</td>
                        <td style={{ padding: '12px 0' }}>₹{b.totalAmount}</td>
                        <td style={{ padding: '12px 0' }}><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Services */}
              <div style={{ background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>Top Services</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.topServices?.map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px' }}>{s.name}</span>
                      <span style={{ fontSize: '14px', color: ADMIN_COLORS.muted }}>{s.count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* GLOBAL STATS */}
            <div style={{ display: 'flex', gap: '24px', background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>All Time Bookings</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>{stats.global.totalBookings}</p>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${ADMIN_COLORS.border}`, textAlign: 'center' }}>
                <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>All Time Revenue</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>₹{stats.global.totalRevenue}</p>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${ADMIN_COLORS.border}`, textAlign: 'center' }}>
                <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>Completed Jobs</p>
                <p style={{ fontSize: '24px', color: ADMIN_COLORS.emerald, fontWeight: 'bold', marginTop: '4px' }}>{stats.global.completedJobs}</p>
              </div>
              <div style={{ flex: 1, borderLeft: `1px solid ${ADMIN_COLORS.border}`, textAlign: 'center' }}>
                <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>Cancelled Jobs</p>
                <p style={{ fontSize: '24px', color: ADMIN_COLORS.red, fontWeight: 'bold', marginTop: '4px' }}>{stats.global.cancelledJobs}</p>
              </div>
            </div>

          </motion.div>
              ) : <Navigate to="/sparkadmin" />
            } />

            {/* Other Tabs (Placeholder for now to satisfy component size) */}
            <Route path="bookings" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Bookings Management</h1>
                <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#111' }}>
                  <tr style={{ color: ADMIN_COLORS.muted, textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Booking ID</th>
                    <th style={{ padding: '16px' }}>Customer</th>
                    <th style={{ padding: '16px' }}>Phone</th>
                    <th style={{ padding: '16px' }}>Area</th>
                    <th style={{ padding: '16px' }}>Date</th>
                    <th style={{ padding: '16px' }}>Amount</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderTop: `1px solid ${ADMIN_COLORS.border}` }}>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            color      : '#0AFFE6',
                            fontFamily : 'monospace',
                            fontSize   : '13px',
                            fontWeight : '600',
                          }}>
                            {b.bookingNumber}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(b.bookingNumber)
                              toast.success('ID copied!')
                            }}
                            style={{
                              background : 'transparent',
                              border     : 'none',
                              cursor     : 'pointer',
                              color      : '#A0A0A0',
                              fontSize   : '12px',
                              padding    : '2px 6px',
                            }}
                            title="Copy ID"
                          >
                            📋
                          </button>
                        </td>
                      <td style={{ padding: '16px' }}>{b.customerName}</td>
                      <td style={{ padding: '16px' }}>{b.customerPhone}</td>
                      <td style={{ padding: '16px' }}>{b.area}</td>
                      <td style={{ padding: '16px' }}>{new Date(b.scheduledDate).toLocaleDateString()} {b.scheduledTime}</td>
                      <td style={{ padding: '16px' }}>₹{b.totalAmount}</td>
                      <td style={{ padding: '16px' }}>
                        <select 
                          value={b.status} 
                          onChange={(e) => handleStatusUpdate(b.id, e.target.value)}
                          style={{
                            background: 'transparent', color: '#fff', border: `1px solid ${ADMIN_COLORS.border}`,
                            padding: '4px', borderRadius: '4px'
                          }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <a href={`https://wa.me/91${b.customerPhone}`} target="_blank" rel="noreferrer" style={{ color: ADMIN_COLORS.emerald, fontSize: '13px' }}>WhatsApp</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        } />

        {/* CUSTOMERS TAB */}
        <Route path="customers" element={
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Customers</h1>
             <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#111' }}>
                  <tr style={{ color: ADMIN_COLORS.muted, textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Name</th>
                    <th style={{ padding: '16px' }}>Email</th>
                    <th style={{ padding: '16px' }}>Phone</th>
                    <th style={{ padding: '16px' }}>City</th>
                    <th style={{ padding: '16px' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} style={{ borderTop: `1px solid ${ADMIN_COLORS.border}` }}>
                      <td style={{ padding: '16px' }}>{c.fullName}</td>
                      <td style={{ padding: '16px' }}>{c.email}</td>
                      <td style={{ padding: '16px' }}>{c.phone || '-'}</td>
                      <td style={{ padding: '16px' }}>{c.city}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: roleBadgeColor[c.role]?.bg || 'rgba(255,255,255,0.1)',
                            color: roleBadgeColor[c.role]?.text || '#FFF',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}>
                            {c.role}
                          </span>
                          <select
                            value={c.role}
                            onChange={e => handleRoleChange(c.id, e.target.value)}
                            style={{
                              background: '#1A1A1A',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#A0A0A0',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                            <option value="CLEANER">Cleaner</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           </motion.div>
        } />

        {/* FEEDBACK TAB */}
        <Route path="feedback" element={
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Feedback Management</h1>
             
             <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
               <KPI title="Total Reviews" value={feedbacks.length} icon={<Star />} color={ADMIN_COLORS.accent} rgb="10,255,230" />
               <KPI title="Avg Rating" value={(feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (feedbacks.length || 1)).toFixed(1)} icon={<Star />} color={ADMIN_COLORS.emerald} rgb="34,197,94" />
               <KPI title="Pending Approval" value={feedbacks.filter(f => !f.isApproved).length} icon={<Settings />} color={ADMIN_COLORS.amber} rgb="245,158,11" />
               <KPI title="5-Star Reviews" value={feedbacks.filter(f => f.rating === 5).length} icon={<Star />} color={ADMIN_COLORS.purple} rgb="139,92,246" />
             </div>

             <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                 <thead style={{ background: '#111' }}>
                   <tr style={{ color: ADMIN_COLORS.muted, textAlign: 'left' }}>
                     <th style={{ padding: '16px' }}>Name</th>
                     <th style={{ padding: '16px' }}>Area/Service</th>
                     <th style={{ padding: '16px' }}>Rating</th>
                     <th style={{ padding: '16px' }}>Review</th>
                     <th style={{ padding: '16px' }}>Status</th>
                     <th style={{ padding: '16px' }}>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {feedbacks.map(f => (
                     <tr key={f.id} style={{ borderTop: `1px solid ${ADMIN_COLORS.border}` }}>
                       <td style={{ padding: '16px' }}>{f.customerName}</td>
                       <td style={{ padding: '16px' }}>
                         <div>{f.area}</div>
                         <div style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>{f.serviceName}</div>
                       </td>
                       <td style={{ padding: '16px', color: '#FFD700' }}>{'★'.repeat(f.rating)}</td>
                       <td style={{ padding: '16px', maxWidth: '300px' }}>
                         <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                           {f.comment}
                         </p>
                       </td>
                       <td style={{ padding: '16px' }}>
                         <span style={{ 
                           color: f.isApproved ? ADMIN_COLORS.emerald : ADMIN_COLORS.amber,
                           background: f.isApproved ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                           padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                         }}>
                           {f.isApproved ? 'Approved' : 'Pending'}
                         </span>
                         {f.isFeatured && (
                           <span style={{ marginLeft: '4px', color: ADMIN_COLORS.accent, background: 'rgba(10,255,230,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Featured</span>
                         )}
                       </td>
                       <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', gap: '8px' }}>
                           {!f.isApproved && (
                             <button onClick={() => handleFeedbackAction(f.id, 'approve')} style={{ color: ADMIN_COLORS.emerald }}>Approve</button>
                           )}
                           {f.isApproved && !f.isFeatured && (
                             <button onClick={() => handleFeedbackAction(f.id, 'feature')} style={{ color: ADMIN_COLORS.accent }}>Feature</button>
                           )}
                           <button onClick={() => handleFeedbackAction(f.id, 'reject')} style={{ color: ADMIN_COLORS.amber }}>Reject</button>
                           <button onClick={() => handleFeedbackAction(f.id, 'delete')} style={{ color: ADMIN_COLORS.red }}>Delete</button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </motion.div>
        } />

        {/* MESSAGES TAB */}
        <Route path="messages" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Customer Messages</h1>
            <div style={{ display: 'grid', gap: '16px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: ADMIN_COLORS.muted }}>No messages found.</div>
              ) : (
                messages.map((m: any) => (
                  <div key={m.id} style={{ 
                    background: ADMIN_COLORS.card, padding: '20px', borderRadius: '12px', 
                    border: `1px solid ${m.isRead ? ADMIN_COLORS.border : ADMIN_COLORS.accent}` 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>{m.name}</h3>
                        <p style={{ color: ADMIN_COLORS.muted, fontSize: '14px' }}>{m.email} • {m.phone}</p>
                      </div>
                      <span style={{ fontSize: '12px', color: ADMIN_COLORS.muted }}>
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{m.message}</p>
                    {!m.isRead && (
                      <button 
                        onClick={async () => {
                          try {
                            await axiosInstance.patch(`/admin/messages/${m.id}/read`);
                            setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, isRead: true } : msg));
                          } catch (error) {}
                        }}
                        style={{ marginTop: '16px', fontSize: '13px', color: ADMIN_COLORS.accent, fontWeight: 'bold' }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        } />

        {/* PROMOS TAB */}
        <Route path="promos" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Promo Codes</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              <div style={{ background: ADMIN_COLORS.card, padding: '24px', borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, height: 'fit-content' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Create New Promo</h3>
                <form onSubmit={handlePromoCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input name="code" placeholder="Code (e.g. SUMMER20)" required style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff', textTransform: 'uppercase' }} />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select name="discountType" required style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }}>
                      <option value="PERCENT" style={{color: '#000'}}>Percentage (%)</option>
                      <option value="FIXED" style={{color: '#000'}}>Fixed Amount (₹)</option>
                    </select>
                    <input name="discountValue" type="number" placeholder="Value" required style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <input name="minOrder" type="number" placeholder="Min Order Amount (Optional)" style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                  <input name="maxUses" type="number" placeholder="Max Uses (Default 100)" style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                  <button type="submit" style={{ background: ADMIN_COLORS.accent, color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Create Promo</button>
                </form>
              </div>

              <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#111' }}>
                  <tr style={{ color: ADMIN_COLORS.muted, textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Code</th>
                    <th style={{ padding: '16px' }}>Discount</th>
                    <th style={{ padding: '16px' }}>Min Order</th>
                    <th style={{ padding: '16px' }}>Uses</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map(p => (
                    <tr key={p.id} style={{ borderTop: `1px solid ${ADMIN_COLORS.border}`, opacity: p.isActive ? 1 : 0.5 }}>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: ADMIN_COLORS.accent }}>{p.code}</td>
                      <td style={{ padding: '16px' }}>{p.discountType === 'PERCENT' ? `${p.discountValue}%` : `₹${p.discountValue}`}</td>
                      <td style={{ padding: '16px' }}>₹{p.minOrder}</td>
                      <td style={{ padding: '16px' }}>{p.usedCount} / {p.maxUses}</td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => handlePromoToggle(p.id, p.isActive)} style={{ padding: '4px 12px', background: p.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.1)', color: p.isActive ? ADMIN_COLORS.emerald : '#fff', borderRadius: '4px', fontSize: '12px' }}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => handlePromoDelete(p.id)} style={{ color: ADMIN_COLORS.red }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {promos.length === 0 && <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: ADMIN_COLORS.muted }}>No promos created yet.</td></tr>}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        } />

        {/* SERVICES TAB */}
        <Route path="services" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Services Management</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              <div style={{ background: ADMIN_COLORS.card, padding: '24px', borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, height: 'fit-content' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Add New Service/Combo</h3>
                <form onSubmit={handleServiceCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input name="name" placeholder="Service Name (e.g. Minimal Magic)" required style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                  <textarea name="description" placeholder="Description & featured details..." style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff', minHeight: '80px' }} />
                  <select name="category" required style={{ padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }}>
                    <option value="INDIVIDUAL" style={{color: '#000'}}>Individual</option>
                    <option value="COMBO" style={{color: '#000'}}>Combo</option>
                  </select>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input name="price" type="number" placeholder="Price (₹)" required style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                    <input name="unit" placeholder="Unit (e.g. per session)" style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <button type="submit" style={{ background: ADMIN_COLORS.accent, color: '#000', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>Add Service</button>
                </form>
              </div>

              <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead style={{ background: '#111' }}>
                  <tr style={{ color: ADMIN_COLORS.muted, textAlign: 'left' }}>
                    <th style={{ padding: '16px' }}>Name</th>
                    <th style={{ padding: '16px' }}>Details Map</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Price & Unit</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} style={{ borderTop: `1px solid ${ADMIN_COLORS.border}`, opacity: s.isActive ? 1 : 0.5 }}>
                      <td style={{ padding: '16px', fontWeight: 'bold' }}>{s.name}</td>
                      <td style={{ padding: '16px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: ADMIN_COLORS.muted }} title={s.description || 'No descriptions added'}>{s.description || '-'}</td>
                      <td style={{ padding: '16px' }}>{s.category}</td>
                      <td style={{ padding: '16px' }}>₹{s.price} {s.unit ? <span style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>/{s.unit}</span> : ''}</td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => handleServiceToggle(s.id, s.isActive)} style={{ padding: '4px 12px', background: s.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.1)', color: s.isActive ? ADMIN_COLORS.emerald : '#fff', borderRadius: '4px', fontSize: '12px' }}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => handleServiceDelete(s.id)} style={{ color: ADMIN_COLORS.red }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: ADMIN_COLORS.muted }}>No services found.</td></tr>}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        } />

        {/* SETTINGS TAB */}
        <Route path="settings" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Platform Settings</h1>
            <div style={{ background: ADMIN_COLORS.card, borderRadius: '16px', border: `1px solid ${ADMIN_COLORS.border}`, padding: '24px', maxWidth: '600px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: ADMIN_COLORS.muted }}>Admin Email</label>
                <input type="text" disabled value={adminUser?.email || ''} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: ADMIN_COLORS.muted }}>Change Password</label>
                <input type="password" placeholder="New Password" style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px', color: '#fff' }} />
              </div>
              <button style={{ background: ADMIN_COLORS.accent, color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold' }}>Save Changes</button>
            </div>
          </motion.div>
        } />

        {/* REVENUE TAB */}
        <Route path="revenue" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Revenue Analytics</h1>
            {stats ? (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '24px', background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>Total All-Time Revenue</p>
                    <p style={{ fontSize: '32px', color: ADMIN_COLORS.emerald, fontWeight: 'bold', marginTop: '4px' }}>₹{stats.global.totalRevenue}</p>
                  </div>
                  <div style={{ flex: 1, borderLeft: `1px solid ${ADMIN_COLORS.border}`, textAlign: 'center' }}>
                    <p style={{ color: ADMIN_COLORS.muted, fontSize: '12px' }}>Today's Revenue</p>
                    <p style={{ fontSize: '32px', color: ADMIN_COLORS.accent, fontWeight: 'bold', marginTop: '4px' }}>₹{stats.cards.todayRevenue.value}</p>
                  </div>
                </div>

                <div style={{ background: ADMIN_COLORS.card, border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '16px', padding: '24px', height: '400px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: ADMIN_COLORS.muted }}>Detailed View — Last 7 Days</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke={ADMIN_COLORS.muted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke={ADMIN_COLORS.muted} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ background: '#000', border: `1px solid ${ADMIN_COLORS.border}`, borderRadius: '8px' }}
                      />
                      <Bar dataKey="revenue" fill={ADMIN_COLORS.emerald} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><Loader2 className="animate-spin" color={ADMIN_COLORS.emerald} /></div>
            )}
          </motion.div>
        } />

        {/* MORE TABS */}
        <Route path=":tab" element={
          <div style={{ textAlign: 'center', marginTop: '100px', color: ADMIN_COLORS.muted }}>
            <Sparkles size={48} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
            <p>UI implemented. Connect remaining endpoints.</p>
          </div>
        } />
      </Routes>
      )}

      </div>
    </div>
  );
}

const KPI = ({ title, value, subtext, icon, color, rgb }: any) => (
  <div style={{
    background: ADMIN_COLORS.card,
    border: `1px solid ${ADMIN_COLORS.border}`,
    borderRadius: '16px',
    padding: '24px',
    flex: 1,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <p style={{ color: ADMIN_COLORS.muted, fontSize: '13px' }}>{title}</p>
        <p style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{value}</p>
        <p style={{ color, fontSize: '12px', marginTop: '4px' }}>{subtext}</p>
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        background: `rgba(${rgb},0.15)`,
        color: color,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
    </div>
  </div>
);