import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Search, X, Loader2, Tag, Check, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { adminApi } from '../../api/adminApi.js';
import { useToast } from '../../hooks/useToast.jsx';
import { formatCurrency } from '../../utils/helpers.js';

const TYPE_OPTIONS = [
  'Dry Cleaning',
  'Wash & Fold',
  'Premium Wash',
  'Steam Iron'
  
];

const TYPE_OPTIONS1 = [
  
  'Hotel Linen',
  'Guest Lundry',
  'Hosehold',
  'Women Wear',
  'Men Wear',
  'Toy Cleaning'
];


const PAGE_SIZE = 5;

const PriceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    category: '',
    service_name: '',
    original_price: '',
    discount_price: '',
    type: '',
    display_order: '0',
    is_highlight: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const { addToast, ToastContainer } = useToast();

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPrices();
      if (res.data?.success) {
        setPrices(res.data.data || []);
      }
    } catch (err) {
      addToast('Failed to fetch pricing items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(prices.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [prices]);

  // Unique types for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(prices.map(p => p.type).filter(Boolean))];
    return types.sort();
  }, [prices]);

  // Real-time filtering
  const filteredPrices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return prices.filter(p => {
      const matchSearch = !term || (
        (p.service_name && p.service_name.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.type && p.type.toLowerCase().includes(term))
      );
      const matchType = !typeFilter || p.type === typeFilter;
      const matchCategory = !categoryFilter || p.category === categoryFilter;
      return matchSearch && matchType && matchCategory;
    });
  }, [prices, searchTerm, typeFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPrices.length / PAGE_SIZE));
  const paginatedPrices = filteredPrices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, categoryFilter]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setForm({ category: '', service_name: '', original_price: '', discount_price: '', type: '', display_order: '0', is_highlight: false });
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setForm({
      category: item.category || '',
      service_name: item.service_name || '',
      original_price: item.original_price || '',
      discount_price: item.discount_price || '',
      type: item.type || '',
      display_order: item.display_order?.toString() || '0',
      is_highlight: !!item.is_highlight,
    });
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.service_name.trim()) errs.service_name = 'Service name is required';
    if (!form.type.trim()) errs.type = 'Type is required';
    if (!form.original_price) errs.original_price = 'Original price is required';
    if (isNaN(parseFloat(form.original_price)) || parseFloat(form.original_price) <= 0) errs.original_price = 'Valid price required';
    if (!form.discount_price) errs.discount_price = 'Discount price is required';
    if (isNaN(parseFloat(form.discount_price)) || parseFloat(form.discount_price) < 0) errs.discount_price = 'Valid discount required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        original_price: parseFloat(form.original_price),
        discount_price: parseFloat(form.discount_price),
        display_order: parseInt(form.display_order) || 0,
      };

      if (selectedItem) {
        const res = await adminApi.updatePrice(selectedItem.id, payload);
        if (res.data?.success) addToast('Price item updated successfully!', 'success');
      } else {
        const res = await adminApi.addPrice(payload);
        if (res.data?.success) addToast('Price item created successfully!', 'success');
      }
      setIsAddEditOpen(false);
      fetchPrices();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save price item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      const res = await adminApi.deletePrice(selectedItem.id);
      if (res.data?.success) {
        addToast('Price item deleted successfully.', 'success');
        setIsDeleteOpen(false);
        fetchPrices();
      }
    } catch (err) {
      addToast('Failed to delete price item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-visible font-sans" position="sticky">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <Navbar title="Price Management" />
        <ToastContainer />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6" >
          {/* Search + Filters + Add Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="price-search"
                  placeholder="Search by item name, category, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={handleOpenAdd}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" /> Add Price Item
              </button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="w-4 h-4 text-slate-400" />

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Clear filters */}
              {(typeFilter || categoryFilter || searchTerm) && (
                <button
                  onClick={() => { setTypeFilter(''); setCategoryFilter(''); setSearchTerm(''); }}
                  className="px-3 py-2 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
                >
                  Clear Filters
                </button>
              )}

              <span className="text-sm text-slate-400 font-medium ml-auto">
                {filteredPrices.length} of {prices.length} items
              </span>
            </div>
          </motion.div>

          {/* Pricing Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 overflow-hidden shadow-xl shadow-slate-200/20"
          >
           <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/95 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Service Name</th>
                    <th className="py-4 px-6 text-center">Type</th>
                    <th className="py-4 px-6 text-right">Original Price</th>
                    <th className="py-4 px-6 text-right">Discount Price</th>
                    <th className="py-4 px-6 text-center">Order</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {loading && prices.length === 0 ? (
                    [1, 2, 3, 4, 5].map((n) => (
                      <tr key={n} className="animate-pulse">
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-40" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-20 mx-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-8 mx-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedPrices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400">
                        <Tag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <span className="font-medium">No pricing items found.</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedPrices.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100/50 shadow-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            {item.service_name}
                            {item.is_highlight && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded shadow-sm border border-amber-200/50">
                                ⭐ HIGHLIGHT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-600 text-right">
                          <span className={item.discount_price && parseFloat(item.discount_price) < parseFloat(item.original_price) ? 'line-through text-slate-400 text-xs' : ''}>
                            {formatCurrency(item.original_price)}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-blue-600 text-right text-base">
                          {formatCurrency(item.discount_price)}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-bold text-center">
                          {item.display_order}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(item)}
                              className="p-2 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPrices.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-500">
                  Showing <span className="font-bold text-slate-800">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredPrices.length)}</span> of <span className="font-bold text-slate-800">{filteredPrices.length}</span> items
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 shadow-sm bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                        if (i === 6) page = totalPages;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                        if (i === 0) page = 1;
                      } else {
                        const map = [1, null, currentPage - 1, currentPage, currentPage + 1, null, totalPages];
                        page = map[i];
                      }
                      if (page === null) return <span key={i} className="px-2 py-1 text-slate-400 text-sm">…</span>;
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-slate-600 hover:bg-white hover:text-blue-600 bg-slate-50 border border-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 shadow-sm bg-slate-50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isAddEditOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => setIsAddEditOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh] border border-slate-100"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <Tag className="w-5 h-5" />
                    </div>
                    {selectedItem ? 'Edit Pricing Item' : 'Add New Pricing Item'}
                  </h3>
                  <button onClick={() => setIsAddEditOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Items *</label>
                      <input
                        type="text"
                        placeholder="e.g., Shirts,Face Towels "
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.category ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      />
                      {formErrors.category && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.category}</p>}
                    </div>

                    {/* Service Name 
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Service Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Hotel Linen, Guest Laundry"
                        value={form.service_name}
                        onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.service_name ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      />
                      {formErrors.service_name && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.service_name}</p>}
                    </div>*/}
                    <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Services * <span className="text-slate-400 font-normal text-xs">(service category type)</span></label>
                    <div className="flex gap-2">
                      <select
                        value={TYPE_OPTIONS1.includes(form.service_name) ? form.service_name : '__custom__'}
                        onChange={(e) => {
                          if (e.target.value !== '__custom__') setForm({ ...form, service_name: e.target.value });
                          else setForm({ ...form, service_name: '' });
                        }}
                        className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.type ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      >
                        <option value="">Select Type</option>
                        {TYPE_OPTIONS1.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                        <option value="__custom__">Custom...</option>
                      </select>
                      {(!TYPE_OPTIONS1.includes(form.type) || form.type === '') && (
                        <input
                          type="text"
                          placeholder="Custom type"
                          value={form.service_name}
                          onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                          className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.type ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                        />
                      )}
                    </div>
                    {formErrors.type && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.type}</p>}
                  </div>
                  </div>
                  

                  {/* Type — dropdown with predefined options + custom */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Type * <span className="text-slate-400 font-normal text-xs">(service category type)</span></label>
                    <div className="flex gap-2">
                      <select
                        value={TYPE_OPTIONS.includes(form.type) ? form.type : '__custom__'}
                        onChange={(e) => {
                          if (e.target.value !== '__custom__') setForm({ ...form, type: e.target.value });
                          else setForm({ ...form, type: '' });
                        }}
                        className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.type ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      >
                        <option value="">Select Type</option>
                        {TYPE_OPTIONS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                        <option value="__custom__">Custom...</option>
                      </select>
                      {(!TYPE_OPTIONS.includes(form.type) || form.type === '') && (
                        <input
                          type="text"
                          placeholder="Custom type"
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                          className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.type ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                        />
                      )}
                    </div>
                    {formErrors.type && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.type}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Original Price */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Original Price (₹) *</label>
                      <input
                        type="number" placeholder="199" step="0.01"
                        value={form.original_price}
                        onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.original_price ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      />
                      {formErrors.original_price && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.original_price}</p>}
                    </div>

                    {/* Discount Price */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Discount Price (₹) *</label>
                      <input
                        type="number" placeholder="149" step="0.01"
                        value={form.discount_price}
                        onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all ${formErrors.discount_price ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
                      />
                      {formErrors.discount_price && <p className="text-red-500 text-xs mt-1.5 font-medium">{formErrors.discount_price}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                    {/* Display Order */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Display Order</label>
                      <input
                        type="number"
                        value={form.display_order}
                        onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                      />
                    </div>
                    {/* Highlight checkbox */}
                    <div className="pb-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${form.is_highlight ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                          {form.is_highlight && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={form.is_highlight}
                          onChange={(e) => setForm({ ...form, is_highlight: e.target.checked })}
                          className="hidden"
                        />
                        <span className="text-sm font-bold text-slate-700">Highlight this service</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddEditOpen(false)}
                      className="px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                      {selectedItem ? 'Update Item' : 'Create Item'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Pricing Item"
        message={`Are you sure you want to delete "${selectedItem?.service_name}"? This action cannot be undone.`}
        confirmText="Delete Item"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};

export default PriceManagement;
