import React from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { TrendingUp, Users, Eye, Star } from 'lucide-react';

export function Analytics() {
  const stats = [
    { label: 'Total Views', value: '2,451', change: '+12%', icon: Eye, color: 'blue' },
    { label: 'Menu Views', value: '1,823', change: '+8%', icon: TrendingUp, color: 'green' },
    { label: 'Profile Visits', value: '628', change: '+15%', icon: Users, color: 'purple' },
    { label: 'Avg Rating', value: '4.7', change: '+0.2', icon: Star, color: 'yellow' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your restaurant's performance and engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Coming Soon</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Detailed analytics and insights will be available here soon, including:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• Traffic trends over time</li>
            <li>• Popular menu items</li>
            <li>• Customer demographics</li>
            <li>• Peak hours analysis</li>
            <li>• Review sentiment analysis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}