import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, UserCog, Bus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const roles = [
    {
      id: 'student',
      title: t('student'),
      description: t('student_desc'),
      icon: <User size={32} />,
      color: 'bg-blue-500',
      hover: 'hover:bg-blue-600'
    },
    {
      id: 'driver',
      title: t('driver'),
      description: t('driver_desc'),
      icon: <Bus size={32} />,
      color: 'bg-green-500',
      hover: 'hover:bg-green-600'
    },
    {
      id: 'transport_in_charge',
      title: t('transport_in_charge'),
      description: t('in_charge_desc'),
      icon: <ShieldCheck size={32} />,
      color: 'bg-amber-500',
      hover: 'hover:bg-amber-600'
    },
    {
      id: 'admin',
      title: t('admin'),
      description: t('admin_desc'),
      icon: <UserCog size={32} />,
      color: 'bg-indigo-500',
      hover: 'hover:bg-indigo-600'
    }
  ];

  const handleRoleSelect = (roleId) => {
    navigate(`/login?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
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

      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('role_selection_title')}</h1>
        <p className="text-lg text-slate-600">{t('role_selection_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1 group"
          >
            <div className={`w-16 h-16 ${role.color} text-white rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg shadow-current/20`}>
              {role.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{role.description}</p>
            <div className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-600 font-semibold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
              {t('continue_as', { role: role.title })}
            </div>
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/')}
        className="mt-12 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        {t('back_to_home')}
      </button>
    </div>
  );
};

export default RoleSelectionPage;
