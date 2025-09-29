import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Store, 
  Menu, 
  MessageCircle, 
  Users, 
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Star
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

export function RestaurantDashboardLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    {
      name: 'Profil restauracji',
      href: '/dashboard/restaurant/profile',
      icon: Store,
      current: location.pathname === '/dashboard/restaurant/profile',
    },
    {
      name: 'Menu',
      href: '/dashboard/restaurant/menu',
      icon: Menu,
      current: location.pathname === '/dashboard/restaurant/menu',
    },
    {
      name: 'Opinie i komentarze',
      href: '/dashboard/restaurant/reviews',
      icon: MessageCircle,
      current: location.pathname === '/dashboard/restaurant/reviews',
    },
    {
      name: 'Obserwujący',
      href: '/dashboard/restaurant/followers',
      icon: Users,
      current: location.pathname === '/dashboard/restaurant/followers',
    },
    {
      name: 'Promocje i ogłoszenia',
      href: '/dashboard/restaurant/posts',
      icon: Megaphone,
      current: location.pathname === '/dashboard/restaurant/posts',
    },
    {
      name: 'Statystyki',
      href: '/dashboard/restaurant/analytics',
      icon: BarChart3,
      current: location.pathname === '/dashboard/restaurant/analytics',
    },
    {
      name: 'Ustawienia konta',
      href: '/dashboard/restaurant/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/restaurant/settings',
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const restaurantProfile = user?.profile as any;
  const newReviews = 2; // Mock new reviews count

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="flex flex-col h-full">
            {/* Restaurant info */}
            <div className="px-6 py-8 border-b border-gray-100">
              <div className="flex items-center">
                {restaurantProfile?.logo_url ? (
                  <img
                    src={restaurantProfile.logo_url}
                    alt="Restaurant Logo"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Store className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {restaurantProfile?.name || 'Restaurant'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {restaurantProfile?.average_rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    {getVerificationBadge(restaurantProfile?.verification_status)}
                  </div>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {restaurantProfile?.followers_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {restaurantProfile?.reviews_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-orange-600">
                    {restaurantProfile?.average_rating?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-6 py-6">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative',
                        {
                          'bg-orange-50 text-orange-700 border-r-4 border-orange-500': item.current,
                          'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !item.current,
                        }
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      
                      {/* Notification badge for reviews */}
                      {item.name === 'Opinie i komentarze' && newReviews > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {newReviews}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom section */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}