import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, UserPlus, Bus, Route as RouteIcon, Save, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addUser, addBus, addRoute } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'users';

  const [activeTab, setActiveTab] = useState(initialTab || 'users');
  
  // Update tab if URL changes
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', assignedBus: '' });
  const [busForm, setBusForm] = useState({ busNumber: '', capacity: '' });
  const [routeForm, setRouteForm] = useState({ source: '', destination: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'users') {
        await addUser(userForm, user.accessToken);
        toast.success(t('user_added_success'));
        setUserForm({ name: '', email: '', role: 'student', assignedBus: '' });
      } else if (activeTab === 'buses') {
        await addBus(busForm, user.accessToken);
        toast.success(t('bus_added_success'));
        setBusForm({ busNumber: '', capacity: '' });
      } else if (activeTab === 'routes') {
        await addRoute(routeForm, user.accessToken);
        toast.success(t('route_added_success'));
        setRouteForm({ source: '', destination: '' });
      }
    } catch (error) {
      toast.error(`${t('error')}: ${activeTab.slice(0, -1)}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        activeTab === id 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('system_admin')}</h1>
          <p className="text-slate-500 mt-1">{t('manage_system')}</p>
        </div>
        <div className="flex gap-2">
          <TabButton id="users" label={t('users')} icon={UserPlus} />
          <TabButton id="buses" label={t('buses')} icon={Bus} />
          <TabButton id="routes" label={t('routes')} icon={RouteIcon} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <section className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              {activeTab === 'users' ? <UserPlus size={24} /> : activeTab === 'buses' ? <Bus size={24} /> : <RouteIcon size={24} />}
            </div>
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              {t('add_new')} {t(activeTab.slice(0, -1))}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'users' && (
              <>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('full_name')}</label>
                    <input required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('email_address')}</label>
                    <input required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@college.edu" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('role')}</label>
                    <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="student">{t('student')}</option>
                      <option value="driver">{t('driver')}</option>
                      <option value="transport_in_charge">{t('transport_in_charge')}</option>
                      <option value="admin">{t('admin')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('assigned_bus')}</label>
                    <input value={userForm.assignedBus} onChange={e => setUserForm({...userForm, assignedBus: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="B-101" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'buses' && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('bus_number')}</label>
                  <input required value={busForm.busNumber} onChange={e => setBusForm({...busForm, busNumber: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="B-205" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('capacity')}</label>
                  <input required value={busForm.capacity} onChange={e => setBusForm({...busForm, capacity: e.target.value})} type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="50" />
                </div>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('source')}</label>
                  <input required value={routeForm.source} onChange={e => setRouteForm({...routeForm, source: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Campus Main Gate" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('destination')}</label>
                  <input required value={routeForm.destination} onChange={e => setRouteForm({...routeForm, destination: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="City Center" />
                </div>
              </div>
            )}

            <button disabled={isSubmitting} type="submit" className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-70">
              <Save size={18} />
              {isSubmitting ? t('saving') : `${t('save')} ${t(activeTab.slice(0, -1))}`}
            </button>
          </form>
        </section>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          <section className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">{t('quick_overview')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="opacity-80">{t('total_users')}</span>
                  <span className="font-bold">1,240</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="opacity-80">{t('active_buses')}</span>
                  <span className="font-bold">32</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="opacity-80">{t('pending_complaints')}</span>
                  <span className="font-bold">14</span>
                </div>
              </div>
            </div>
            <Shield className="absolute -bottom-6 -right-6 text-white/10" size={140} />
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-slate-400" />
              {t('recent_logs')}
            </h3>
            <div className="space-y-4">
              {[
                { action: 'User Added', user: 'driver_rahul', time: '2h ago' },
                { action: 'Bus Assigned', user: 'admin_sys', time: '5h ago' }
              ].map((log, i) => (
                <div key={i} className="text-sm p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-700">{log.action}</span>
                    <span className="text-slate-400 text-xs">{log.time}</span>
                  </div>
                  <p className="text-slate-500">By {log.user}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
