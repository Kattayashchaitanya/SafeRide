import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import { fetchComplaints } from '../services/api';
import { useAuth } from '../context/AuthContext';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InChargeDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComplaints = async () => {
      try {
        const data = await fetchComplaints(user.accessToken);
        setComplaints(data);
      } catch (err) {
        console.error('Failed to fetch complaints', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) getComplaints();
  }, [user]);

  const last5Days = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toISOString().split('T')[0];
    return { dayName, dateStr };
  });

  const dailyCounts = last5Days.map(({ dateStr }) => {
    return complaints.filter(c => c.date === dateStr || (c.createdAt && c.createdAt.startsWith(dateStr))).length;
  });

  const chartData = {
    labels: last5Days.map(d => d.dayName),
    datasets: [
      {
        label: 'Complaints',
        data: dailyCounts,
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transport Management</h1>
        <p className="text-slate-500 mt-1">Overview of system performance and active grievances.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Complaints', value: complaints.length, icon: <MessageSquare />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Drivers', value: '24', icon: <Users />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Delay', value: '12m', icon: <Clock />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Safety Score', value: '92%', icon: <BarChart3 />, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Complaints Table */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Recent Complaints</h2>
            <button className="text-sm text-primary-600 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Bus</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{comp.busNumber}</td>
                    <td className="px-6 py-4 text-slate-600">{comp.complaintType}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{comp.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Weekly Trends</h2>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
              <span className="text-slate-500">Most Common Issue</span>
              <span className="font-bold text-slate-900">Rash Driving</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl text-sm">
              <span className="text-green-600">Avg Response Time</span>
              <span className="font-bold text-green-700">6.4 Hours</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InChargeDashboard;
