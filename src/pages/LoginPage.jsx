import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Mail, Lock, Loader2, User, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role');
  const { language, setLanguage, t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRole || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, role, user, userData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Failsafe to stop spinning after 4s if network or database hangs
      setTimeout(() => setIsSubmitting(false), 4000);
    } catch (err) {
      setError(t('invalid_credentials'));
      setIsSubmitting(false);
    }
  };

  // Effect to redirect based on role
  React.useEffect(() => {
    if (role) {
      const paths = {
        student: '/student',
        driver: '/driver',
        transport_in_charge: '/transport-in-charge',
        admin: '/admin'
      };
      navigate(paths[role] || '/');
    } else if (user && userData === null) {
      setError(t('profile_error'));
      setIsSubmitting(false);
    }
  }, [role, user, userData, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <div className="absolute top-8 right-8">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white border border-slate-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/roles')}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary-600 mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            {t('change_role')}
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
            <Bus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {selectedRole ? t('login_title_role', { role: t(selectedRole) }) : t('welcome_back')}
          </h1>
          <p className="text-slate-500">{t('sign_in_to_continue')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <User size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!selectedRole && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('login_as')}</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">{t('select_role_option')}</option>
                <option value="student">{t('student')}</option>
                <option value="driver">{t('driver')}</option>
                <option value="transport_in_charge">{t('transport_in_charge')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('email_address')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                placeholder="yash@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-600/20 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              t('sign_in')
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          {t('no_account')} <span className="text-primary-600 font-medium cursor-pointer hover:underline">{t('contact_admin')}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
