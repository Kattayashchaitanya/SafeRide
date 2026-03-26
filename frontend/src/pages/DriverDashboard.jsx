import React, { useState, useEffect } from 'react';
import { Bus, UserCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchPerformance, reportBreakdown as apiReportBreakdown } from '../services/api';

const DriverDashboard = () => {
  const { user, userData } = useAuth();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('active'); // active, maintenance, breakdown

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchPerformance(user.uid, user.accessToken);
        setPerformance(data);
      } catch (err) {
        console.error('Failed to fetch performance', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) getStats();
  }, [user]);

  const handleBreakdown = async () => {
    const previousStatus = status;
    setStatus('breakdown');
    try {
      await apiReportBreakdown({
        driverId: user.uid,
        busNumber: userData?.assignedBus || 'Unknown',
        details: 'Reported manually from driver dashboard'
      }, user.accessToken);
      
      toast.success('Breakdown reported to In-Charge successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to report breakdown');
      setStatus(previousStatus);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Driver Dashboard</h1>
        <p className="text-slate-500 mt-1">Safe travels, {userData?.name || 'Driver'}!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Card */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
              <UserCircle size={48} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Driver Performance</h2>
            {loading ? (
              <Loader2 className="animate-spin text-primary-600" />
            ) : (
              <div className="space-y-2">
                <div className="text-5xl font-extrabold text-primary-600">
                  {performance?.score || 100}
                </div>
                <p className="text-slate-500 font-medium">Overall Rating</p>
                <div className="mt-4 px-4 py-2 bg-slate-50 rounded-full text-sm text-slate-600">
                  {performance?.complaintsCount || 0} Complaints Received
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Bus size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Assigned Bus</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">Bus Number</span>
                <span className="font-bold text-slate-900">{userData?.assignedBus || 'Not Assigned'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500">Route</span>
                <span className="font-bold text-slate-900">Campus - City Center</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Status</span>
                <span className={`flex items-center gap-1.5 font-bold ${status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                  {status === 'active' ? 'On Duty' : 'Breakdown Reported'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Action Center */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Action Center</h2>
          <button 
            onClick={handleBreakdown}
            className="w-full flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors border border-red-100 group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <span className="font-bold">Report Breakdown</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-200/50 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <span className="text-xl">!</span>
            </div>
          </button>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Notice for Drivers</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please ensure all safety checks are completed before starting your shift. Maintain speed limits within campus premises.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverDashboard;
