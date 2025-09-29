import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Save, Upload } from 'lucide-react';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cuisine_type: z.string().min(2, 'Please select a cuisine type'),
  location: z.string().min(2, 'Location is required'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

export function RestaurantProfile() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      cuisine_type: '',
      location: '',
      phone: '',
      website: '',
    },
  });

  const onSubmit = async (data: RestaurantFormData) => {
    setLoading(true);
    setSuccess(false);
    
    try {
      // TODO: Implement Supabase integration
      console.log('Restaurant data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (error) {
      console.error('Error saving restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your restaurant information and appearance on MenuHub
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Restaurant profile updated successfully!</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Restaurant Information</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <Button type="button" variant="outline">
                  Upload Logo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>

            {/* Restaurant Name */}
            <Input
              label="Restaurant Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g., Bella Vista Italian"
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell customers about your restaurant..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                {...register('cuisine_type')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select cuisine type</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="French">French</option>
                <option value="Chinese">Chinese</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Mexican">Mexican</option>
                <option value="Thai">Thai</option>
                <option value="Korean">Korean</option>
                <option value="Vegan">Vegan</option>
                <option value="Seafood">Seafood</option>
              </select>
              {errors.cuisine_type && (
                <p className="mt-2 text-sm text-red-600">{errors.cuisine_type.message}</p>
              )}
            </div>

            {/* Location */}
            <Input
              label="Location"
              {...register('location')}
              error={errors.location?.message}
              placeholder="e.g., Downtown, Midtown"
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="(555) 123-4567"
            />

            {/* Website */}
            <Input
              label="Website (optional)"
              type="url"
              {...register('website')}
              error={errors.website?.message}
              placeholder="https://yourrestaurant.com"
            />

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}