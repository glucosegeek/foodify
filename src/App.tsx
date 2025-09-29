import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { CustomerDashboardLayout } from './components/dashboard/CustomerDashboardLayout';
import { RestaurantDashboardLayout } from './components/dashboard/RestaurantDashboardLayout';
import { AdminDashboardLayout } from './components/dashboard/AdminDashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';

// Customer Dashboard Pages
import { CustomerOverview } from './pages/dashboard/customer/CustomerOverview';
import { CustomerProfile } from './pages/dashboard/customer/CustomerProfile';
import { CustomerActivities } from './pages/dashboard/customer/CustomerActivities';
import { CustomerFollowing } from './pages/dashboard/customer/CustomerFollowing';
import { CustomerFavorites } from './pages/dashboard/customer/CustomerFavorites';
import { CustomerNotifications } from './pages/dashboard/customer/CustomerNotifications';
import { CustomerSettings } from './pages/dashboard/customer/CustomerSettings';

// Restaurant Dashboard Pages
import { RestaurantOverview } from './pages/dashboard/restaurant/RestaurantOverview';
import { RestaurantProfile } from './pages/dashboard/restaurant/RestaurantProfile';
import { RestaurantMenu } from './pages/dashboard/restaurant/RestaurantMenu';
import { RestaurantReviews } from './pages/dashboard/restaurant/RestaurantReviews';
import { RestaurantFollowers } from './pages/dashboard/restaurant/RestaurantFollowers';
import { RestaurantPromotions } from './pages/dashboard/restaurant/RestaurantPromotions';
import { RestaurantStats } from './pages/dashboard/restaurant/RestaurantStats';
import { RestaurantSettings } from './pages/dashboard/restaurant/RestaurantSettings';

// Admin Dashboard Pages
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';

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
              <Route index element={<CustomerOverview />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="activities" element={<CustomerActivities />} />
              <Route path="following" element={<CustomerFollowing />} />
              <Route path="favorites" element={<CustomerFavorites />} />
              <Route path="notifications" element={<CustomerNotifications />} />
              <Route path="settings" element={<CustomerSettings />} />
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
              <Route index element={<RestaurantOverview />} />
              <Route path="profile" element={<RestaurantProfile />} />
              <Route path="menu" element={<RestaurantMenu />} />
              <Route path="reviews" element={<RestaurantReviews />} />
              <Route path="followers" element={<RestaurantFollowers />} />
              <Route path="promotions" element={<RestaurantPromotions />} />
              <Route path="stats" element={<RestaurantStats />} />
              <Route path="settings" element={<RestaurantSettings />} />
            </Route>

            {/* Admin Dashboard */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
            </Route>

            {/* Legacy redirect - redirect old /dashboard to role-specific dashboard */}
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