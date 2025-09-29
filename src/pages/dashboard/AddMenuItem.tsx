import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Upload } from 'lucide-react';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  category: z.string().min(2, 'Please select a category'),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

export function AddMenuItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
  });

  const onSubmit = async (data: MenuItemFormData) => {
    setLoading(true);
    
    try {
      // TODO: Implement Supabase integration
      console.log('Menu item data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/dashboard/menu');
    } catch (error) {
      console.error('Error creating menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/menu')}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Menu Item</h1>
        <p className="text-gray-600 mt-2">
          Add a new dish to your restaurant menu
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Item Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            {/* Item Name */}
            <Input
              label="Item Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g., Margherita Pizza"
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
                placeholder="Describe the dish, ingredients, etc."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Price */}
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              placeholder="12.99"
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Salads">Salads</option>
                <option value="Pizza">Pizza</option>
                <option value="Pasta">Pasta</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/menu')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} size="lg">
                Add Menu Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}