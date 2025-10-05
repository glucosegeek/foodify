import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRole: 'customer' | 'restaurant';
}

export function RoleBasedRoute({ children, allowedRole }: RoleBasedRouteProps) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  if (profile.role !== allowedRole) {
    // Redirect based on actual role
    const redirectPath = profile.role === 'restaurant' ? '/dashboard' : '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}