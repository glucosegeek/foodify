import { supabase } from '../lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type SubscriptionCallback<T = any> = (payload: RealtimePostgresChangesPayload<T>) => void;

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToReviews(
    restaurantId: string,
    onInsert?: SubscriptionCallback,
    onUpdate?: SubscriptionCallback,
    onDelete?: SubscriptionCallback
  ): () => void {
    const channelName = `reviews:${restaurantId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => onUpdate?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reviews',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => onDelete?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToComments(
    reviewId: string,
    onInsert?: SubscriptionCallback,
    onUpdate?: SubscriptionCallback,
    onDelete?: SubscriptionCallback
  ): () => void {
    const channelName = `comments:${reviewId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'review_comments',
          filter: `review_id=eq.${reviewId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'review_comments',
          filter: `review_id=eq.${reviewId}`,
        },
        (payload) => onUpdate?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'review_comments',
          filter: `review_id=eq.${reviewId}`,
        },
        (payload) => onDelete?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToFollows(
    userId: string,
    onInsert?: SubscriptionCallback,
    onDelete?: SubscriptionCallback
  ): () => void {
    const channelName = `follows:${userId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_follows',
          filter: `followee_id=eq.${userId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'user_follows',
          filter: `followee_id=eq.${userId}`,
        },
        (payload) => onDelete?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToRestaurantFollows(
    restaurantId: string,
    onInsert?: SubscriptionCallback,
    onDelete?: SubscriptionCallback
  ): () => void {
    const channelName = `restaurant_follows:${restaurantId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'restaurant_follows',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'restaurant_follows',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => onDelete?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToUserPresence(
    callback: (presences: any[]) => void
  ): () => void {
    const channelName = 'presence:online';

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presences = Object.values(state).flat();
        callback(presences);
      })
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  trackPresence(userId: string, metadata: Record<string, any> = {}): () => void {
    const channelName = 'presence:online';

    let channel = this.channels.get(channelName);

    if (!channel) {
      channel = supabase.channel(channelName);
      this.channels.set(channelName, channel);
    }

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          ...metadata,
        });
      }
    });

    return () => {
      channel?.untrack();
    };
  }

  subscribeToActivityFeed(
    userId: string,
    onInsert?: SubscriptionCallback
  ): () => void {
    const channelName = `activity:${userId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToNotifications(
    userId: string,
    onInsert?: SubscriptionCallback,
    onUpdate?: SubscriptionCallback
  ): () => void {
    const channelName = `notifications:${userId}`;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => onInsert?.(payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => onUpdate?.(payload)
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  subscribeToTable(
    tableName: string,
    filter?: string,
    callbacks?: {
      onInsert?: SubscriptionCallback;
      onUpdate?: SubscriptionCallback;
      onDelete?: SubscriptionCallback;
    }
  ): () => void {
    const channelName = filter ? `${tableName}:${filter}` : tableName;

    if (this.channels.has(channelName)) {
      return () => this.unsubscribe(channelName);
    }

    let channel = supabase.channel(channelName);

    if (callbacks?.onInsert) {
      channel = channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
          ...(filter && { filter }),
        },
        callbacks.onInsert
      );
    }

    if (callbacks?.onUpdate) {
      channel = channel.on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
          ...(filter && { filter }),
        },
        callbacks.onUpdate
      );
    }

    if (callbacks?.onDelete) {
      channel = channel.on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: tableName,
          ...(filter && { filter }),
        },
        callbacks.onDelete
      );
    }

    channel.subscribe();
    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  private unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  unsubscribeAll(): void {
    this.channels.forEach((_, channelName) => {
      this.unsubscribe(channelName);
    });
  }

  getActiveChannels(): string[] {
    return Array.from(this.channels.keys());
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
