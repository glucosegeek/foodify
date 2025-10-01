import React, { useState } from 'react';
import { Leaf, Flame } from 'lucide-react';
import type { MenuCategory, MenuItem } from '../../types/restaurant';

interface RestaurantMenuProps {
  categories: MenuCategory[];
}

export function RestaurantMenu({ categories }: RestaurantMenuProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);
  };

  const getSpiceIcon = (level?: string) => {
    if (!level || level === 'mild') return null;
    
    const flames = level === 'medium' ? 1 : level === 'hot' ? 2 : 3;
    return (
      <div className="flex">
        {[...Array(flames)].map((_, i) => (
          <Flame key={i} className="h-4 w-4 text-red-500 fill-current" />
        ))}
      </div>
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
            <div className="flex items-center space-x-1">
              {item.is_vegetarian && (
                <Leaf className="h-4 w-4 text-green-500" title="Wegetariańskie" />
              )}
              {item.is_vegan && (
                <Leaf className="h-4 w-4 text-green-600" title="Wegańskie" />
              )}
              {getSpiceIcon(item.spice_level)}
            </div>
          </div>
          <p className="text-gray-600 mb-3 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-orange-600">
              {formatPrice(item.price)}
            </span>
            {(item.is_gluten_free || item.is_vegetarian || item.is_vegan) && (
              <div className="flex space-x-1">
                {item.is_gluten_free && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Bezglutenowe
                  </span>
                )}
                {item.is_vegetarian && !item.is_vegan && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Wegetariańskie
                  </span>
                )}
                {item.is_vegan && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Wegańskie
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-20 h-20 rounded-lg object-cover ml-4"
          />
        )}
      </div>
    </div>
  );

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu</h3>
        <p className="text-gray-500">Menu będzie dostępne wkrótce.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Menu</h3>
      
      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        {categories
          .find(cat => cat.id === activeCategory)
          ?.items.map(renderMenuItem)}
      </div>
    </div>
  );
}