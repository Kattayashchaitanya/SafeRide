import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitComplaint } from '../services/api';

const StudentComplaints = () => {
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
      toast.success('Thank you! Your complaint has been submitted anonymously.');
      setFormData({
        busNumber: '',
        complaintType: 'behavior',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Anonymous Complaint</h1>
        <p className="text-slate-500 mt-1">Your identity will not be shared with the driver or transport staff.</p>
      </div>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Report an Issue</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bus Number</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Type</label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={formData.complaintType}
              onChange={(e) => setFormData({...formData, complaintType: e.target.value})}
            >
              <option value="behavior">Rash Driving / Behavior</option>
              <option value="delay">Bus Delay</option>
              <option value="overcrowding">Overcrowding</option>
              <option value="hygiene">Bus Hygiene</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows="4"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Briefly describe what happened..."
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
            {isSubmitting ? 'Submitting...' : 'Submit Anonymously'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default StudentComplaints;
