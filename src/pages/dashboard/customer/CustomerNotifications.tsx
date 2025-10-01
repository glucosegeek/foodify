import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, UserPlus, Megaphone, Star, Check, Trash2, Archive } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { mockCustomerNotifications, CustomerNotification } from '../../../data/mockCustomerData';

export function CustomerNotifications() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>(mockCustomerNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RESTAURANT_REPLY':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'NEW_FOLLOWER':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'RESTAURANT_POST':
        return <Megaphone className="h-5 w-5 text-orange-500" />;
      case 'FRIEND_REVIEW':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'RESTAURANT_REPLY':
        return 'bg-blue-50';
      case 'NEW_FOLLOWER':
        return 'bg-green-50';
      case 'RESTAURANT_POST':
        return 'bg-orange-50';
      case 'FRIEND_REVIEW':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with replies, followers, and restaurant news
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              filter === 'unread'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Unread ({unreadCount})
            {unreadCount > 0 && filter === 'all' && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-md transition-all ${
                !notification.read ? 'border-l-4 border-orange-500 bg-orange-50/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`${getNotificationBgColor(notification.type)} p-2 rounded-full flex-shrink-0`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {notification.actor_avatar && (
                    <img
                      src={notification.actor_avatar}
                      alt={notification.actor_name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                    {notification.actor_name && (
                      <p className="text-xs text-gray-500">by {notification.actor_name}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {notification.related_id && (
                  <div className="mt-3 ml-16">
                    <Link
                      to={`/restaurant/${notification.related_id}`}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'unread'
                ? "You're all caught up! Check back later for new updates."
                : 'When restaurants reply to your reviews or post updates, you\'ll see them here.'}
            </p>
            <Link to="/">
              <Button>
                Discover Restaurants
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {filteredNotifications.length > 10 && (
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Notifications
          </Button>
        </div>
      )}
    </div>
  );
}
