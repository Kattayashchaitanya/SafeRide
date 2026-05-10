import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Bus, Route as RouteIcon, Save, Settings, TrendingDown, Users, TrendingUp, Loader2, ArrowRight, MinusCircle, LayoutDashboard, Megaphone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addUser, addBus, addRoute, fetchAllPerformances, fetchInsights, deductPoints, fetchStats, postAnnouncement, fetchBuses } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab') || 'overview';
    setActiveTab(tab);
  }, [location.search]);
  
  // Performance Data State
  const [drivers, setDrivers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loadingPerf, setLoadingPerf] = useState(true);
  const [penalizingId, setPenalizingId] = useState(null);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', assignedBus: '' });
  const [busForm, setBusForm] = useState({ busNumber: '', capacity: '' });
  const [routeForm, setRouteForm] = useState({ source: '', destination: '' });
  const [announcementText, setAnnouncementText] = useState('');

  const loadPerformanceData = async () => {
    if (!token) return;
    setLoadingPerf(true);
    try {
      // Use Promise.allSettled to ensure that even if stats fail, performance still loads
      const [driversRes, insightsRes, statsRes, busesRes] = await Promise.allSettled([
        fetchAllPerformances(token),
        fetchInsights(token),
        fetchStats(token),
        fetchBuses(token)
      ]);
      
      if (driversRes.status === 'fulfilled') setDrivers(driversRes.value || []);
      if (insightsRes.status === 'fulfilled') setInsights(insightsRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (busesRes.status === 'fulfilled') setBuses(busesRes.value || []);
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingPerf(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      loadPerformanceData();
    }
  }, [activeTab, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'users') {
        await addUser(userForm, token);
        toast.success(t('user_added_success'));
        setUserForm({ name: '', email: '', role: 'student', assignedBus: '' });
      } else if (activeTab === 'buses') {
        await addBus(busForm, token);
        toast.success(t('bus_added_success'));
        setBusForm({ busNumber: '', capacity: '' });
      } else if (activeTab === 'routes') {
        await addRoute(routeForm, token);
        toast.success(t('route_added_success'));
        setRouteForm({ source: '', destination: '' });
      } else if (activeTab === 'announcements') {
        await postAnnouncement(announcementText, token);
        toast.success(t('success'));
        setAnnouncementText('');
      }
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      toast.error(`${t('error')}: ${error.response?.data?.message || activeTab}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeduct = async (e, driverId) => {
    e.stopPropagation();
    const reason = window.prompt(t('penalize_reason_prompt'));
    if (!reason) return;
    setPenalizingId(driverId);
    try {
      await deductPoints({ driverId, pointsToDeduct: 5, reason }, token);
      toast.success(t('points_deducted_success'));
      loadPerformanceData();
    } catch (err) {
      toast.error(t('failed_deduct_points'));
    } finally {
      setPenalizingId(null);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('system_admin')}</h1>
          <p className="text-slate-500 mt-1">{t('manage_system')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TabButton id="overview" label={t('overview')} icon={LayoutDashboard} />
          {user?.role === 'admin' && <TabButton id="users" label={t('users')} icon={UserPlus} />}
          <TabButton id="buses" label={t('buses')} icon={Bus} />
          <TabButton id="routes" label={t('routes')} icon={RouteIcon} />
          <TabButton id="announcements" label={t('announcements')} icon={Megaphone} />
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Insights Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
                <h3 className="font-bold text-slate-900 text-sm">{t('delayed_arrivals')}</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{insights?.totalDelays || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Users size={20} /></div>
                <h3 className="font-bold text-slate-900 text-sm">{t('overcrowding_alerts')}</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{Object.keys(insights?.overcrowdedBuses || {}).length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
                <h3 className="font-bold text-slate-900 text-sm">{t('active_buses')}</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats?.activeBuses || 0}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">{t('driver_safety_rankings')}</h2>
              </div>
              <div className="overflow-x-auto">
                {loadingPerf ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={32} /></div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">{t('driver_name')}</th>
                        <th className="px-6 py-4 text-center">{t('points')}</th>
                        <th className="px-6 py-4 text-right">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {drivers.map(driver => (
                        <tr 
                          key={driver.id} 
                          onClick={() => navigate(`/transport-in-charge/performance/${driver.id}`)}
                          className="hover:bg-slate-50 cursor-pointer group transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                {driver.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900 flex items-center gap-2">
                                {driver.name}
                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-600" />
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                              driver.points > 90 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {driver.points}/100
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={(e) => handleDeduct(e, driver.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                              <MinusCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <section className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">{t('quick_overview')}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="opacity-80">{t('total_users')}</span>
                      <span className="font-bold">{stats?.totalUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="opacity-80">{t('total_complaints')}</span>
                      <span className="font-bold">{stats?.totalComplaints || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="opacity-80">{t('active_buses')}</span>
                      <span className="font-bold">{stats?.activeBuses || 0}</span>
                    </div>
                  </div>
                </div>
                <Shield className="absolute -bottom-6 -right-6 text-white/10" size={140} />
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <section className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                {activeTab === 'users' ? <UserPlus size={24} /> : 
                 activeTab === 'buses' ? <Bus size={24} /> : 
                 activeTab === 'routes' ? <RouteIcon size={24} /> : 
                 <Megaphone size={24} />}
              </div>
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {activeTab === 'announcements' 
                  ? t('announcements') 
                  : `${t('add_new')} ${t(activeTab === 'users' ? 'user' : activeTab === 'buses' ? 'bus' : 'route')}`}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'announcements' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('announcements')}</label>
                  <textarea 
                    required 
                    value={announcementText} 
                    onChange={e => setAnnouncementText(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none" 
                    placeholder="Type your announcement here..." 
                  />
                </div>
              )}
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
                {isSubmitting ? t('saving') : 
                 activeTab === 'announcements' ? t('save') : 
                 `${t('save')} ${t(activeTab === 'users' ? 'user' : activeTab === 'buses' ? 'bus' : 'route')}`}
              </button>
            </form>
          </section>

          <div className="space-y-6">
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
                    <p className="text-slate-500 text-xs">By {log.user}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bus size={20} className="text-slate-400" />
                {t('buses')}
              </h3>
              <div className="space-y-3">
                {buses.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No buses registered.</p>
                ) : (
                  buses.map((bus, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-700">{bus.busNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        bus.status === 'active' || !bus.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {bus.status || 'active'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
