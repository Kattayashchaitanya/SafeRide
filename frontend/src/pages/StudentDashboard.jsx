import React from 'react';
import { Info, MapPin, Bus, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
        <p className="text-slate-500 mt-1">Ready for your ride today?</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Live Bus Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                  <p className="text-xs text-primary-600 font-bold uppercase mb-1">Your Route</p>
                  <p className="text-lg font-bold text-slate-900">Route 14 (Campus Link)</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-xs text-green-600 font-bold uppercase mb-1">Status</p>
                  <p className="text-lg font-bold text-slate-900">On Schedule</p>
                </div>
              </div>
            </div>
            <Bus className="absolute -bottom-8 -right-8 text-slate-50" size={160} />
          </div>

          <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-primary-400" />
              Upcoming Bus Timings
            </h3>
            <div className="space-y-4">
              {[
                { time: '08:45 AM', bus: 'B-102', to: 'Main Gate' },
                { time: '09:15 AM', bus: 'B-204', to: 'Admin Block' },
                { time: '04:30 PM', bus: 'B-102', to: 'City Center' }
              ].map((ride, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black">{ride.time}</span>
                    <div className="text-xs">
                      <p className="font-bold opacity-50">Bus {ride.bus}</p>
                      <p>To {ride.to}</p>
                    </div>
                  </div>
                  <MapPin size={18} className="text-primary-400" />
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Info size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
            </div>
            <div className="space-y-4">
              {[
                { date: 'Oct 24', text: 'Bus Route 5 is slightly delayed today.' },
                { date: 'Oct 23', text: 'New hygiene checks implemented across all buses.' }
              ].map((ann, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-primary-600 uppercase">{ann.date}</span>
                  <p className="text-sm text-slate-600 mt-0.5">{ann.text}</p>
                </div>
              ))}
            </div>
          </section>

          <button 
            onClick={() => navigate('/student/complaint')}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-100 transition-all flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            REPORT AN ANONYMOUS ISSUE
          </button>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
