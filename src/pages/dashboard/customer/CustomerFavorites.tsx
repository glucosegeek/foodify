import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Plus, Edit2, Trash2, Lock, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockFavoriteLists, FavoriteList } from '../../../data/mockCustomerData';

export function CustomerFavorites() {
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>(mockFavoriteLists);
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListPublic, setNewListPublic] = useState(true);

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList: FavoriteList = {
        id: Date.now().toString(),
        name: newListName,
        description: newListDescription || undefined,
        restaurants: [],
        created_at: new Date().toISOString(),
        is_public: newListPublic
      };
      setFavoriteLists([newList, ...favoriteLists]);
      setNewListName('');
      setNewListDescription('');
      setNewListPublic(true);
      setShowNewListDialog(false);
    }
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      setFavoriteLists(prev => prev.filter(list => list.id !== listId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-2">Organize your favorite restaurants into lists</p>
          </div>
          <Button onClick={() => setShowNewListDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New List
          </Button>
        </div>
      </div>

      {showNewListDialog && (
        <Card className="mb-6 border-2 border-orange-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Create New List</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Date Night Spots, Quick Lunch"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="What makes this list special?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="listPublic"
                  checked={newListPublic}
                  onChange={(e) => setNewListPublic(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="listPublic" className="text-sm text-gray-700">
                  Make this list public (others can view it)
                </label>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                  Create List
                </Button>
                <Button variant="outline" onClick={() => setShowNewListDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {favoriteLists.length > 0 ? (
        <div className="space-y-6">
          {favoriteLists.map((list) => (
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900">{list.name}</h2>
                      {list.is_public ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </span>
                      )}
                    </div>
                    {list.description && (
                      <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {list.restaurants.length} restaurants • Created {formatDate(list.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteList(list.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {list.restaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {list.restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                      >
                        {restaurant.logo_url ? (
                          <img
                            src={restaurant.logo_url}
                            alt={restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link to={`/restaurant/${restaurant.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">
                              {restaurant.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600">{restaurant.cuisine_type}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-700 ml-1">{restaurant.rating}</span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">{restaurant.price_range}</span>
                          </div>
                          {restaurant.note && (
                            <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">
                              "{restaurant.note}"
                            </p>
                          )}
                        </div>
                        <Link to={`/restaurant/${restaurant.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No restaurants in this list yet</p>
                    <Link to="/">
                      <Button variant="outline" size="sm" className="mt-3">
                        Add Restaurants
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Favorite Lists Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create lists to organize your favorite restaurants by occasion, cuisine, or any category you like.
            </p>
            <Button onClick={() => setShowNewListDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
