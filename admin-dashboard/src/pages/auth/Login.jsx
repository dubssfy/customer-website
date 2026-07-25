import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { authApi } from '../../api/authApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import InputField from '../../components/InputField.jsx';
import logo from '../../assets/logo.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, user } = res.data;
      login(token, user);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/10 p-2">
            <img src={logo} alt="Swaccham Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-md">Welcome Back</h1>
          <p className="text-blue-100 mt-2 font-medium">Sign in to Admin Dashboard</p>
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
            <InputField 
              name="email" 
              label="Email Address" 
              type="email" 
              icon={Mail} 
              placeholder="admin@swaccham.co.in" 
              value={form.email} 
              onChange={handleChange} 
            />

            <InputField 
              name="password" 
              label="Password" 
              icon={Lock} 
              placeholder="••••••••" 
              value={form.password} 
              onChange={handleChange} 
              showToggle 
              toggleState={showPass} 
              onToggle={() => setShowPass(!showPass)} 
            />

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4 transition-all">
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:hover:scale-100 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 hover:underline underline-offset-4 transition-all">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
