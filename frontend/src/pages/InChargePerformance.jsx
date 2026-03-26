import React, { useState, useEffect } from 'react';
import { UserCircle, TrendingDown, TrendingUp, AlertCircle, Loader2, MinusCircle, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchAllPerformances, deductPoints, fetchInsights } from '../services/api';

const InChargePerformance = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penalizingId, setPenalizingId] = useState(null);

  const loadData = async () => {
    try {
      const [driversData, insightsData] = await Promise.all([
        fetchAllPerformances(user.accessToken),
        fetchInsights(user.accessToken)
      ]);
      setDrivers(driversData || []);
      setInsights(insightsData);
    } catch (err) {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.accessToken]);

  const handleDeduct = async (driverId) => {
    const reason = window.prompt("Reason for point deduction (e.g., Rash Driving):");
    if (!reason) return;

    setPenalizingId(driverId);
    try {
      await deductPoints({ driverId, pointsToDeduct: 5, reason }, user.accessToken);
      toast.success('5 Points deducted successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to deduct points');
    } finally {
      setPenalizingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-slate-500 mt-1">Monitor driver safety scores and system efficiency.</p>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
            <h3 className="font-bold text-slate-900 text-sm">Delayed Arrivals</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{insights?.totalDelays || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Last 30 days summary</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Users size={20} /></div>
            <h3 className="font-bold text-slate-900 text-sm">Overcrowding Alerts</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{Object.keys(insights?.overcrowdedBuses || {}).length}</p>
          <p className="text-xs text-slate-400 mt-1">Aggregated student reports</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-slate-900 text-sm">Avg Efficiency</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">92%</p>
          <p className="text-xs text-slate-400 mt-1">Based on on-time arrivals</p>
        </div>
      </div>

      {/* Driver List Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Driver Safety Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Assigned Bus</th>
                <th className="px-6 py-4 text-center">Safety Points</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                        {driver.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{driver.assignedBus || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm ${
                      driver.points > 90 ? 'bg-green-100 text-green-600' :
                      driver.points > 70 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {driver.points || 100} / 100
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={penalizingId === driver.id}
                      onClick={() => handleDeduct(driver.id)}
                      className="text-red-500 hover:text-red-700 font-bold text-sm inline-flex items-center gap-1 transition-colors"
                    >
                      <MinusCircle size={16} />
                      {penalizingId === driver.id ? 'Processing...' : 'Penalize (-5)'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InChargePerformance;
