import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { DollarSign, Leaf, AlertCircle } from 'lucide-react';
import { Database } from '../../types/database';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuCategory = Database['public']['Tables']['menu_categories']['Row'];

interface MenuItemWithCategory extends MenuItem {
  category?: MenuCategory;
}

interface RestaurantMenuProps {
  menuItems: MenuItemWithCategory[];
  categories: MenuCategory[];
}

export function RestaurantMenu({ menuItems, categories }: RestaurantMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group menu items by category
  const menuByCategory = categories.reduce((acc, category) => {
    acc[category.id] = menuItems.filter(
      (item) => item.category_id === category.id && item.is_available
    );
    return acc;
  }, {} as Record<string, MenuItemWithCategory[]>);

  // Items without category
  const uncategorizedItems = menuItems.filter(
    (item) => !item.category_id && item.is_available
  );

  const renderPriceRange = (price: number) => {
    return (
      <div className="flex items-center text-green-600 font-semibold">
        <DollarSign className="h-4 w-4" />
        <span>{price.toFixed(2)}</span>
      </div>
    );
  };

  const renderDietaryTags = (tags: string[] | null) => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            <Leaf className="h-3 w-3 mr-1" />
            {tag.replace('_', ' ')}
          </span>
        ))}
      </div>
    );
  };

  const renderAllergens = (allergens: string[] | null) => {
    if (!allergens || allergens.length === 0) return null;

    return (
      <div className="flex items-start mt-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>
          <strong>Allergens:</strong> {allergens.join(', ')}
        </span>
      </div>
    );
  };

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No menu items available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items by Category */}
      {filteredCategories.map((category) => {
        const items = menuByCategory[category.id];
        if (!items || items.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 mt-1">{category.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <Card key={item.id} hover>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {item.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          {renderPriceRange(item.price)}
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {renderDietaryTags(item.dietary_tags)}
                        {renderAllergens(item.allergens)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Uncategorized Items */}
      {uncategorizedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Other Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uncategorizedItems.map((item) => (
              <Card key={item.id} hover>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {item.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        {renderPriceRange(item.price)}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {renderDietaryTags(item.dietary_tags)}
                      {renderAllergens(item.allergens)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}