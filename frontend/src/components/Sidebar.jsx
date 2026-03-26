import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogOut, LayoutDashboard, MessageSquare, Shield, UserCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { role, logout } = useAuth();
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
      { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
      { name: 'File Complaint', path: '/student/complaint', icon: <MessageSquare size={20} /> },
    ],
    driver: [
      { name: 'Dashboard', path: '/driver', icon: <LayoutDashboard size={20} /> },
      { name: 'Report Breakdown', path: '/driver/breakdown', icon: <AlertTriangle size={20} /> },
    ],
    transport_in_charge: [
      { name: 'Overview', path: '/transport-in-charge', icon: <LayoutDashboard size={20} /> },
      { name: 'Complaints', path: '/transport-in-charge/complaints', icon: <MessageSquare size={20} /> },
      { name: 'Driver Performance', path: '/transport-in-charge/performance', icon: <UserCircle size={20} /> },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
      { name: 'User Management', path: '/admin?tab=users', icon: <UserCircle size={20} /> },
      { name: 'Bus Management', path: '/admin?tab=buses', icon: <Bus size={20} /> },
      { name: 'Route Management', path: '/admin?tab=routes', icon: <Shield size={20} /> },
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
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
