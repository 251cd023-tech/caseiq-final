import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAuth();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderStyle = 'border-blue-500/40 text-blue-300 bg-slate-900/95';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderStyle = 'border-emerald-500/50 text-emerald-300 bg-slate-900/95';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderStyle = 'border-rose-500/50 text-rose-300 bg-slate-900/95';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderStyle = 'border-amber-500/50 text-amber-300 bg-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borderStyle}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium text-slate-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
