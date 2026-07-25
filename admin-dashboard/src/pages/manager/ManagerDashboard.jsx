import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, Search, Phone, Mail, MapPin, Check, X as CloseIcon, CheckCircle2, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import { managerApi } from '../../api/managerApi.js';
import { useToast } from '../../hooks/useToast.jsx';
import { formatDate, getStatusColor } from '../../utils/helpers.js';

const ManagerDashboard = () => {
  const [tab, setTab] = useState('today'); // 'today' | 'previous'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  // Search, Pagination & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const { addToast, ToastContainer } = useToast();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let res;
      const params = {
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        city: cityFilter || undefined,
        service: serviceFilter || undefined,
      };

      if (tab === 'today') {
        res = await managerApi.getTodayBookings(params);
      } else {
        res = await managerApi.getBookingsByDate({
          ...params,
          date: filterDate,
          page,
          limit: 10,
        });
      }

      if (res.data?.success) {
        setData(res.data.data || []);
        if (tab === 'previous' && res.data.pagination) {
          setTotalPages(res.data.pagination.pages || 1);
        } else {
          setTotalPages(1);
        }
      }
    } catch (err) {
      addToast('Failed to fetch bookings list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [tab, page, filterDate, statusFilter, cityFilter, serviceFilter]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchBookings();
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle status update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await managerApi.updateBookingStatus(id, newStatus);
      if (res.data?.success) {
        addToast(`Booking status updated to ${newStatus} successfully!`, 'success');
        setData(prev => prev.map(b => b.id === id ? { ...b, status: res.data.data.status } : b));
      }
    } catch (err) {
      addToast('Failed to update booking status.', 'error');
    }
  };

  const ActionButtons = ({ booking }) => {
    const status = booking.status?.toLowerCase();
    if (status === 'pending') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateStatus(booking.id, 'accepted')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <Check className="w-3.5 h-3.5" /> Accept
          </button>
          <button
            onClick={() => handleUpdateStatus(booking.id, 'rejected')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <CloseIcon className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      );
    }
    if (status === 'accepted') {
      return (
        <button
          onClick={() => handleUpdateStatus(booking.id, 'completed')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Complete
        </button>
      );
    }
    return <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">No actions</span>;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <Navbar title="Manager Bookings Panel" />
        <ToastContainer />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm"
          >
            <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl self-start">
              <button
                onClick={() => { setTab('today'); setPage(1); }}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'today' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Today's Requests
              </button>
              <button
                onClick={() => { setTab('previous'); setPage(1); }}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${tab === 'previous' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Previous Requests
              </button>
            </div>

            {/* Datepicker / Refresh */}
            <div className="flex items-center gap-4">
              {tab === 'previous' && (
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
                  className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700 shadow-inner"
                />
              )}
              <button
                onClick={fetchBookings}
                className="p-3 border border-slate-200 bg-white shadow-sm rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </motion.div>

          {/* Search and Filters grid */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-slate-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700 appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            {/* City Filter */}
            <input
              type="text"
              placeholder="Filter by city (e.g., Delhi)"
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-slate-400"
            />

            {/* Service Filter */}
            <input
              type="text"
              placeholder="Filter by service name"
              value={serviceFilter}
              onChange={(e) => { setServiceFilter(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder-slate-400"
            />
          </motion.div>

          {/* Bookings Display (Table) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 overflow-hidden shadow-xl shadow-slate-200/20"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-5 px-6">Customer & Booking info</th>
                    <th className="py-5 px-6">Service Category</th>
                    <th className="py-5 px-6">Service Name</th>
                    <th className="py-5 px-6">Address</th>
                    <th className="py-5 px-6">Booking ID</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {loading ? (
                    [1, 2, 3].map((n) => (
                      <tr key={n} className="animate-pulse">
                        <td className="py-6 px-6">
                          <div className="h-4 bg-slate-200 rounded w-40 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-32 mb-1" />
                        </td>
                        <td className="py-6 px-6"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                        <td className="py-6 px-6"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                        <td className="py-6 px-6">
                          <div className="h-4 bg-slate-200 rounded w-36 mb-1" />
                          <div className="h-3 bg-slate-200 rounded w-24" />
                        </td>
                        <td className="py-6 px-6"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                        <td className="py-6 px-6"><div className="h-6 bg-slate-200 rounded-full w-20" /></td>
                        <td className="py-6 px-6"><div className="h-8 bg-slate-200 rounded w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-20 text-slate-400">
                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <span className="font-bold text-lg">No bookings found.</span>
                      </td>
                    </tr>
                  ) : (
                    data.map((b) => {
                      const color = getStatusColor(b.status);
                      return (
                        <tr key={b.id} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                {b.customer_name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{b.customer_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1"><Phone className="w-3 h-3" />{b.mobile}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black uppercase tracking-wider border border-blue-100 shadow-sm">
                              {b.order_type}
                            </span>
                          </td>
                          <td className="py-5 px-6 font-bold text-slate-700">
                            {b.service}
                          </td>
                          <td className="py-5 px-6">
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-rose-500" /> {b.city}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px] font-medium" title={b.address}>{b.address}</p>
                            {b.map_link && (
                              <a href={b.map_link.startsWith('http') ? b.map_link : `https://${b.map_link}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline mt-1 block font-bold flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> View on Map
                              </a>
                            )}
                          </td>
                          <td className="py-5 px-6 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                            #{b.booking_id?.substring(0, 8)}
                          </td>
                          <td className="py-5 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${color.bg} ${color.text} border ${color.bg.replace('bg-', 'border-').replace('100', '200')}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                              {b.status}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex justify-end">
                              <ActionButtons booking={b} />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Previous Tab */}
            {tab === 'previous' && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-500">
                  Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent shadow-sm bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent shadow-sm bg-slate-50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
