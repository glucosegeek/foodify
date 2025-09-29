import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';

interface RoleBasedRouteProps {
  children?: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to appropriate dashboard if user is on /dashboard
    if (user && window.location.pathname === '/dashboard') {
      switch (user.role) {
        case 'CUSTOMER':
          navigate('/dashboard/customer', { replace: true });
          break;
        case 'RESTAURANT':
          navigate('/dashboard/restaurant', { replace: true });
          break;
        case 'ADMIN':
          navigate('/dashboard/admin', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard for user's role
    switch (user.role) {
      case 'CUSTOMER':
        return <Navigate to="/dashboard/customer" replace />;
      case 'RESTAURANT':
        return <Navigate to="/dashboard/restaurant" replace />;
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}