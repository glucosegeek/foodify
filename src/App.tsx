import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { NotFound } from './pages/NotFound';

// Customer Components
import { CustomerDashboardLayout } from './components/dashboard/CustomerDashboardLayout';
import { CustomerSettingsPage } from './pages/dashboard/customer/CustomerSettingsPage';
import { CustomerOverview } from './pages/dashboard/customer/CustomerOverview';
import { CustomerProfile } from './pages/dashboard/customer/CustomerProfile';
import { CustomerActivities } from './pages/dashboard/customer/CustomerActivities';
import { CustomerFollowing } from './pages/dashboard/customer/CustomerFollowing';
import { CustomerFavorites } from './pages/dashboard/customer/CustomerFavorites';
import { CustomerSettings } from './pages/dashboard/customer/CustomerSettings';

// Restaurant Components
import { RestaurantDashboardLayout } from './components/dashboard/RestaurantDashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { RestaurantProfilePage } from './pages/dashboard/RestaurantProfilePage';
import { RestaurantMenu } from './pages/dashboard/restaurant/RestaurantMenu';
import { RestaurantProfile } from './pages/dashboard/restaurant/RestaurantProfile';
import { RestaurantReviews } from './pages/dashboard/restaurant/RestaurantReviews';
import { RestaurantFollowers } from './pages/dashboard/restaurant/RestaurantFollowers';
import { RestaurantSettings } from './pages/dashboard/restaurant/RestaurantSettings';
import { RestaurantAnalytics } from './pages/dashboard/restaurant/RestaurantAnalytics';

// Public Restaurant Pages
import { RestaurantPage } from './pages/RestaurantPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';

// Protected Routes
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/restaurants" element={<RestaurantPage />} />
            <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />

            {/* Customer Dashboard Routes */}
            <Route
              path="/customer/*"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="customer">
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
              <Route path="settings" element={<CustomerSettings />} />
            </Route>

            {/* Restaurant Dashboard Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRole="restaurant">
                    <RestaurantDashboardLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<RestaurantProfilePage />} />
              <Route path="menu" element={<RestaurantMenu />} />
              <Route path="reviews" element={<RestaurantReviews />} />
              <Route path="followers" element={<RestaurantFollowers />} />
              <Route path="analytics" element={<RestaurantAnalytics />} />
              <Route path="settings" element={<RestaurantSettings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;