export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? null : 'Please enter a valid email address.';
  },
  password: (password) => {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  },
  confirmPassword: (password, confirm) => {
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  },
  phone: (phone) => {
    if (!/^\d{10}$/.test(phone)) return 'Enter a valid 10-digit phone number.';
    return null;
  },
  required: (value, fieldName = 'This field') => {
    if (!value || !String(value).trim()) return `${fieldName} is required.`;
    return null;
  },
  otp: (otp) => {
    if (!/^\d{6}$/.test(otp)) return 'OTP must be a 6-digit number.';
    return null;
  },
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' };
    case 'accepted': return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-400' };
    case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-400' };
    case 'cancelled':
    case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-400' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' };
  }
};
