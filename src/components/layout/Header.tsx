import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogOut, Settings, Shield, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';

    switch (user.role) {
      case 'CUSTOMER':
        return '/dashboard/customer';
      case 'RESTAURANT':
        return '/dashboard/restaurant';
      case 'ADMIN':
        return '/dashboard/customer';
      default:
        return '/dashboard';
    }
  };

  const getRoleIcon = () => {
    if (!user) return User;
    
    switch (user.role) {
      case 'RESTAURANT':
        return Store;
      case 'ADMIN':
        return Shield;
      default:
        return User;
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'CUSTOMER':
        return 'Customer';
      case 'RESTAURANT':
        return 'Restaurant';
      case 'ADMIN':
        return 'Admin';
      default:
        return '';
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">MenuHub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Discover
            </Link>
            <Link
              to="/top-restaurants"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Top Restaurants
            </Link>
            {user && (
              <Link
                to={getDashboardLink()}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <RoleIcon className="h-4 w-4 text-gray-500" />
                  <div className="hidden sm:block">
                    <span className="text-xs text-gray-500 uppercase font-medium">
                      {getRoleLabel()}
                    </span>
                    <div className="text-sm text-gray-700 font-medium">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <Link to={getDashboardLink()}>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}