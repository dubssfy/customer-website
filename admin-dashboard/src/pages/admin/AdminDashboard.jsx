import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  RefreshCw, FileText, ShoppingBag, CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign, Calendar,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import StatsCard from '../../components/StatsCard.jsx';
import { adminApi } from '../../api/adminApi.js';
import { useToast } from '../../hooks/useToast.jsx';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers.js';

const FILTER_TABS = [
  { key: 'today',   label: 'Today' },
  { key: 'weekly',  label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly' },
  { key: 'custom',  label: 'Custom Date' },
];

const AdminDashboard = () => {
  const [tab, setTab] = useState('today');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 });
  const { addToast, ToastContainer } = useToast();

  const [filterDate, setFilterDate] = useState(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (tab) {
        case 'today':
          res = await adminApi.getTodayBookings();
          break;
        case 'weekly':
          res = await adminApi.getWeeklyBookings();
          break;
        case 'monthly':
          res = await adminApi.getMonthlyBookings();
          break;
        case 'yearly':
          res = await adminApi.getYearlyBookings();
          break;
        case 'custom':
          res = await adminApi.getBookingsByDate({ date: filterDate });
          break;
        default:
          res = await adminApi.getTodayBookings();
      }

      if (res.data?.success) {
        setData(res.data.data || []);
        setStats(res.data.stats || { total: 0, pending: 0, accepted: 0, completed: 0, cancelled: 0 });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to fetch bookings data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, filterDate]);

  const exportToCSV = () => {
    if (data.length === 0) {
      addToast('No bookings available to export.', 'warning');
      return;
    }
    const headers = ['Booking ID', 'Customer Name', 'Email', 'Mobile', 'Order Type', 'City', 'Service', 'Address', 'Status', 'Booking Date'];
    const rows = data.map(b => [
      b.booking_id,
      b.customer_name,
      b.email,
      b.mobile,
      b.order_type,
      b.city,
      b.service,
      `"${b.address?.replace(/"/g, '""')}"`,
      b.status,
      formatDate(b.created_at),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `swaccham_bookings_${tab}_${filterDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Bookings exported to CSV successfully.', 'success');
  };

  const revenue = stats.completed * 500;

  const pieData = [
    { name: 'Pending',   value: stats.pending,   color: '#F59E0B' },
    { name: 'Accepted',  value: stats.accepted,   color: '#3B82F6' },
    { name: 'Completed', value: stats.completed,  color: '#10B981' },
    { name: 'Cancelled', value: stats.cancelled,  color: '#EF4444' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Pending',   count: stats.pending,   fill: '#F59E0B' },
    { name: 'Accepted',  count: stats.accepted,   fill: '#3B82F6' },
    { name: 'Completed', count: stats.completed,  fill: '#10B981' },
    { name: 'Cancelled', count: stats.cancelled,  fill: '#EF4444' },
  ];

  const tabLabel = FILTER_TABS.find(t => t.key === tab)?.label || 'Today';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <Navbar title="Dashboard" />
        <ToastContainer />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-8">
          {/* Filter Tabs + Actions Row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm"
          >
            {/* Period filter tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100/80 rounded-xl">
              {FILTER_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    tab === key
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Custom date picker */}
              {tab === 'custom' && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 shadow-inner"
                  />
                </div>
              )}

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" /> Export CSV
              </button>

              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2.5 border border-slate-200 bg-white shadow-sm rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </motion.div>

          {/* Period label */}
          <p className="text-sm font-bold text-slate-400 -mt-4 ml-1">
            Showing: <span className="text-blue-600">{tabLabel}</span>
            {tab === 'custom' && <span className="text-slate-500"> — {filterDate}</span>}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            <StatsCard title="Total Orders"  value={stats.total}     icon={ShoppingBag}  color="purple" delay={0}    />
            <StatsCard title="Pending"       value={stats.pending}   icon={Clock}        color="yellow" delay={0.05} />
            <StatsCard title="Accepted"      value={stats.accepted}  icon={TrendingUp}   color="blue"   delay={0.1}  />
            <StatsCard title="Completed"     value={stats.completed} icon={CheckCircle}  color="green"  delay={0.15} />
            <StatsCard title="Cancelled"     value={stats.cancelled} icon={AlertCircle}  color="red"    delay={0.2}  />
            <StatsCard title="Est. Revenue"  value={revenue} prefix="₹" icon={DollarSign} color="blue" delay={0.25} subtitle="Based on completed" />
          </div>

          {/* Charts Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Pie Chart */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 lg:col-span-1 flex flex-col">
              <h3 className="font-black text-slate-800 mb-6 text-lg tracking-tight">Status Distribution</h3>
              <div className="flex-1 min-h-[280px] flex items-center justify-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={70} outerRadius={95}
                        paddingAngle={5} dataKey="value"
                        stroke="none" cornerRadius={6}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} Orders`, 'Count']}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No data for {tabLabel}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 lg:col-span-2 flex flex-col">
              <h3 className="font-black text-slate-800 mb-6 text-lg tracking-tight">Volume Overview — {tabLabel}</h3>
              <div className="flex-1 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
                      {barData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 overflow-hidden shadow-xl shadow-slate-200/20"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FileText className="w-4 h-4" />
                </div>
                {tabLabel} Bookings
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{data.length}</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/95 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Service</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n} className="animate-pulse">
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                        <td className="py-5 px-6">
                          <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-24" />
                        </td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                        <td className="py-5 px-6"><div className="h-6 bg-slate-200 rounded-full w-20 mx-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-20 ml-auto" /></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400">
                        <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <span className="font-medium">No bookings found for {tabLabel}.</span>
                      </td>
                    </tr>
                  ) : (
                    data.map((b) => {
                      const color = getStatusColor(b.status);
                      return (
                        <tr key={b.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                            #{b.booking_id?.substring(0, 6)}
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-800">{b.customer_name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{b.mobile}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-slate-200/50">
                              {b.order_type}
                            </span>
                            <p className="text-xs text-slate-600 mt-1.5 font-bold">{b.service}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-700">{b.city}</p>
                            <p className="text-[11px] font-medium text-slate-400 truncate max-w-[200px]" title={b.address}>{b.address}</p>
                            {b.map_link && (
                              <a href={b.map_link.startsWith('http') ? b.map_link : `https://${b.map_link}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:underline mt-1 block font-bold">
                                View Map
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${color.bg} ${color.text} border ${color.bg.replace('bg-', 'border-').replace('100', '200')}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-slate-500 text-xs font-bold">
                            {formatDate(b.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
