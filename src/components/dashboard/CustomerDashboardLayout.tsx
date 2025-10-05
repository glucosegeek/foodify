import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, User, Heart, Users, Settings, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export function CustomerDashboardLayout() {
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/customer',
      icon: Home,
      current: location.pathname === '/customer',
    },
    {
      name: 'Profile',
      href: '/customer/profile',
      icon: User,
      current: location.pathname === '/customer/profile',
    },
    {
      name: 'Activities',
      href: '/customer/activities',
      icon: Activity,
      current: location.pathname === '/customer/activities',
    },
    {
      name: 'Following',
      href: '/customer/following',
      icon: Users,
      current: location.pathname === '/customer/following',
    },
    {
      name: 'Favorites',
      href: '/customer/favorites',
      icon: Heart,
      current: location.pathname === '/customer/favorites',
    },
    {
      name: 'Settings',
      href: '/customer/settings',
      icon: Settings,
      current: location.pathname === '/customer/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="flex flex-col h-full">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
              <p className="text-sm text-gray-600 mt-2">Customer Dashboard</p>
            </div>

            <nav className="flex-1 px-6 pb-6">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                        {
                          'bg-orange-50 text-orange-700 border-r-4 border-orange-500':
                            item.current,
                          'text-gray-600 hover:bg-gray-50 hover:text-gray-900':
                            !item.current,
                        }
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}