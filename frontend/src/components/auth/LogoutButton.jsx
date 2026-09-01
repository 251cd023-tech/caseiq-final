import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const LogoutButton = ({ className = '', showLabel = true }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out of CaseIQ"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 transition-colors cursor-pointer ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      {showLabel && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
