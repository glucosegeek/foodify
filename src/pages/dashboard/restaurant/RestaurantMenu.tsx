import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Search, Filter, Eye, EyeOff, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  is_signature: boolean;
  is_seasonal: boolean;
  spice_level: number;
  preparation_time?: number;
  popularity_rank: number;
}

export function RestaurantMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Truffle Risotto',
      description: 'Creamy Arborio rice with black truffle, parmesan, and wild mushrooms',
      price: 28.99,
      category: 'Main Course',
      image_url: 'https://images.unsplash.com/photo-1476124369491-b79d2e6b1b4c?w=400',
      is_available: true,
      is_signature: true,
      is_seasonal: false,
      spice_level: 0,
      preparation_time: 25,
      popularity_rank: 95
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      description: 'Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil',
      price: 16.99,
      category: 'Pizza',
      image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      is_available: true,
      is_signature: false,
      is_seasonal: false,
      spice_level: 0,
      preparation_time: 15,
      popularity_rank: 88
    },
    {
      id: '3',
      name: 'Tiramisu',
      description: 'Traditional Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 9.99,
      category: 'Dessert',
      is_available: true,
      is_signature: true,
      is_seasonal: false,
      spice_level: 0,
      preparation_time: 5,
      popularity_rank: 92
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Main Course',
    is_available: true,
    is_signature: false,
    is_seasonal: false,
    spice_level: 0,
    preparation_time: 15
  });

  const categories = ['All', 'Appetizer', 'Main Course', 'Pizza', 'Pasta', 'Dessert', 'Beverage'];

  const handleSaveItem = () => {
    if (editingItem) {
      setMenuItems(prev => prev.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
      setEditingItem(null);
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        popularity_rank: 50
      } as MenuItem;
      setMenuItems(prev => [...prev, newItem]);
    }
    resetForm();
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddDialog(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, is_available: !item.is_available } : item
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      is_available: true,
      is_signature: false,
      is_seasonal: false,
      spice_level: 0,
      preparation_time: 15
    });
    setShowAddDialog(false);
    setEditingItem(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.is_available).length,
    signature: menuItems.filter(i => i.is_signature).length,
    seasonal: menuItems.filter(i => i.is_seasonal).length
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-2">Add, edit, and organize your menu items</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Signature Dishes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.signature}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Seasonal Items</p>
              <p className="text-2xl font-bold text-blue-600">{stats.seasonal}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddDialog && (
        <Card className="mb-6 border-2 border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <Button variant="ghost" onClick={resetForm}>✕</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Item Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Margherita Pizza"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your dish..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Price ($) *"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
              <Input
                label="Prep Time (min)"
                type="number"
                value={formData.preparation_time}
                onChange={(e) => setFormData({ ...formData, preparation_time: parseInt(e.target.value) })}
                placeholder="15"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spice Level
                </label>
                <select
                  value={formData.spice_level}
                  onChange={(e) => setFormData({ ...formData, spice_level: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value={0}>None</option>
                  <option value={1}>Mild 🌶️</option>
                  <option value={2}>Medium 🌶️🌶️</option>
                  <option value={3}>Hot 🌶️🌶️🌶️</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Available</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_signature}
                  onChange={(e) => setFormData({ ...formData, is_signature: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Signature Dish</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_seasonal}
                  onChange={(e) => setFormData({ ...formData, is_seasonal: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Seasonal Item</span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSaveItem} disabled={!formData.name || !formData.price}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`hover:shadow-lg transition-shadow ${!item.is_available ? 'opacity-60' : ''}`}>
            <CardContent className="p-0">
              {item.image_url && (
                <div className="relative h-48">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {item.is_signature && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Signature
                      </span>
                    )}
                    {item.is_seasonal && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Seasonal
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                  </div>
                  <p className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</p>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                  {item.preparation_time && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.preparation_time} min
                    </span>
                  )}
                  {item.spice_level > 0 && (
                    <span>{'🌶️'.repeat(item.spice_level)}</span>
                  )}
                  <span className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {item.popularity_rank}% popular
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(item.id)}
                    className="flex-1"
                  >
                    {item.is_available ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Unavailable
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first menu item to get started'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
