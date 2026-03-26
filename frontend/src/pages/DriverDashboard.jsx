import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, CheckCircle2, Loader2, Star, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { logArrival, fetchPerformance } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogArrival = async () => {
    setIsLogging(true);
    try {
      await logArrival({
        driverId: user.uid,
        busNumber: userData?.assignedBus || 'Unknown',
        expectedTime: '08:30' // Planned arrival
      }, user.accessToken);
      
      toast.success('Arrival time recorded successfully!');
    } catch (error) {
      toast.error('Failed to record arrival.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Driver Dashboard</h1>
          <p className="text-slate-500 mt-1">Safe travels, {userData?.name || 'Driver'}!</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Star className="text-amber-500" fill="currentColor" size={20} />
          <span className="font-bold text-slate-900">{performance?.points || 100} / 100 Safety Points</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Campus Arrival Log</h2>
              <p className="text-slate-400 mb-8">One-click recording for your arrival time at campus.</p>
              
              <button
                disabled={isLogging}
                onClick={handleLogArrival}
                className="w-full py-6 bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-primary-500/30"
              >
                {isLogging ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={28} />}
                RECORD ARRIVAL NOW
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
                  <h2 className="font-bold text-slate-900">Bus Details</h2>
               </div>
               <p className="text-sm text-slate-500">Number: <span className="font-bold text-slate-900">{userData?.assignedBus || 'N/A'}</span></p>
               <p className="text-sm text-slate-500">Route: <span className="font-bold text-slate-900">Campus - City Center</span></p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <h2 className="font-bold text-slate-900">Schedule</h2>
               </div>
               <p className="text-sm text-slate-500">Next Shift: <span className="font-bold text-slate-900">Tomorrow 07:00 AM</span></p>
               <p className="text-sm text-slate-500">Status: <span className="font-bold text-green-600">On Duty</span></p>
            </section>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Action Center</h2>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/driver/breakdown')}
              className="w-full flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors border border-red-100 group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} />
                <span className="font-bold">Report Emergency</span>
              </div>
            </button>
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed shadow-inner">
              <h4 className="font-bold text-slate-900 mb-1">Safety Guidelines</h4>
              Maintain constant speed and always yield to students at crossings.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverDashboard;
