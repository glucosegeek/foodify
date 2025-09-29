import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListRestart as Restaurant, Menu, Settings, BarChart3, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Restaurant Profile',
      href: '/dashboard/profile',
      icon: Restaurant,
      current: location.pathname === '/dashboard/profile',
    },
    {
      name: 'Menu Items',
      href: '/dashboard/menu',
      icon: Menu,
      current: location.pathname === '/dashboard/menu',
    },
    {
      name: 'Add Menu Item',
      href: '/dashboard/menu/add',
      icon: PlusCircle,
      current: location.pathname === '/dashboard/menu/add',
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      current: location.pathname === '/dashboard/analytics',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h2>
              <p className="text-sm text-gray-600 mt-2">Manage your restaurant</p>
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
                          'bg-orange-50 text-orange-700 border-r-4 border-orange-500': item.current,
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