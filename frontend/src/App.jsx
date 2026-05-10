import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import { Toaster } from 'react-hot-toast'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentComplaints from './pages/StudentComplaints'
import DriverDashboard from './pages/DriverDashboard'
import DriverBreakdown from './pages/DriverBreakdown'
import InChargeDashboard from './pages/InChargeDashboard'
import InChargeComplaints from './pages/InChargeComplaints'
import InChargePerformance from './pages/InChargePerformance'
import DriverPerformanceDetail from './pages/DriverPerformanceDetail'
import AdminDashboard from './pages/AdminDashboard'

// Dashboards (Placeholders)
const Dashboard = ({ title }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-32 animate-pulse" />
      ))}
    </div>
  </div>
)

import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/roles" element={<RoleSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<div>Unauthorized access</div>} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/complaint" element={<StudentComplaints />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/driver/breakdown" element={<DriverBreakdown />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['transport_in_charge', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/transport-in-charge" element={<InChargeDashboard />} />
                <Route path="/transport-in-charge/complaints" element={<InChargeComplaints />} />
                <Route path="/transport-in-charge/performance" element={<InChargePerformance />} />
                <Route path="/transport-in-charge/performance/:driverId" element={<DriverPerformanceDetail />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin', 'transport_in_charge']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/manage" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
