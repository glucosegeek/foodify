import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { RoleGuard } from './components/RoleGuard';

// Dashboard Layouts
import { CustomerDashboardLayout } from './components/dashboard/CustomerDashboardLayout';
import { RestaurantDashboardLayout } from './components/dashboard/RestaurantDashboardLayout';

// Customer Pages
import {
  CustomerProfile,
  CustomerActivities,
  CustomerFollowing,
  CustomerFavorites,
  CustomerNotifications,
  CustomerSettings,
  CustomerOverview
} from './pages/dashboard/customer';

// Restaurant Pages
import { 
  RestaurantProfile,
  RestaurantMenu,
  RestaurantReviews,
  RestaurantFollowers,
  RestaurantPosts,
  RestaurantAnalytics,
  RestaurantSettings
} from './pages/dashboard/restaurant';

// Dashboard redirect component
function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  switch (user.role) {
    case 'CUSTOMER':
      return <Navigate to="/dashboard/customer/overview" replace />;
    case 'RESTAURANT':
      return <Navigate to="/dashboard/restaurant/profile" replace />;
    case 'ADMIN':
      return <Navigate to="/dashboard/customer/overview" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

            {/* Dashboard redirect - routes to role-based dashboard */}
            <Route
              path="/dashboard"
              element={
                <RoleGuard allowedRoles={['CUSTOMER', 'RESTAURANT', 'ADMIN']}>
                  <DashboardRedirect />
                </RoleGuard>
              }
            />

            {/* Customer Dashboard */}
            <Route
              path="/dashboard/customer"
              element={
                <RoleGuard allowedRoles={['CUSTOMER']}>
                  <CustomerDashboardLayout />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard/customer/overview" replace />} />
              <Route path="overview" element={<CustomerOverview />} />
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
                <RoleGuard allowedRoles={['RESTAURANT']}>
                  <RestaurantDashboardLayout />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard/restaurant/profile" replace />} />
              <Route path="profile" element={<RestaurantProfile />} />
              <Route path="menu" element={<RestaurantMenu />} />
              <Route path="reviews" element={<RestaurantReviews />} />
              <Route path="followers" element={<RestaurantFollowers />} />
              <Route path="posts" element={<RestaurantPosts />} />
              <Route path="analytics" element={<RestaurantAnalytics />} />
              <Route path="settings" element={<RestaurantSettings />} />
            </Route>


            {/* 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;