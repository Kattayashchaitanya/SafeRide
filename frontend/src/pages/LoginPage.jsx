import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Mail, Lock, Loader2, User, ChevronLeft } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role');

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
      setError('Invalid email or password');
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
      setError('Unable to load your profile. Please check Firebase Firestore permissions.');
      setIsSubmitting(false);
    }
  }, [role, user, userData, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/roles')}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary-600 mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Change Role
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
            <Bus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {selectedRole ? `${selectedRole.replace(/_/g, ' ')} Login` : 'Welcome Back'}
          </h1>
          <p className="text-slate-500">Sign in to SafeRide+ to continue</p>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Login As</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="driver">Driver</option>
                <option value="transport_in_charge">Transport In-Charge</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
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
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Don't have an account? <span className="text-primary-600 font-medium cursor-pointer hover:underline">Contact Administrator</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
