import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Users, Lock, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

export function RestaurantSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [notificationSettings, setNotificationSettings] = useState({
    newReviews: true,
    reviewReplies: true,
    newFollowers: true,
    reservations: true,
    promotions: false,
    weeklyReport: true
  });

  const [teamSettings, setTeamSettings] = useState({
    teamMembers: ['manager@restaurant.com', 'chef@restaurant.com']
  });

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handleAddTeamMember = () => {
    if (newMemberEmail && !teamSettings.teamMembers.includes(newMemberEmail)) {
      setTeamSettings({
        ...teamSettings,
        teamMembers: [...teamSettings.teamMembers, newMemberEmail]
      });
      setNewMemberEmail('');
    }
  };

  const handleRemoveTeamMember = (email: string) => {
    setTeamSettings({
      ...teamSettings,
      teamMembers: teamSettings.teamMembers.filter(e => e !== email)
    });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your restaurant account? This action cannot be undone.')) {
      if (window.confirm('Final confirmation: This will permanently delete all your data.')) {
        await signOut();
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your restaurant account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            newReviews: { label: 'New Reviews', desc: 'Get notified when customers leave reviews' },
            reviewReplies: { label: 'Review Replies', desc: 'When customers respond to your replies' },
            newFollowers: { label: 'New Followers', desc: 'When someone starts following your restaurant' },
            reservations: { label: 'Reservations', desc: 'Reservation confirmations and updates' },
            promotions: { label: 'Platform Promotions', desc: 'Marketing opportunities from the platform' },
            weeklyReport: { label: 'Weekly Report', desc: 'Summary of your restaurant performance' }
          }).map(([key, { label, desc }]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[key as keyof typeof notificationSettings]}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    [key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Add team members who can help manage your restaurant account
          </p>

          <div className="flex space-x-2">
            <Input
              placeholder="email@example.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddTeamMember}>
              Add Member
            </Button>
          </div>

          <div className="space-y-2">
            {teamSettings.teamMembers.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">{email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTeamMember(email)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-3">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button onClick={handleSaveSettings} loading={saving}>
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>

        <Button
          variant="outline"
          onClick={handleDeleteAccount}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );
}
