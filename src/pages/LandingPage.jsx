import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Shield, UserCheck, BarChart3, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="text-primary-600" size={28} />
            <span className="text-xl font-bold text-slate-900">SafeRide+</span>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-1.5 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="te">TE</option>
            </select>
            <Link 
              to="/roles" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary-600/20"
            >
              {t('get_started')}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/roles" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all">
                {t('login_to_dashboard')}
              </Link>
              <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all">
                {t('learn_more')}
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('student_safety')}</h3>
              <p className="text-slate-600">{t('student_safety_desc')}</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <UserCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('driver_performance')}</h3>
              <p className="text-slate-600">{t('driver_perf_desc')}</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{t('smart_analytics_title')}</h3>
              <p className="text-slate-600">{t('smart_analytics_desc')}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-900 text-slate-400 text-center">
        <p>&copy; 2026 SafeRide+. {t('copyright')}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
