import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { authApi } from '../../api/authApi.js';
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

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [form, setForm] = useState({ password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirm_password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600 to-slate-50 -z-10" />

      <div className="w-full max-w-[440px]">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-900/10 p-2">
            <img src={logo} alt="Swaccham Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-md">New Password</h1>
          <p className="text-blue-100 mt-2 font-medium">Create a strong, secure password</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 border border-white/50 p-8"
        >
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Password Reset!</h3>
              <p className="text-slate-500 mb-6">Your password has been successfully changed.</p>
              <p className="text-sm font-medium text-slate-400">Redirecting to login...</p>
            </motion.div>
          ) : (
            <>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 font-medium shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <InputField 
                    name="password" 
                    label="New Password" 
                    icon={Lock} 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={handleChange} 
                    showToggle 
                    toggleState={showPass} 
                    onToggle={() => setShowPass(!showPass)} 
                  />
                  <PasswordStrength password={form.password} />
                </div>

                <InputField 
                  name="confirm_password" 
                  label="Confirm New Password" 
                  icon={Lock} 
                  placeholder="••••••••" 
                  value={form.confirm_password} 
                  onChange={handleChange} 
                  showToggle 
                  toggleState={showConfirm} 
                  onToggle={() => setShowConfirm(!showConfirm)} 
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:hover:scale-100 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Password'}
                </motion.button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link to="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
