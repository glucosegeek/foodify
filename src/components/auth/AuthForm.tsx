import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { User, Store, Shield } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'RESTAURANT', 'ADMIN']).optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const { signIn, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setLoading(true);
      setError(null);

      if (mode === 'signin') {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, selectedRole);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'CUSTOMER' as UserRole,
      label: 'Customer',
      description: 'Discover restaurants, write reviews, and follow favorites',
      icon: User,
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      value: 'RESTAURANT' as UserRole,
      label: 'Restaurant Owner',
      description: 'Manage your restaurant profile, menu, and customer relationships',
      icon: Store,
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      value: 'ADMIN' as UserRole,
      label: 'Administrator',
      description: 'Platform administration and moderation',
      icon: Shield,
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {mode === 'signin'
              ? 'Sign in to your account'
              : 'Create your account to get started'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I want to join as:
                </label>
                <div className="space-y-3">
                  {roleOptions.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedRole === role.value
                            ? role.color
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm opacity-75">{role.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          {mode === 'signin' && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <p className="mb-2">Demo accounts for testing:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Customer:</strong> customer@demo.com / password</p>
                <p><strong>Restaurant:</strong> restaurant@demo.com / password</p>
                <p><strong>Admin:</strong> admin@demo.com / password</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}