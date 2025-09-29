import React from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Lock, Globe, CreditCard, Trash2 } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-gray-600">Manage how you receive notifications</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Email notifications for new reviews</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Weekly analytics summary</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Marketing and promotional emails</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3">
            <Lock className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold">Security</h2>
              <p className="text-sm text-gray-600">Manage your account security</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Not enabled</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3">
            <Globe className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-gray-600">Customize your experience</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader className="flex flex-row items-center space-x-3">
            <CreditCard className="h-6 w-6 text-gray-600" />
            <div>
              <h2 className="text-xl font-semibold">Billing & Subscription</h2>
              <p className="text-sm text-gray-600">Manage your subscription plan</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">Free Plan</p>
                    <p className="text-sm text-gray-600">Basic features for small restaurants</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>✓ Up to 50 menu items</li>
                  <li>✓ Basic analytics</li>
                  <li>✓ Restaurant profile page</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full">
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Trash2 className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
              <p className="text-sm text-gray-600">Irreversible actions</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}