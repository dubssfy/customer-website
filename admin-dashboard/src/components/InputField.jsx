import React from 'react';

const InputField = ({ 
  name, 
  label, 
  type = 'text', 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  error, 
  showToggle, 
  toggleState, 
  onToggle, 
  children 
}) => {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type={showToggle ? (toggleState ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-12 ${showToggle ? 'pr-12' : 'pr-4'} py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all shadow-sm ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'}`}
        />
        {showToggle && (
          <button 
            type="button" 
            onClick={onToggle} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
          >
            {toggleState ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49M14.084 14.158a3 3 0 0 1-4.242-4.242M17.373 17.373a10.73 10.73 0 0 1-5.373 1.703c-5.965 0-10.74-5.26-11.205-6.575a1 1 0 0 1 0-.696 10.745 10.745 0 0 1 3.513-4.5M2 2l20 20"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  );
};

export default InputField;
