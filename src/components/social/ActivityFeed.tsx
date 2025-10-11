import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { realtimeService } from '../../services/realtimeService';

interface Activity {
  id: string;
  user_id: string;
  actor_id: string;
  activity_type: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
  actor?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface ActivityFeedProps {
  userId: string;
  limit?: number;
}

export function ActivityFeed({ userId, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();

    const unsubscribe = realtimeService.subscribeToActivityFeed(userId, () => {
      fetchActivities();
    });

    return () => unsubscribe();
  }, [userId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const { data: followingData } = await supabase
        .from('user_follows')
        .select('followee_id')
        .eq('follower_id', userId);

      const followingIds = followingData?.map(f => f.followee_id) || [];

      if (followingIds.length === 0) {
        setActivities([]);
        return;
      }

      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          actor:profiles!activity_feed_actor_id_fkey(full_name, username, avatar_url)
        `)
        .in('actor_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'favorite':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    const actorName = activity.actor?.full_name || activity.actor?.username || 'Someone';

    switch (activity.activity_type) {
      case 'review':
        return `${actorName} left a review`;
      case 'favorite':
        return `${actorName} favorited a restaurant`;
      case 'comment':
        return `${actorName} commented on a review`;
      case 'follow':
        return `${actorName} started following someone`;
      default:
        return `${actorName} performed an action`;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3 p-4 bg-white rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No recent activity from people you follow.</p>
        <p className="text-sm text-gray-400 mt-2">Start following users to see their activity here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0">
            {activity.actor?.avatar_url ? (
              <img
                src={activity.actor.avatar_url}
                alt={activity.actor.full_name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                {activity.actor?.full_name?.[0] || activity.actor?.username?.[0] || '?'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {getActivityIcon(activity.activity_type)}
              <p className="text-sm text-gray-900">
                {getActivityText(activity)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatTimeAgo(activity.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
