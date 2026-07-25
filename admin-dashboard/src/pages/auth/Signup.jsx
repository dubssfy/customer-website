import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { authApi } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { validators } from '../../utils/helpers.js';
import InputField from '../../components/InputField.jsx';
import logo from '../../assets/logo.png';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', ok: password.length >= 6 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains uppercase', ok: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-green-500'];

  return password ? (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score - 1] : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="space-y-0.5">
        {checks.map((c, i) => (
          <p key={i} className={`text-xs flex items-center gap-1.5 font-medium ${c.ok ? 'text-green-600' : 'text-slate-400'}`}>
            <span>{c.ok ? '✓' : '○'}</span> {c.label}
          </p>
        ))}
      </div>
    </div>
  ) : null;
};

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    errs.full_name = validators.required(form.full_name, 'Full name');
    errs.email = validators.email(form.email);
    errs.phone = validators.phone(form.phone);
    errs.password = validators.password(form.password);
    errs.confirm_password = validators.confirmPassword(form.password, form.confirm_password);
    const filtered = Object.fromEntries(Object.entries(errs).filter(([, v]) => v));
    setFieldErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.signup({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      const { token, user } = res.data;
      login(token, user);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-slate-50 -z-10" />

      <div className="w-full max-w-[440px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-900/10 p-2">
            <img src={logo} alt="Swaccham Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-md">Create Account</h1>
          <p className="text-blue-100 mt-2 font-medium">Join Swaccham Admin Panel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/50 p-8"
        >
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 font-medium shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField name="full_name" label="Full Name" icon={User} placeholder="Soham Doe" value={form.full_name} onChange={handleChange} error={fieldErrors.full_name} />
            <InputField name="email" label="Email Address" type="email" icon={Mail} placeholder="admin@swaccham.co.in" value={form.email} onChange={handleChange} error={fieldErrors.email} />
            <InputField name="phone" label="Phone Number" icon={Phone} placeholder="9876543210" value={form.phone} onChange={handleChange} error={fieldErrors.phone} />
            
            <div>
              <InputField name="password" label="Password" icon={Lock} placeholder="••••••••" value={form.password} onChange={handleChange} error={fieldErrors.password} showToggle toggleState={showPass} onToggle={() => setShowPass(!showPass)} />
              <PasswordStrength password={form.password} />
            </div>

            <InputField name="confirm_password" label="Confirm Password" icon={Lock} placeholder="••••••••" value={form.confirm_password} onChange={handleChange} error={fieldErrors.confirm_password} showToggle toggleState={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />

           

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:hover:scale-100 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline underline-offset-4 transition-all">Sign in here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
