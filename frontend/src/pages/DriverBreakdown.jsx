import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { reportBreakdown, fetchNearbyBuses } from '../services/api';

const DriverBreakdown = () => {
  const { user, userData } = useAuth();
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backupDrivers, setBackupDrivers] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(true);

  useEffect(() => {
    const loadBackups = async () => {
      try {
        const data = await fetchNearbyBuses(user.accessToken);
        setBackupDrivers(data.backupDrivers || []);
      } catch (err) {
        console.error('Failed to load backup drivers', err);
      } finally {
        setLoadingBackups(false);
      }
    };
    loadBackups();
  }, [user.accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportBreakdown({
        driverId: user.uid,
        busNumber: userData?.assignedBus || 'Unknown',
        location
      }, user.accessToken);
      
      toast.success('Breakdown reported! Nearby buses and the Transport Head have been alerted.');
      setLocation('');
    } catch (error) {
      toast.error('Failed to report breakdown.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Emergency & Breakdowns</h1>
        <p className="text-slate-500 mt-1">Quickly alert the network and find backup assistance.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Report Breakdown</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location / Landmark</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="e.g. Near City Square Mall"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600">
                Reporting a breakdown will automatically notify the Transport In-Charge and alert all backup drivers in the network.
              </p>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <AlertTriangle size={18} />}
              Report Emergency Breakdown
            </button>
          </form>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Phone size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Backup Assistance</h2>
          </div>

          <div className="space-y-4">
            {loadingBackups ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-slate-300" size={32} />
              </div>
            ) : backupDrivers.length > 0 ? (
              backupDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <h4 className="font-bold text-slate-900">{driver.name}</h4>
                    <p className="text-xs text-slate-500">Backup Driver • Bus: {driver.assignedBus || 'N/A'}</p>
                  </div>
                  <a 
                    href={`tel:${driver.backupContact || '0000000000'}`}
                    className="p-2 bg-white text-blue-600 rounded-full border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-8">No backup drivers currently registered.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverBreakdown;
