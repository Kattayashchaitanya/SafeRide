import React, { useEffect, useState } from 'react';
import { Info, Bus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchAnnouncements, fetchLatestArrivals, fetchActiveAlerts, fetchBuses } from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      try {
        const results = await Promise.allSettled([
          fetchAnnouncements(token),
          fetchLatestArrivals(token),
          fetchActiveAlerts(token),
          fetchBuses(token)
        ]);

        if (results[0].status === 'fulfilled') setAnnouncements(results[0].value);
        if (results[1].status === 'fulfilled' && results[1].value?.length > 0) setStatusData(results[1].value[0]);
        if (results[2].status === 'fulfilled') setActiveAlerts(results[2].value?.alerts || []);
        if (results[3].status === 'fulfilled') {
          // Filter for active buses and remove duplicates by busNumber
          const allBuses = results[3].value || [];
          const activeBuses = allBuses.filter(b => b.status === 'active' || !b.status);
          const uniqueBuses = Array.from(new Map(activeBuses.map(b => [b.busNumber, b])).values());
          setBuses(uniqueBuses);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    if (user) loadData();
  }, [user, token]);

  // Logic to determine live status
  const getLiveStatus = () => {
    if (activeAlerts.length > 0) return { label: t('emergency'), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' };
    if (!statusData) return { label: t('on_schedule'), color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
    
    // If last arrival was more than 30 mins ago, maybe show something else?
    // For now, let's just use the delay info from last arrival
    if (statusData.delayMinutes > 0) return { label: `${statusData.delayMinutes}m ${t('delayed')}`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
    return { label: t('on_schedule'), color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' };
  };

  const liveStatus = getLiveStatus();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('student_dashboard')}</h1>
        <p className="text-slate-500 mt-1">{t('ready_for_ride')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('live_bus_status')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                  <p className="text-xs text-primary-600 font-bold uppercase mb-1">{t('your_route')}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {statusData ? `Bus ${statusData.busNumber}` : 'B-101 (Standard)'}
                  </p>
                </div>
                <div className={`p-4 ${liveStatus.bg} rounded-2xl border ${liveStatus.border}`}>
                  <p className={`text-xs ${liveStatus.color} font-bold uppercase mb-1`}>{t('status')}</p>
                  <p className="text-lg font-bold text-slate-900">{liveStatus.label}</p>
                </div>
              </div>
            </div>
            <Bus className="absolute -bottom-8 -right-8 text-slate-50" size={160} />
          </div>

          <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bus className="text-primary-400" />
              {t('bus_details')}
            </h3>
            <div className="space-y-4">
              {buses.length === 0 ? (
                <p className="text-center text-white/40 py-8 italic">{t('no_buses_found')}</p>
              ) : (
                buses.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl font-black">
                        {item.busNumber?.split('-')[1] || item.busNumber}
                      </div>
                      <div>
                        <p className="font-bold text-white">{t('bus')} {item.busNumber}</p>
                        <p className="text-xs text-white/50">{t('capacity')}: {item.capacity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-primary-400 mb-1">{t('status')}</p>
                      <p className="text-xs font-bold text-green-400 capitalize">{item.status || 'Active'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>

        <section className="space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Info size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{t('announcements')}</h2>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No announcements yet.</p>
              ) : (
                announcements.map((ann, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-primary-600 uppercase">
                      {new Date(ann.date).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-slate-600 mt-0.5">{ann.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <button 
            onClick={() => navigate('/student/complaint')}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-100 transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            {t('report_anonymous_issue')}
          </button>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
