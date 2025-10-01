import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section id="discover" className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 text-white overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Amazing
            <span className="block text-yellow-200">Local Restaurants</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Explore menus, discover new flavors, and find your next favorite meal
            from the best restaurants in your area.
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full sm:w-48 pl-10 pr-4 py-3 text-gray-900 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <Button size="lg" className="whitespace-nowrap">
                Find Restaurants
              </Button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-orange-100">Partner Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">Menu Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-orange-100">Cuisine Types</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}