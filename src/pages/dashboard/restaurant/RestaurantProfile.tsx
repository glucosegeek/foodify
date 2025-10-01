import React, { useState } from 'react';
import { Store, Upload, Save, MapPin, Phone, Globe, Clock, Shield, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

export function RestaurantProfile() {
  const { user, updateProfile } = useAuth();
  const restaurantProfile = user?.profile as any;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: restaurantProfile?.name || '',
    description: restaurantProfile?.description || '',
    address: restaurantProfile?.address || '',
    phone: restaurantProfile?.phone || '',
    website: restaurantProfile?.website || '',
    email: restaurantProfile?.email || '',
    cuisineTypes: restaurantProfile?.cuisine_types || [],
    tags: restaurantProfile?.tags || [],
    priceLevel: restaurantProfile?.price_level || 2,
    hours: restaurantProfile?.hours || {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' }
    }
  });

  const cuisineOptions = [
    'Italian', 'Japanese', 'Chinese', 'Thai', 'Mexican', 'Indian',
    'French', 'American', 'Mediterranean', 'Korean', 'Vietnamese',
    'Greek', 'Spanish', 'Turkish', 'Lebanese', 'Vegan'
  ];

  const tagOptions = [
    'vege-friendly', 'vegan-options', 'gluten-free', 'delivery',
    'takeout', 'outdoor-seating', 'romantic', 'family-friendly',
    'pet-friendly', 'parking', 'wifi', 'bar', 'live-music'
  ];

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: restaurantProfile?.name || '',
      description: restaurantProfile?.description || '',
      address: restaurantProfile?.address || '',
      phone: restaurantProfile?.phone || '',
      website: restaurantProfile?.website || '',
      email: restaurantProfile?.email || '',
      cuisineTypes: restaurantProfile?.cuisine_types || [],
      tags: restaurantProfile?.tags || [],
      priceLevel: restaurantProfile?.price_level || 2,
      hours: restaurantProfile?.hours || {}
    });
    setIsEditing(false);
  };

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const getVerificationStatusBadge = () => {
    const status = restaurantProfile?.verification_status || 'pending';
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <Shield className="w-4 h-4 mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Verification Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Profile</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant information and settings</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {restaurantProfile?.logo_url ? (
                  <img
                    src={restaurantProfile.logo_url}
                    alt="Restaurant Logo"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center border-2 border-white shadow-lg">
                    <Store className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.name || 'Restaurant Name'}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  {getVerificationStatusBadge()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurantProfile?.average_rating?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurantProfile?.reviews_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurantProfile?.followers_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Followers</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <Input
                label="Restaurant Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tell customers about your restaurant..."
                />
              </div>
              <Input
                label="Address *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                icon={<MapPin className="h-4 w-4" />}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  icon={<Phone className="h-4 w-4" />}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@restaurant.com"
                />
              </div>
              <Input
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://your-restaurant.com"
                icon={<Globe className="h-4 w-4" />}
              />
            </>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900">{formData.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Address
                  </h4>
                  <p className="text-gray-900">{formData.address || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone
                  </h4>
                  <p className="text-gray-900">{formData.phone || 'Not specified'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Email</h4>
                  <p className="text-gray-900">{formData.email || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Website
                  </h4>
                  <p className="text-gray-900">
                    {formData.website ? (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                        {formData.website}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Cuisine Types</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => isEditing && toggleCuisine(cuisine)}
                disabled={!isEditing}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.cuisineTypes.includes(cuisine)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Tags & Amenities</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => isEditing && toggleTag(tag)}
                disabled={!isEditing}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.tags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <p className="font-medium text-gray-900 capitalize">{day}</p>
                </div>
                {isEditing ? (
                  <>
                    <input
                      type="time"
                      value={formData.hours[day]?.open || '09:00'}
                      onChange={(e) => setFormData({
                        ...formData,
                        hours: {
                          ...formData.hours,
                          [day]: { ...formData.hours[day], open: e.target.value }
                        }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.hours[day]?.close || '22:00'}
                      onChange={(e) => setFormData({
                        ...formData,
                        hours: {
                          ...formData.hours,
                          [day]: { ...formData.hours[day], close: e.target.value }
                        }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </>
                ) : (
                  <p className="text-gray-700">
                    {formData.hours[day]?.closed
                      ? 'Closed'
                      : `${formData.hours[day]?.open || '09:00'} - ${formData.hours[day]?.close || '22:00'}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-orange-900">Verification Status</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-orange-600 mt-1" />
            <div>
              <p className="text-gray-900 mb-2">
                {restaurantProfile?.verification_status === 'verified'
                  ? 'Your restaurant is verified!'
                  : 'Get your restaurant verified to build trust with customers.'}
              </p>
              {restaurantProfile?.verification_status !== 'verified' && (
                <Button size="sm" variant="outline">
                  Request Verification
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
