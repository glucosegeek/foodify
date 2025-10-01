import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { RoleGuard } from './components/RoleGuard';

// Dashboard Layouts
import { CustomerDashboardLayout } from './components/dashboard/CustomerDashboardLayout';
import { RestaurantDashboardLayout } from './components/dashboard/RestaurantDashboardLayout';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';

// Customer Pages
import { 
  CustomerProfile, 
  CustomerActivities, 
  CustomerFollowing, 
  CustomerFavorites, 
  CustomerNotifications, 
  CustomerSettings 
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

// Placeholder components (zostaną zastąpione rzeczywistymi komponentami)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600 mt-2">This page is under construction.</p>
  </div>
);

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

            {/* Dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <Navigate to="/dashboard/overview" replace />
              }
            />

            {/* Old dashboard overview (for backward compatibility) */}
            <Route
              path="/dashboard/overview"
              element={
                <RoleGuard allowedRoles={['CUSTOMER', 'RESTAURANT', 'ADMIN']}>
                  <DashboardLayout />
                </RoleGuard>
              }
            >
              <Route index element={<DashboardOverview />} />
            </Route>

            {/* Customer Dashboard */}
            <Route
              path="/dashboard/customer"
              element={
                <RoleGuard allowedRoles={['CUSTOMER']}>
                  <CustomerDashboardLayout />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to="/dashboard/customer/profile" replace />} />
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

            {/* Fallback routes for unavailable pages */}
            <Route path="/dashboard/profile" element={<PlaceholderPage title="Restaurant Profile - Coming Soon" />} />
            <Route path="/dashboard/menu" element={<PlaceholderPage title="Menu Management - Coming Soon" />} />
            <Route path="/dashboard/menu/add" element={<PlaceholderPage title="Add Menu Item - Coming Soon" />} />
            <Route path="/dashboard/analytics" element={<PlaceholderPage title="Analytics - Coming Soon" />} />
            <Route path="/dashboard/settings" element={<PlaceholderPage title="Settings - Coming Soon" />} />

            {/* 404 route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;