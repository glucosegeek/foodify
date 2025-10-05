import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRestaurant } from '../../hooks/useRestaurant';
import {
  createRestaurant,
  updateRestaurant,
  uploadRestaurantLogo,
  uploadRestaurantCover,
} from '../../services/restaurantService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Loader2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CUISINE_TYPES = [
  'Italian', 'Japanese', 'Chinese', 'Mexican', 'Indian', 'Thai',
  'French', 'Mediterranean', 'American', 'Korean', 'Vietnamese',
  'Greek', 'Spanish', 'Turkish', 'Vegan', 'Seafood',
];

const DINING_STYLES = [
  { value: 'fine_dining', label: 'Fine Dining' },
  { value: 'casual', label: 'Casual' },
  { value: 'fast_casual', label: 'Fast Casual' },
];

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten_free', label: 'Gluten-Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export function RestaurantProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { restaurant, loading: restaurantLoading, refreshRestaurant } = useRestaurant();
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cuisine_type: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    price_range: '$$',
    dining_style: 'casual' as const,
    dietary_options: [] as string[],
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        slug: restaurant.slug || '',
        description: restaurant.description || '',
        cuisine_type: restaurant.cuisine_type || '',
        location: restaurant.location || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude?.toString() || '',
        longitude: restaurant.longitude?.toString() || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        website: restaurant.website || '',
        price_range: restaurant.price_range || '$$',
        dining_style: restaurant.dining_style || 'casual',
        dietary_options: restaurant.dietary_options || [],
      });
    }
  }, [restaurant]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: !restaurant ? generateSlug(name) : prev.slug,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !restaurant) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File must be an image' });
      return;
    }

    try {
      setUploadingLogo(true);
      setMessage(null);

      const result = await uploadRestaurantLogo(restaurant.id, file);

      if (result.success) {
        setMessage({ type: 'success', text: 'Logo updated successfully!' });
        await refreshRestaurant();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload logo' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload logo' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !restaurant) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File must be an image' });
      return;
    }

    try {
      setUploadingCover(true);
      setMessage(null);

      const result = await uploadRestaurantCover(restaurant.id, file);

      if (result.success) {
        setMessage({ type: 'success', text: 'Cover photo updated successfully!' });
        await refreshRestaurant();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload cover' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload cover' });
    } finally {
      setUploadingCover(false);
    }
  };

  const toggleDietaryOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_options: prev.dietary_options.includes(option)
        ? prev.dietary_options.filter(o => o !== option)
        : [...prev.dietary_options, option],
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!formData.name || !formData.slug || !formData.cuisine_type || !formData.location) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const restaurantData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        cuisine_type: formData.cuisine_type,
        location: formData.location,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        price_range: formData.price_range,
        dining_style: formData.dining_style,
        dietary_options: formData.dietary_options as any,
      };

      if (restaurant) {
        // Update existing restaurant
        const result = await updateRestaurant(restaurant.id, restaurantData);

        if (!result.success) {
          throw new Error(result.error);
        }

        setMessage({ type: 'success', text: 'Restaurant profile updated successfully!' });
      } else {
        // Create new restaurant
        const result = await createRestaurant(user.id, restaurantData);

        if (!result.success) {
          throw new Error(result.error);
        }

        setMessage({ type: 'success', text: 'Restaurant profile created successfully!' });
      }

      await refreshRestaurant();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save restaurant profile' });
    } finally {
      setSaving(false);
    }
  };

  if (restaurantLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {restaurant ? 'Edit Restaurant Profile' : 'Create Restaurant Profile'}
        </h1>
        <p className="text-gray-600 mt-2">
          {restaurant
            ? 'Update your restaurant information'
            : 'Set up your restaurant to start managing your menu'}
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Cover Photo & Logo */}
        {restaurant && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Photos</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Photo
                </label>
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {restaurant.cover_photo_url ? (
                    <img
                      src={restaurant.cover_photo_url}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No cover photo
                    </div>
                  )}
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                  <label
                    htmlFor="cover-upload"
                    className="absolute bottom-4 right-4 cursor-pointer"
                  >
                    <Button
                      as="span"
                      variant="secondary"
                      size="sm"
                      disabled={uploadingCover}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                    </Button>
                  </label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: 1200x400px. Max 10MB.
                </p>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300">
                      {restaurant.logo_url ? (
                        <img
                          src={restaurant.logo_url}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-400">
                          {restaurant.name[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="logo-upload">
                      <Button
                        as="span"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        disabled={uploadingLogo}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                      </Button>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <p className="text-sm text-gray-500 mt-2">Square image recommended. Max 5MB.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Restaurant Name *"
              value={formData.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g., Bella Vista Italian"
            />
            <Input
              label="URL Slug *"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              placeholder="bella-vista-italian"
              disabled={!!restaurant}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell customers about your restaurant..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type *
                </label>
                <select
                  value={formData.cuisine_type}
                  onChange={e => setFormData({ ...formData, cuisine_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select cuisine type</option>
                  {CUISINE_TYPES.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dining Style
                </label>
                <select
                  value={formData.dining_style}
                  onChange={e => setFormData({ ...formData, dining_style: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {DINING_STYLES.map(style => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-3">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range}
                    onClick={() => setFormData({ ...formData, price_range: range })}
                    className={`px-6 py-2 rounded-lg border-2 text-lg font-medium transition-colors ${
                      formData.price_range === range
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Location</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Area/District *"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Śródmieście, Warsaw"
            />
            <Input
              label="Full Address"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="ul. Nowy Świat 25, 00-001 Warszawa"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="52.231876"
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="21.018973"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Contact Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+48 22 123 4567"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@restaurant.com"
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://restaurant.com"
            />
          </CardContent>
        </Card>

        {/* Dietary Options */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Dietary Options</h2>
            <p className="text-sm text-gray-600">Select all dietary options you offer</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DIETARY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => toggleDietaryOption(option.value)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    formData.dietary_options.includes(option.value)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          {restaurant && (
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save className="h-5 w-5 mr-2" />
            {restaurant ? 'Save Changes' : 'Create Restaurant'}
          </Button>
        </div>
      </div>
    </div>
  );
}