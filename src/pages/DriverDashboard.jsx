import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, CheckCircle2, Loader2, Star, AlertTriangle, X, Megaphone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { logArrival, fetchPerformance, fetchActiveAlerts, assistBreakdown, fetchAnnouncements } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DriverDashboard = () => {
  const { user, userData, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogging, setIsLogging] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      if (!token) return;
      try {
        const [perfData, alertsData, annData] = await Promise.all([
          fetchPerformance(user.uid, token),
          fetchActiveAlerts(token),
          fetchAnnouncements(token)
        ]);
        setPerformance(perfData);
        setAlerts(alertsData.alerts || []);
        setAnnouncements(annData || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      getStats();
      const interval = setInterval(getStats, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const handleLogArrival = async () => {
    setIsLogging(true);
    try {
      await logArrival({
        driverId: user.uid,
        busNumber: userData?.assignedBus || 'Unknown',
        expectedTime: '08:45' // Official morning arrival deadline
      }, user.accessToken);
      
      toast.success(t('arrival_recorded_success'));
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setIsLogging(false);
    }
  };

  const handleBackupAssistance = async (alert) => {
    try {
      await assistBreakdown(alert.id, userData?.name || 'Another Driver', user.accessToken);
      setDismissedAlerts(prev => [...prev, alert.id]);
      navigate('/driver/breakdown');
    } catch (error) {
      console.error('Failed to record assistance', error);
      navigate('/driver/breakdown');
    }
  };

  return (
    <div className="space-y-8">
      {/* Help Received Banner (For the stranded driver) */}
      {alerts.filter(a => a.driverId === user.uid && a.status === 'assisting').map(alert => (
        <div key={`help-${alert.id}`} className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl shadow-blue-500/20 flex items-center justify-between animate-bounce mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Star size={32} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">{t('success')}! Help is on the way</h3>
              <p className="text-white/80 font-medium">Driver {alert.assistedBy} is coming to assist you.</p>
            </div>
          </div>
        </div>
      ))}

      {/* Breakdown Alerts (For other drivers) */}
      {alerts.filter(a => !dismissedAlerts.includes(a.id) && a.driverId !== user.uid && a.status === 'active').length > 0 && (
        <div className="space-y-4">
          {alerts.filter(a => !dismissedAlerts.includes(a.id) && a.driverId !== user.uid && a.status === 'active').map(alert => (
            <div key={alert.id} className="bg-red-500 text-white p-6 rounded-3xl shadow-xl shadow-red-500/20 flex items-center justify-between animate-pulse relative">
              <button 
                onClick={() => setDismissedAlerts(prev => [...prev, alert.id])}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">BREAKDOWN ALERT: {alert.busNumber}</h3>
                  <p className="text-white/80 font-medium">{t('location_landmark')}: {alert.location}</p>
                </div>
              </div>
              <button 
                onClick={() => handleBackupAssistance(alert)}
                className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all shadow-lg"
              >
                {t('backup_assistance')}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('driver_dashboard')}</h1>
          <p className="text-slate-500 mt-1">{t('welcome_driver', { name: userData?.name || t('driver') })}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Star className="text-amber-500" fill="currentColor" size={20} />
          <span className="font-bold text-slate-900">{performance?.points || 100} / 100 {t('safety_points')}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">{t('arrival_log')}</h2>
              <p className="text-slate-400 mb-8">{t('arrival_log_desc')}</p>
              
              <button
                disabled={isLogging}
                onClick={handleLogArrival}
                className="w-full py-6 bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-primary-500/30"
              >
                {isLogging ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={28} />}
                {t('record_arrival')}
              </button>
            </div>
            <Bus className="absolute -bottom-10 -right-10 text-white/5" size={200} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Bus size={24} />
                  </div>
                  <h2 className="font-bold text-slate-900">{t('bus_details')}</h2>
               </div>
               <p className="text-sm text-slate-500">{t('bus_number')}: <span className="font-bold text-slate-900">{userData?.assignedBus || t('n_a')}</span></p>
               <p className="text-sm text-slate-500">{t('route_management')}: <span className="font-bold text-slate-900">Campus - City Center</span></p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <h2 className="font-bold text-slate-900">{t('schedule')}</h2>
               </div>
               <p className="text-sm text-slate-500">{t('next_shift')}: <span className="font-bold text-slate-900">Tomorrow 07:00 AM</span></p>
               <p className="text-sm text-slate-500">{t('status')}: <span className="font-bold text-green-600">{t('on_duty')}</span></p>
            </section>
          </div>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Megaphone size={24} className="text-primary-500" />
              {t('announcements')}
            </h3>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No system announcements.</p>
              ) : (
                announcements.map((ann, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-primary-600 uppercase">
                      {new Date(ann.date).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">{ann.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t('action_center')}</h2>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/driver/breakdown')}
              className="w-full flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors border border-red-100 group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} />
                <span className="font-bold">{t('report_emergency')}</span>
              </div>
            </button>
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed shadow-inner">
              <h4 className="font-bold text-slate-900 mb-1">{t('safety_guidelines')}</h4>
              {t('safety_guidelines_desc')}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverDashboard;
