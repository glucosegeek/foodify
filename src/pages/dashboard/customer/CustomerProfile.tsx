import React, { useState } from 'react';
import { Camera, Edit2, Save, X, MapPin, Calendar } from 'lucide-react';
import { useAuth, CustomerProfile as CustomerProfileType } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function CustomerProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const customerProfile = user?.profile as CustomerProfileType;
  
  const [formData, setFormData] = useState({
    username: customerProfile?.username || '',
    bio: customerProfile?.bio || '',
    location: customerProfile?.location || '',
    favorite_cuisines: customerProfile?.favorite_cuisines || []
  });

  const [newCuisine, setNewCuisine] = useState('');

  const cuisineOptions = [
    'Italian', 'Japanese', 'Chinese', 'Thai', 'Mexican', 'Indian', 
    'French', 'American', 'Mediterranean', 'Korean', 'Vietnamese', 
    'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Ethiopian'
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: customerProfile?.username || '',
      bio: customerProfile?.bio || '',
      location: customerProfile?.location || '',
      favorite_cuisines: customerProfile?.favorite_cuisines || []
    });
    setIsEditing(false);
  };

  const addCuisine = () => {
    if (newCuisine && !formData.favorite_cuisines.includes(newCuisine)) {
      setFormData({
        ...formData,
        favorite_cuisines: [...formData.favorite_cuisines, newCuisine]
      });
      setNewCuisine('');
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFormData({
      ...formData,
      favorite_cuisines: formData.favorite_cuisines.filter(c => c !== cuisine)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} loading={loading} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                {customerProfile?.avatar_url ? (
                  <img
                    src={customerProfile.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <Camera className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                
                {isEditing && (
                  <button className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {customerProfile?.username || 'User'}
              </h2>
              <p className="text-gray-500 mb-4">{user?.email}</p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerProfile?.reviews_count || 0}
                  </p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerProfile?.photos_count || 0}
                  </p>
                  <p className="text-sm text-gray-600">Photos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerProfile?.followers_count || 0}
                  </p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <Input
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Enter your username"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tell us about yourself and your food preferences..."
                    />
                  </div>
                  
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Your city or location"
                  />
                </>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Username</h4>
                    <p className="text-gray-900">{customerProfile?.username || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
                    <p className="text-gray-900">{customerProfile?.bio || 'No bio added yet'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </h4>
                    <p className="text-gray-900">{customerProfile?.location || 'Not specified'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Favorite Cuisines */}
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Favorite Cuisines</h3>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <select
                      value={newCuisine}
                      onChange={(e) => setNewCuisine(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a cuisine</option>
                      {cuisineOptions
                        .filter(cuisine => !formData.favorite_cuisines.includes(cuisine))
                        .map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                    <Button onClick={addCuisine} disabled={!newCuisine}>
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.favorite_cuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                      >
                        {cuisine}
                        <button
                          onClick={() => removeCuisine(cuisine)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {customerProfile?.favorite_cuisines?.length ? (
                    customerProfile.favorite_cuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                      >
                        {cuisine}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No favorite cuisines selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}