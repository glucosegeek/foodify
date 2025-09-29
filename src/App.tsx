import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { RestaurantPage } from './pages/RestaurantPage';
// UWAGA: NIE importujemy starego DashboardLayout!
// import { DashboardLayout } from './components/dashboard/DashboardLayout'; // ❌ USUŃ TO
import { CustomerDashboardLayout } from './components/dashboard/CustomerDashboardLayout';
import { RestaurantDashboardLayout } from './components/dashboard/RestaurantDashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            
            {/* Customer Dashboard */}
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Customer Overview - Coming Soon</h1></div>} />
              <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Customer Profile - Coming Soon</h1></div>} />
              <Route path="activities" element={<div className="p-8"><h1 className="text-2xl font-bold">Activities - Coming Soon</h1></div>} />
              <Route path="following" element={<div className="p-8"><h1 className="text-2xl font-bold">Following - Coming Soon</h1></div>} />
              <Route path="favorites" element={<div className="p-8"><h1 className="text-2xl font-bold">Favorites - Coming Soon</h1></div>} />
              <Route path="notifications" element={<div className="p-8"><h1 className="text-2xl font-bold">Notifications - Coming Soon</h1></div>} />
              <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
            </Route>

            {/* Restaurant Dashboard */}
            <Route
              path="/dashboard/restaurant"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['RESTAURANT']}>
                    <RestaurantDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Restaurant Overview - Coming Soon</h1></div>} />
              <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Restaurant Profile - Coming Soon</h1></div>} />
              <Route path="menu" element={<div className="p-8"><h1 className="text-2xl font-bold">Menu Management - Coming Soon</h1></div>} />
              <Route path="reviews" element={<div className="p-8"><h1 className="text-2xl font-bold">Reviews - Coming Soon</h1></div>} />
              <Route path="followers" element={<div className="p-8"><h1 className="text-2xl font-bold">Followers - Coming Soon</h1></div>} />
              <Route path="promotions" element={<div className="p-8"><h1 className="text-2xl font-bold">Promotions - Coming Soon</h1></div>} />
              <Route path="stats" element={<div className="p-8"><h1 className="text-2xl font-bold">Statistics - Coming Soon</h1></div>} />
              <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
            </Route>

            {/* Legacy redirect */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['CUSTOMER', 'RESTAURANT', 'ADMIN']} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;