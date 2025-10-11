import { useState, useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';
import { supabase } from '../lib/supabase';

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_seen: string;
  current_page?: string;
}

export function usePresence(userId?: string) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<UserPresence | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const updatePresence = async () => {
      await supabase.from('user_presence').upsert({
        user_id: userId,
        status: 'online',
        current_page: window.location.pathname,
      });
    };

    updatePresence();

    const interval = setInterval(updatePresence, 30000);

    const unsubscribePresence = realtimeService.subscribeToUserPresence((presences) => {
      if (isMounted) {
        setOnlineUsers(presences);
      }
    });

    const untrack = realtimeService.trackPresence(userId, {
      page: window.location.pathname,
    });

    const handleBeforeUnload = async () => {
      await supabase.from('user_presence').update({
        status: 'offline',
      }).eq('user_id', userId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubscribePresence();
      untrack();
      window.removeEventListener('beforeunload', handleBeforeUnload);

      supabase.from('user_presence').update({
        status: 'offline',
      }).eq('user_id', userId);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserStatus = async () => {
      const { data } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setUserStatus(data);
      }
    };

    fetchUserStatus();
  }, [userId]);

  return { onlineUsers, userStatus };
}
