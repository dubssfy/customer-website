import api from './axiosInstance.js';

export const adminApi = {
  // Booking filters
  getTodayBookings: () => api.get('/admin/bookings/today'),
  getWeeklyBookings: () => api.get('/admin/bookings/weekly'),
  getMonthlyBookings: () => api.get('/admin/bookings/monthly'),
  getYearlyBookings: () => api.get('/admin/bookings/yearly'),
  getBookingsByDate: (params) => api.get('/admin/bookings/date', { params }),

  // Price management
  getPrices: () => api.get('/admin/prices'),
  addPrice: (data) => api.post('/admin/prices', data),
  updatePrice: (id, data) => api.put(`/admin/prices/${id}`, data),
  deletePrice: (id) => api.delete(`/admin/prices/${id}`),
};
