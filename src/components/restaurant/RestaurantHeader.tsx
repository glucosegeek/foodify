import React from 'react';
import { MapPin, Phone, Globe, Star, DollarSign, Clock } from 'lucide-react';
import type { Restaurant } from '../../types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium text-gray-700">{rating}</span>
        <span className="ml-1 text-gray-500">
          ({restaurant.review_count || 0} opinii)
        </span>
      </div>
    );
  };

  const renderPriceRange = (priceRange: string) => {
    return (
      <div className="flex items-center text-green-600">
        {[...Array(4)].map((_, i) => (
          <DollarSign
            key={i}
            className={`h-5 w-5 ${
              i < priceRange.length ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
      <div className="relative h-64 bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end space-x-6">
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover"
            />
            <div className="flex-1 text-white">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {restaurant.cuisine_type}
                </span>
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {restaurant.dining_style}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">O restauracji</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {restaurant.description}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3 text-orange-500" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-3 text-orange-500" />
                <a href={`tel:${restaurant.phone}`} className="hover:text-orange-500 transition-colors">
                  {restaurant.phone}
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="h-5 w-5 mr-3 text-orange-500" />
                <a 
                  href={restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition-colors"
                >
                  Strona internetowa
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Oceny i szczegóły</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Ocena</label>
                {renderStars(restaurant.rating)}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Zakres cenowy</label>
                {renderPriceRange(restaurant.price_range)}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Specjalność</label>
                <p className="text-orange-600 font-medium">{restaurant.standout_dish}</p>
              </div>

              {restaurant.dietary_options.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Opcje dietetyczne</label>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.dietary_options.map(option => (
                      <span
                        key={option}
                        className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}