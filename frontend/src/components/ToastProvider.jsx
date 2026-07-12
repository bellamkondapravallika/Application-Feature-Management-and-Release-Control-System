import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : toast.type === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
