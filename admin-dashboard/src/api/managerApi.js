import api from './axiosInstance.js';

export const managerApi = {
  getTodayBookings: (params) => api.get('/manager/bookings/today', { params }),
  getBookingsByDate: (params) => api.get('/manager/bookings/date', { params }),
  updateBookingStatus: (id, status) => api.put(`/manager/bookings/${id}/status`, { status }),
};
