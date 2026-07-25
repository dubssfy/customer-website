import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Custom hook for animated counter
const useCounter = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const StatsCard = ({ title, value, icon: Icon, color, delay = 0, subtitle, prefix = '' }) => {
  const controls = useAnimation();
  const animatedValue = useCounter(value || 0, 1500);

  const colorMap = {
    blue:   { bg: 'from-blue-500/10 to-blue-600/5', iconBg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-100/50' },
    green:  { bg: 'from-emerald-500/10 to-emerald-600/5', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', border: 'border-emerald-100/50' },
    yellow: { bg: 'from-amber-500/10 to-amber-600/5', iconBg: 'bg-amber-100', icon: 'text-amber-600', border: 'border-amber-100/50' },
    red:    { bg: 'from-rose-500/10 to-rose-600/5', iconBg: 'bg-rose-100', icon: 'text-rose-600', border: 'border-rose-100/50' },
    purple: { bg: 'from-indigo-500/10 to-indigo-600/5', iconBg: 'bg-indigo-100', icon: 'text-indigo-600', border: 'border-indigo-100/50' },
  };

  const c = colorMap[color] || colorMap.blue;

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 border ${c.border} shadow-lg shadow-slate-200/40`}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-50`} />
      
      <div className="relative flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {prefix}{animatedValue.toLocaleString()}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${c.iconBg}`} />
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.iconBg} shadow-inner`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
