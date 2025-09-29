import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="text-orange-500 hover:underline">
              Browse Restaurants
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/dashboard" className="text-orange-500 hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/auth" className="text-orange-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}