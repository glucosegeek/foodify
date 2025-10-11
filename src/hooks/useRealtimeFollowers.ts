import { useState, useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';

export function useRealtimeFollowers(entityId: string, type: 'user' | 'restaurant' = 'user') {
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      try {
        setLoading(true);
        const { count, error } = await (type === 'user'
          ? window.supabase.from('user_follows').select('*', { count: 'exact', head: true }).eq('followee_id', entityId)
          : window.supabase.from('restaurant_follows').select('*', { count: 'exact', head: true }).eq('restaurant_id', entityId)
        );

        if (!error && isMounted) {
          setFollowerCount(count || 0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCount();

    const unsubscribe = type === 'user'
      ? realtimeService.subscribeToFollows(
          entityId,
          () => setFollowerCount(prev => prev + 1),
          () => setFollowerCount(prev => Math.max(0, prev - 1))
        )
      : realtimeService.subscribeToRestaurantFollows(
          entityId,
          () => setFollowerCount(prev => prev + 1),
          () => setFollowerCount(prev => Math.max(0, prev - 1))
        );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [entityId, type]);

  return { followerCount, loading };
}
