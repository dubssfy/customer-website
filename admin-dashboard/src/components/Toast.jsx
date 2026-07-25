import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: { Icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
  error:   { Icon: XCircle,     color: 'text-red-500',   bg: 'bg-red-50 border-red-200' },
  warning: { Icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  info:    { Icon: Info,        color: 'text-blue-500',  bg: 'bg-blue-50 border-blue-200' },
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { Icon, color, bg } = icons[toast.type] || icons.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bg} backdrop-blur-sm`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${color}`} />
              <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
