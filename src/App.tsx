import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { RestaurantProfilePage } from './pages/dashboard/RestaurantProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Customer Routes */}
            <Route
              path="/profile/settings"
              element={
                <ProtectedRoute>
                  <CustomerSettingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Restaurant Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<RestaurantProfilePage />} />
              <Route path="menu" element={<div className="p-8"><h1 className="text-2xl font-bold">Menu Management - Coming Soon</h1></div>} />
              <Route path="menu/add" element={<div className="p-8"><h1 className="text-2xl font-bold">Add Menu Item - Coming Soon</h1></div>} />
              <Route path="analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics - Coming Soon</h1></div>} />
              <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;