import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCustomerProfile } from '../../hooks/useCustomerProfile';
import {
  updateCustomerProfile,
  updateCustomerPreferences,
  uploadCustomerAvatar,
} from '../../services/customerService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Loader2 } from 'lucide-react';

const CUISINE_OPTIONS = [
  'Italian',
  'Japanese',
  'Chinese',
  'Mexican',
  'Indian',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'Turkish',
];

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten_free', label: 'Gluten-Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export function CustomerSettingsPage() {
  const { user, refreshProfile } = useAuth();
  const { profile, loading: profileLoading, refreshProfile: refreshCustomerProfile } = useCustomerProfile();
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    preferred_cuisines: [] as string[],
    dietary_restrictions: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        preferred_cuisines: profile.customer_profile?.preferred_cuisines || [],
        dietary_restrictions: profile.customer_profile?.dietary_restrictions || [],
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File must be an image' });
      return;
    }

    try {
      setUploadingAvatar(true);
      setMessage(null);

      const result = await uploadCustomerAvatar(user.id, file);

      if (result.success) {
        setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        await refreshProfile();
        await refreshCustomerProfile();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload avatar' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setMessage(null);

      // Update basic profile
      const profileResult = await updateCustomerProfile(user.id, {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
      });

      if (!profileResult.success) {
        throw new Error(profileResult.error);
      }

      // Update preferences
      const preferencesResult = await updateCustomerPreferences(user.id, {
        preferred_cuisines: formData.preferred_cuisines,
        dietary_restrictions: formData.dietary_restrictions as any,
      });

      if (!preferencesResult.success) {
        throw new Error(preferencesResult.error);
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      await refreshProfile();
      await refreshCustomerProfile();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_cuisines: prev.preferred_cuisines.includes(cuisine)
        ? prev.preferred_cuisines.filter(c => c !== cuisine)
        : [...prev.preferred_cuisines, cuisine],
    }));
  };

  const toggleDietary = (dietary: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(dietary)
        ? prev.dietary_restrictions.filter(d => d !== dietary)
        : [...prev.dietary_restrictions, dietary],
    }));
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and preferences</p>
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
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Picture</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || 'Avatar'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-gray-400">
                        {(profile?.full_name || profile?.username || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="avatar-upload">
                    <Button
                      as="span"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      disabled={uploadingAvatar}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
              />
              <Input
                label="Full Name"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cuisine Preferences */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Preferred Cuisines</h2>
              <p className="text-sm text-gray-600">Select your favorite types of cuisine</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {CUISINE_OPTIONS.map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.preferred_cuisines.includes(cuisine)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Restrictions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Dietary Restrictions</h2>
              <p className="text-sm text-gray-600">Select any dietary requirements you have</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DIETARY_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleDietary(option.value)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.dietary_restrictions.includes(option.value)
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
          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving} size="lg">
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}