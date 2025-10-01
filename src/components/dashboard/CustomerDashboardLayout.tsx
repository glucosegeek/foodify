import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  User, 
  Activity, 
  Users, 
  Heart, 
  Bell, 
  Settings,
  Home
} from 'lucide-react';
import { clsx } from 'clsx';

export function CustomerDashboardLayout() {
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard/customer/overview',
      icon: Home,
      current: location.pathname === '/dashboard/customer' || location.pathname === '/dashboard/customer/overview',
    },
    {
      name: 'My Profile',
      href: '/dashboard/customer/profile',
      icon: User,
      current: location.pathname === '/dashboard/customer/profile',
    },
    {
      name: 'My Activities',
      href: '/dashboard/customer/activities',
      icon: Activity,
      current: location.pathname === '/dashboard/customer/activities',
    },
    {
      name: 'Following',
      href: '/dashboard/customer/following',
      icon: Users,
      current: location.pathname === '/dashboard/customer/following',
    },
    {
      name: 'Favorites',
      href: '/dashboard/customer/favorites',
      icon: Heart,
      current: location.pathname === '/dashboard/customer/favorites',
    },
    {
      name: 'Notifications',
      href: '/dashboard/customer/notifications',
      icon: Bell,
      current: location.pathname === '/dashboard/customer/notifications',
    },
    {
      name: 'Settings',
      href: '/dashboard/customer/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/customer/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900">Customer Dashboard</h2>
              <p className="text-sm text-gray-600 mt-2">Manage your profile</p>
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
                          'bg-blue-50 text-blue-700 border-r-4 border-blue-500': item.current,
                          'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !item.current,
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