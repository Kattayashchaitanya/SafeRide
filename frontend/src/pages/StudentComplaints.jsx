import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitComplaint } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const StudentComplaints = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    busNumber: '',
    complaintType: 'behavior',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitComplaint(formData);
      toast.success(t('complaint_submitted_success'));
      setFormData({
        busNumber: '',
        complaintType: 'behavior',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Submission failed', error);
      toast.error(t('complaint_submitted_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t('anonymous_complaint')}</h1>
        <p className="text-slate-500 mt-1">{t('anonymous_desc')}</p>
      </div>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t('report_issue')}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('bus_number')}</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="e.g. B-102"
              value={formData.busNumber}
              onChange={(e) => setFormData({...formData, busNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('issue_type')}</label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={formData.complaintType}
              onChange={(e) => setFormData({...formData, complaintType: e.target.value})}
            >
              <option value="behavior">{t('rash_behavior')}</option>
              <option value="delay">{t('bus_delay')}</option>
              <option value="overcrowding">{t('overcrowding')}</option>
              <option value="hygiene">{t('bus_hygiene')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('description')}</label>
            <textarea
              required
              rows="4"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder={t('description_placeholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 disabled:opacity-70"
          >
            <Send size={18} />
            {isSubmitting ? t('submitting') : t('submit_anonymously')}
          </button>
        </form>
      </section>
    </div>
  );
};

export default StudentComplaints;
