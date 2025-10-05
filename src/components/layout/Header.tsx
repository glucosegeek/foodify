import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
                to={profile?.role === 'restaurant' ? '/dashboard' : '/profile'}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {profile?.role === 'restaurant' ? 'Dashboard' : 'Profile'}
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={profile?.role === 'restaurant' ? '/dashboard/settings' : '/profile/settings'}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Avatar'}
                      className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-sm font-semibold text-orange-600">
                        {(profile?.full_name || profile?.username || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600 hidden sm:inline max-w-[150px] truncate">
                    {profile?.full_name || profile?.username || user.email}
                  </span>
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
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}