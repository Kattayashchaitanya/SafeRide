import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, BarChart3, Users, Clock, ArrowUpRight, Bus, ChevronRight, CheckSquare, Loader2, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchAllPerformances, fetchInsights, fetchAnnouncements } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InChargeDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;
      setLoading(true);
      
      try {
        const [statsRes, driversRes, insightsRes, annRes] = await Promise.allSettled([
          fetchStats(token),
          fetchAllPerformances(token),
          fetchInsights(token),
          fetchAnnouncements(token)
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value);
        if (driversRes.status === 'fulfilled') setDrivers(driversRes.value?.slice(0, 5) || []);
        if (insightsRes.status === 'fulfilled') setInsights(insightsRes.value);
        if (annRes.status === 'fulfilled') setAnnouncements(annRes.value);

      } catch (err) {
        console.error('In-Charge Dashboard Loading Error:', err);
      }

      setLoading(false);
    };
    if (user) loadDashboardData();
  }, [user, token]);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Delay Minutes',
        data: insights?.delaysByDay ? [
          insights.delaysByDay.Mon, 
          insights.delaysByDay.Tue, 
          insights.delaysByDay.Wed, 
          insights.delaysByDay.Thu, 
          insights.delaysByDay.Fri,
          insights.delaysByDay.Sat,
          insights.delaysByDay.Sun
        ] : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderRadius: 8,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('transport_overview')}</h1>
          <p className="text-slate-500 mt-1">{t('live_monitor')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('total_grievances')}
          value={stats?.totalComplaints || 0} 
          icon={ShieldAlert} 
          color="bg-red-500" 
          trend="+12%"
        />
        <StatCard 
          title={t('active_buses')} 
          value={stats?.activeBuses || 0} 
          icon={Bus} 
          color="bg-blue-500" 
        />
        <StatCard 
          title={t('system_delays')} 
          value={`${stats?.totalDelays || 0} arrivals`} 
          icon={Clock} 
          color="bg-amber-500" 
          trend="-20%"
        />
        <StatCard 
          title={t('fleet_health')} 
          value="98%" 
          icon={Activity} 
          color="bg-green-500" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Action Area */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-2">{t('system_insights')}</h2>
              <p className="text-slate-400 mb-8 max-w-sm">{t('delay_analysis')}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button 
                  onClick={() => navigate('/transport-in-charge/complaints')}
                  className="p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group flex flex-col gap-3"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckSquare size={20} className="text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{t('complaints')}</p>
                    <p className="text-xs text-white/40">{t('complaints_desc').slice(0, 30)}...</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/transport-in-charge/performance')}
                  className="p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group flex flex-col gap-3"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 size={20} className="text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{t('efficiency_trends')}</p>
                    <p className="text-xs text-white/40">{t('analyze_performance')}</p>
                  </div>
                </button>
              </div>
            </div>
            <Activity className="absolute -bottom-10 -right-10 text-white/5" size={200} />
          </div>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('efficiency_trends')}</h2>
            <div className="h-64">
              <Bar 
                key={JSON.stringify(insights?.delaysByDay || {})}
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.parsed.y} mins delayed`
                      }
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true, 
                      max: 10,
                      grid: { color: '#f1f5f9' },
                      ticks: { 
                        stepSize: 2,
                        callback: (value) => `${value}m` 
                      }
                    },
                    x: { grid: { display: false } }
                  }
                }} 
              />
            </div>
          </section>
        </section>

        {/* Sidebar Info */}
        <section className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-slate-400" />
              {t('driver_performance')}
            </h3>
            <div className="space-y-5">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
              ) : drivers.length > 0 ? drivers.map((driver) => (
                <div 
                  key={driver.id} 
                  onClick={() => navigate(`/transport-in-charge/performance/${driver.id}`)}
                  className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none group-hover:text-primary-600 transition-colors">{driver.name}</p>
                      <p className={`text-[10px] uppercase font-black mt-1 ${driver.points < 75 ? 'text-amber-500' : 'text-green-500'}`}>
                        {driver.points < 75 ? 'Warning' : 'Active'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{driver.points || 100} pts</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 text-sm py-4">{t('no_drivers_found')}</p>
              )}
            </div>
            <button 
              onClick={() => navigate('/transport-in-charge/performance')}
              className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-100"
            >
              {t('analyze_performance')}
            </button>
          </div>

          {/* Global Announcements */}
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Megaphone size={20} className="text-slate-400" />
              {t('announcements')}
            </h3>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No global announcements.</p>
              ) : (
                announcements.map((ann, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">
                      {new Date(ann.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{ann.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default InChargeDashboard;
