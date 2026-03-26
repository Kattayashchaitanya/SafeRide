import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingDown, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { fetchComplaints, fetchInsights } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [complaintsData, insightsData] = await Promise.all([
          fetchComplaints(user.accessToken),
          fetchInsights(user.accessToken)
        ]);
        setComplaints(complaintsData || []);
        setInsights(insightsData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadData();
  }, [user]);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Delay Minutes',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transport Systems Overview</h1>
          <p className="text-slate-500 mt-1">Live health monitor of the SafeRide+ network.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/manage')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all"
        >
          Manage Fleet
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Grievances</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900">{complaints.length}</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">System Delays</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-slate-900">{insights?.totalDelays || 0}</p>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Alerts</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-red-600">{Object.keys(insights?.overcrowdedBuses || {}).length}</p>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Fleet Health</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-green-600">98%</p>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex justify-between items-center">
            System Insights
            <TrendingDown className="text-slate-300" />
          </h2>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-2">Delay Analysis</h4>
              <p className="text-xs text-slate-500 mb-4">Routes with frequent late arrivals this week.</p>
              <div className="space-y-2">
                {Object.entries(insights?.problematicBuses || {}).length > 0 ? (
                  Object.entries(insights?.problematicBuses || {}).map(([bus, count]) => (
                    <div key={bus} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 font-medium">Bus {bus}</span>
                      <span className="text-red-500 font-bold">{count} reports</span>
                    </div>
                  ))
                ) : <p className="text-xs italic text-slate-400">All routes operating efficiently.</p>}
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/transport-in-charge/performance')}
              className="w-full py-4 bg-primary-50 text-primary-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-100 transition-all border border-primary-100"
            >
              Analyze Driver Performance <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Efficiency Trends</h2>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { beginAtZero: true, grid: { color: '#f8fafc' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
          <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
            Data aggregated from one-click driver arrivals and student complaint metrics.
          </p>
        </section>
      </div>
    </div>
  );
};

export default InChargeDashboard;
