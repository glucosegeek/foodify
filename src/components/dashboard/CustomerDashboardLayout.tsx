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
      name: 'Przegląd',
      href: '/dashboard/customer',
      icon: Home,
      current: location.pathname === '/dashboard/customer',
    },
    {
      name: 'Mój Profil',
      href: '/dashboard/customer/profile',
      icon: User,
      current: location.pathname === '/dashboard/customer/profile',
    },
    {
      name: 'Moje Aktywności',
      href: '/dashboard/customer/activities',
      icon: Activity,
      current: location.pathname === '/dashboard/customer/activities',
    },
    {
      name: 'Obserwowane',
      href: '/dashboard/customer/following',
      icon: Users,
      current: location.pathname === '/dashboard/customer/following',
    },
    {
      name: 'Ulubione',
      href: '/dashboard/customer/favorites',
      icon: Heart,
      current: location.pathname === '/dashboard/customer/favorites',
    },
    {
      name: 'Powiadomienia',
      href: '/dashboard/customer/notifications',
      icon: Bell,
      current: location.pathname === '/dashboard/customer/notifications',
    },
    {
      name: 'Ustawienia',
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
              <h2 className="text-2xl font-bold text-gray-900">Panel Klienta</h2>
              <p className="text-sm text-gray-600 mt-2">Zarządzaj swoim profilem</p>
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