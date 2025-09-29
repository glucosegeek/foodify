import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Home,
  Building2, 
  Menu, 
  MessageSquare, 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings,
  Badge
} from 'lucide-react';
import { clsx } from 'clsx';

export function RestaurantDashboardLayout() {
  const location = useLocation();

  const navigation = [
    {
      name: 'Przegląd',
      href: '/dashboard/restaurant',
      icon: Home,
      current: location.pathname === '/dashboard/restaurant',
    },
    {
      name: 'Profil Restauracji',
      href: '/dashboard/restaurant/profile',
      icon: Building2,
      current: location.pathname === '/dashboard/restaurant/profile',
    },
    {
      name: 'Zarządzanie Menu',
      href: '/dashboard/restaurant/menu',
      icon: Menu,
      current: location.pathname === '/dashboard/restaurant/menu',
    },
    {
      name: 'Opinie i Komentarze',
      href: '/dashboard/restaurant/reviews',
      icon: MessageSquare,
      current: location.pathname === '/dashboard/restaurant/reviews',
    },
    {
      name: 'Obserwujący',
      href: '/dashboard/restaurant/followers',
      icon: Users,
      current: location.pathname === '/dashboard/restaurant/followers',
    },
    {
      name: 'Promocje i Ogłoszenia',
      href: '/dashboard/restaurant/promotions',
      icon: Megaphone,
      current: location.pathname === '/dashboard/restaurant/promotions',
    },
    {
      name: 'Statystyki',
      href: '/dashboard/restaurant/stats',
      icon: BarChart3,
      current: location.pathname === '/dashboard/restaurant/stats',
    },
    {
      name: 'Ustawienia Konta',
      href: '/dashboard/restaurant/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/restaurant/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="px-6 py-8">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Panel Restauracji</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Zweryfikowana</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Zarządzaj swoją restauracją</p>
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

            {/* Quick Stats Sidebar */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <h3 className="font-semibold text-sm mb-3">Szybkie statystyki</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Dzisiejsze odwiedziny:</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nowe opinie:</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obserwujący:</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                </div>
              </div>
            </div>
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