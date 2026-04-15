import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchComplaints, resolveComplaint } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const InChargeComplaints = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const loadComplaints = async () => {
    try {
      const data = await fetchComplaints(user.accessToken);
      setComplaints(data || []);
    } catch (err) {
      toast.error(t('load_complaints_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [user.accessToken]);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await resolveComplaint(id, { status: 'resolved' }, user.accessToken);
      toast.success(t('complaint_resolved_success'));
      loadComplaints();
    } catch (err) {
      toast.error(t('resolve_complaint_error'));
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('complaints_management')}</h1>
        <p className="text-slate-500 mt-1">{t('complaints_desc')}</p>
      </div>

      <div className="grid gap-6">
        {complaints.length > 0 ? (
          complaints.map((c) => (
            <div key={c.id} className={`bg-white p-6 rounded-2xl border ${c.status === 'resolved' ? 'border-green-100 bg-green-50/20' : 'border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    c.complaintType === 'behavior' ? 'bg-red-100 text-red-600' :
                    c.complaintType === 'overcrowding' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {c.complaintType}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">{t('bus')}: {c.busNumber}</span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-slate-700 mb-6 leading-relaxed">"{c.description}"</p>
              
              <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                <span className={`flex items-center gap-1.5 text-sm font-bold ${c.status === 'resolved' ? 'text-green-600' : 'text-amber-500'}`}>
                  {c.status === 'resolved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  {c.status === 'resolved' ? t('resolved').toUpperCase() : t('pending').toUpperCase()}
                </span>
                
                {c.status !== 'resolved' && (
                  <button
                    disabled={resolvingId === c.id}
                    onClick={() => handleResolve(c.id)}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    {resolvingId === c.id ? <Loader2 className="animate-spin" size={16} /> : t('mark_resolved')}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400">{t('no_complaints')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InChargeComplaints;
