import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogOut, LayoutDashboard, MessageSquare, Shield, UserCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const { role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = {
    student: [
      { name: t('dashboard'), path: '/student', icon: <LayoutDashboard size={20} /> },
      { name: t('file_complaint'), path: '/student/complaint', icon: <MessageSquare size={20} /> },
    ],
    driver: [
      { name: t('dashboard'), path: '/driver', icon: <LayoutDashboard size={20} /> },
      { name: t('report_breakdown'), path: '/driver/breakdown', icon: <AlertTriangle size={20} /> },
    ],
    transport_in_charge: [
      { name: t('overview'), path: '/transport-in-charge', icon: <LayoutDashboard size={20} /> },
      { name: t('complaints'), path: '/transport-in-charge/complaints', icon: <MessageSquare size={20} /> },
      { name: t('driver_performance'), path: '/transport-in-charge/performance', icon: <UserCircle size={20} /> },
    ],
    admin: [
      { name: t('dashboard'), path: '/admin', icon: <LayoutDashboard size={20} /> },
      { name: t('user_management'), path: '/admin?tab=users', icon: <UserCircle size={20} /> },
      { name: t('bus_management'), path: '/admin?tab=buses', icon: <Bus size={20} /> },
      { name: t('route_management'), path: '/admin?tab=routes', icon: <Shield size={20} /> },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <Bus className="text-primary-400" size={32} />
        <span className="text-xl font-bold tracking-tight">SafeRide+</span>
      </div>

      <nav className="flex-1 space-y-2">
        {currentMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 space-y-4">
        <div className="px-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
            {t('select_language')}
          </label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-sm rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
