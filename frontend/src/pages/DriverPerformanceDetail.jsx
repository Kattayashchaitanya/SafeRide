import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  Bus, 
  MapPin,
  Loader2,
  MinusCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchPerformance, deductPoints } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const DriverPerformanceDetail = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penalizing, setPenalizing] = useState(false);

  const loadDriverData = async () => {
    try {
      const data = await fetchPerformance(driverId, user.accessToken);
      setDriver(data);
    } catch (err) {
      toast.error(t('failed_load_driver_details'));
      navigate('/transport-in-charge/performance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverData();
  }, [driverId, user.accessToken]);

  const handlePenalize = async () => {
    const reason = window.prompt(t('penalize_reason_prompt'));
    if (!reason) return;

    setPenalizing(true);
    try {
      await deductPoints({ driverId, pointsToDeduct: 5, reason }, user.accessToken);
      toast.success(t('points_deducted_success'));
      loadDriverData();
    } catch (err) {
      toast.error(t('failed_deduct_points'));
    } finally {
      setPenalizing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-primary-600 mb-4" size={48} />
      <p className="text-slate-500 animate-pulse font-medium">{t('fetching_driver_performance')}</p>
    </div>
  );

  if (!driver) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/transport-in-charge/performance')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('back_to_rankings')}
        </button>
        <button
          onClick={handlePenalize}
          disabled={penalizing}
          className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2 border border-red-100"
        >
          <MinusCircle size={18} />
          {penalizing ? t('processing') : t('issue_penalty')}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Shield size={200} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-primary-500 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg">
              {driver.name.charAt(0)}
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black tracking-tight">{driver.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                  <User size={14} /> {driver.email}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm font-medium">
                  <Bus size={14} /> {t('bus')}: {driver.assignedBus || 'N/A'}
                </span>
              </div>
            </div>
            <div className="md:ml-auto text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t('safety_score')}</div>
              <div className={`text-6xl font-black ${
                driver.points > 90 ? 'text-green-400' :
                driver.points > 70 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {driver.points || 100}
                <span className="text-2xl opacity-50 ml-1">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
          <div className="p-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('total_arrivals')}</p>
            <p className="text-2xl font-bold text-slate-900">{driver.history?.arrivals?.length || 0}</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('on_time_rate')}</p>
            <p className="text-2xl font-bold text-slate-900">
              {driver.history?.arrivals?.length > 0 
                ? `${Math.round((driver.history.arrivals.filter(a => a.status === 'on-time').length / driver.history.arrivals.length) * 100)}%`
                : '100%'
              }
            </p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('total_penalties')}</p>
            <p className="text-2xl font-bold text-red-600">{driver.history?.penalties?.length || 0}</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{t('active_complaints')}</p>
            <p className="text-2xl font-bold text-amber-600">
              {driver.history?.complaints?.filter(c => c.status === 'pending').length || 0}
            </p>
          </div>
        </div>

        <div className="p-8 grid lg:grid-cols-2 gap-12">
          {/* History Sections */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Clock className="text-primary-600" size={20} />
                {t('recent_arrivals')}
              </h3>
              <div className="space-y-3">
                {driver.history?.arrivals?.length > 0 ? driver.history.arrivals.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${log.status === 'on-time' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {log.status === 'on-time' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      log.status === 'on-time' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-4">{t('no_arrivals_logged')}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                <AlertTriangle className="text-red-600" size={20} />
                {t('penalty_history')}
              </h3>
              <div className="space-y-4">
                {driver.history?.penalties?.length > 0 ? driver.history.penalties.map((penalty) => (
                  <div key={penalty.id} className="p-4 rounded-2xl bg-red-50/50 border border-red-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <MinusCircle size={48} className="text-red-600" />
                    </div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <p className="text-red-700 font-bold">-{penalty.pointsDeducted} {t('points')}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase">{new Date(penalty.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-red-600 leading-relaxed relative z-10">{penalty.reason}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-4">{t('no_penalties_issued')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Complaints Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <MessageSquare className="text-amber-600" size={20} />
              {t('linked_student_complaints')}
            </h3>
            <div className="space-y-4">
              {driver.history?.complaints?.length > 0 ? driver.history.complaints.map((complaint) => (
                <div key={complaint.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full tracking-wider border border-amber-100">
                      {complaint.complaintType}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      complaint.status === 'resolved' ? 'text-green-500' : 'text-slate-400'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">{complaint.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-3">
                    <span className="flex items-center gap-1"><Clock size={10} /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {t('bus')}: {complaint.busNumber}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-4">{t('no_complaints_linked')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPerformanceDetail;
