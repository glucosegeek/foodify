# Real-Time Social Features Implementation

This document outlines the comprehensive real-time collaboration and social features that have been implemented in the restaurant discovery platform.

## Overview

The platform now includes extensive real-time collaboration features, social interactions, and live updates across all user types. These features leverage Supabase Realtime for instant updates without page refreshes.

## Database Enhancements

### New Tables

1. **review_comments** - Nested comment discussions on reviews
   - Threaded conversations with parent-child relationships
   - Support for user mentions
   - Soft delete functionality
   - Real-time like counting

2. **comment_likes** - Like tracking for comments
   - User-comment relationship tracking
   - Automatic like count updates

3. **user_presence** - Real-time user online status
   - Online/away/offline status tracking
   - Current page location tracking
   - Last seen timestamps
   - Automatic presence updates

4. **profile_views** - Profile viewing analytics
   - Track who viewed whose profile
   - View duration tracking
   - Anonymous and authenticated views

5. **restaurant_view_analytics** - Restaurant page analytics
   - Visitor tracking
   - Referrer tracking
   - View duration metrics
   - Real-time analytics for restaurant owners

### Enhanced Tables

- All social tables now have optimized indexes for real-time queries
- RLS policies configured for secure real-time subscriptions
- Triggers for automatic count updates

## Real-Time Services

### RealtimeService (`src/services/realtimeService.ts`)

Centralized service for managing all real-time subscriptions:

- **subscribeToReviews()** - Live updates for restaurant reviews
- **subscribeToComments()** - Real-time comment updates
- **subscribeToFollows()** - Instant follower notifications
- **subscribeToRestaurantFollows()** - Restaurant follower tracking
- **subscribeToUserPresence()** - Online status updates
- **trackPresence()** - Broadcast user presence
- **subscribeToActivityFeed()** - Live activity stream updates
- **subscribeToNotifications()** - Instant notification delivery
- **subscribeToTable()** - Generic table subscription

Features:
- Automatic channel management
- Subscription cleanup
- Connection pooling
- Error handling and reconnection logic

### CommentService (`src/services/commentService.ts`)

Complete comment management system:

- **getReviewComments()** - Fetch threaded comments
- **createComment()** - Add new comments with mentions
- **updateComment()** - Edit existing comments
- **deleteComment()** - Soft delete comments
- **likeComment()** / **unlikeComment()** - Toggle comment likes
- **getCommentCount()** - Get total comment count
- Automatic mention notifications

## Real-Time Hooks

### useRealtimeComments

Custom hook for real-time comment updates:
```typescript
const { comments, loading, error, refresh } = useRealtimeComments(reviewId, userId);
```

Features:
- Automatic subscription management
- Nested comment threading
- Live like status updates
- Optimistic UI updates

### useRealtimeFollowers

Track follower counts with real-time updates:
```typescript
const { followerCount, loading } = useRealtimeFollowers(entityId, type);
```

Supports both user and restaurant follower tracking.

### usePresence

User presence tracking and online status:
```typescript
const { onlineUsers, userStatus } = usePresence(userId);
```

Features:
- Automatic presence broadcasting
- Online user list
- Periodic heartbeat updates
- Cleanup on unmount

## Social UI Components

### FollowButton (`src/components/social/FollowButton.tsx`)

Follow/unfollow functionality with real-time updates:
- Optimistic UI updates
- Loading states
- Icon animations
- Multiple size variants
- Automatic hide for own profile

### FavoriteButton (`src/components/social/FavoriteButton.tsx`)

Restaurant favoriting with animations:
- Heart icon with fill animation
- Optimistic updates
- Scale animation on toggle
- Configurable sizes
- Optional label display

### CommentSection (`src/components/social/CommentSection.tsx`)

Complete threaded comment interface:
- Real-time comment streaming
- Nested replies (up to 2 levels)
- Inline editing
- Like/unlike functionality
- User mentions
- Delete confirmation
- Avatar display
- Timestamp formatting
- Edit indicators
- Loading states

### ActivityFeed (`src/components/social/ActivityFeed.tsx`)

Live activity stream from followed users:
- Real-time activity updates
- Activity type icons
- User avatars
- Time ago formatting
- Empty state handling
- Loading skeletons

## Integration Examples

### Customer Dashboard

The customer overview now includes:
- Real-time statistics (reviews, follows, favorites)
- Live online user count
- Activity feed from followed users
- Presence tracking
- Auto-refreshing stats

### Review Pages

Reviews now support:
- Real-time comment sections
- Live like counts
- Instant new comment notifications
- Threaded discussions
- User mentions with notifications

### Profile Pages

Profiles now feature:
- Online/offline status indicators
- Recent profile visitors
- Follow buttons with live counts
- Activity history

## Usage Guide

### Setting Up Real-Time Subscriptions

```typescript
import { realtimeService } from './services/realtimeService';

// Subscribe to comments
const unsubscribe = realtimeService.subscribeToComments(
  reviewId,
  (payload) => console.log('New comment:', payload),
  (payload) => console.log('Updated comment:', payload),
  (payload) => console.log('Deleted comment:', payload)
);

// Clean up when done
return () => unsubscribe();
```

### Using Social Components

```typescript
import { FollowButton } from './components/social/FollowButton';
import { FavoriteButton } from './components/social/FavoriteButton';
import { CommentSection } from './components/social/CommentSection';

// In your component
<FollowButton
  targetUserId={userId}
  onFollowChange={(following) => console.log(following)}
/>

<FavoriteButton
  restaurantId={restaurantId}
  showLabel={true}
/>

<CommentSection reviewId={reviewId} />
```

### Tracking User Presence

```typescript
import { usePresence } from './hooks/usePresence';

function MyComponent() {
  const { onlineUsers, userStatus } = usePresence(userId);

  return (
    <div>
      <p>{onlineUsers.length} users online</p>
      <p>Your status: {userStatus?.status}</p>
    </div>
  );
}
```

## Database Seeding

A comprehensive seeding script is available at `src/scripts/seedDatabase.ts`:

### Running the Seed Script

```bash
# Note: This requires Node.js runtime as it uses Supabase Auth API
npm run seed
```

### What Gets Seeded

- 10 customer profiles with diverse interests
- 5 restaurant profiles with complete information
- Menu items for each restaurant (3 items per restaurant)
- Reviews with ratings and comments
- User follows (social graph)
- Restaurant follows (favorites)
- Review comments with threading
- User presence data

### Sample Data

All profiles come with:
- Realistic names and usernames
- Bio descriptions
- Avatar images from Pexels
- Cuisine preferences
- Location data

## Performance Optimizations

1. **Indexed Queries** - All real-time queries use optimized indexes
2. **Connection Pooling** - Shared channels for multiple subscribers
3. **Automatic Cleanup** - Subscriptions cleaned up on unmount
4. **Optimistic Updates** - UI updates before server confirmation
5. **Cached Counts** - Like and follower counts cached in database
6. **Debounced Presence** - Presence updates throttled to reduce load

## Security

All real-time features implement Row Level Security (RLS):
- Users can only modify their own data
- Public read access for non-sensitive data
- Restaurant owners can access their own analytics
- Profile views respect privacy settings
- Comment moderation support built-in

## Best Practices

1. **Always clean up subscriptions** - Use cleanup functions in useEffect
2. **Check authentication** - Verify user before real-time operations
3. **Handle errors gracefully** - Provide fallbacks for failed subscriptions
4. **Use optimistic updates** - Update UI before server confirms
5. **Implement loading states** - Show loading while fetching data
6. **Rate limit actions** - Prevent spam with client-side throttling

## Future Enhancements

Potential additions for further development:
- Direct messaging between users
- Group chat for restaurant events
- Live video streaming for restaurant tours
- Real-time reservation status
- Collaborative dining lists
- Live menu updates during service
- Push notifications for mobile
- Email digests of activity
- Advanced moderation dashboard

## Troubleshooting

### Subscriptions Not Working

1. Check Supabase Realtime is enabled in project settings
2. Verify RLS policies allow SELECT for subscribed tables
3. Ensure authentication token is valid
4. Check browser console for subscription errors

### Presence Not Updating

1. Verify user_presence table exists
2. Check presence updates are being sent (every 30s)
3. Ensure cleanup is happening properly on unmount
4. Check for network connectivity issues

### Comments Not Appearing

1. Verify review_comments table and RLS policies
2. Check user authentication status
3. Ensure subscription is active
4. Refresh the comments manually using refresh()

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime (WebSocket-based)
- **State Management**: React Hooks
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## Conclusion

This implementation provides a comprehensive, production-ready real-time social platform with extensive collaboration features. All features are built on Supabase's reliable real-time infrastructure and follow security best practices with Row Level Security.

The system is designed to scale horizontally and can handle thousands of concurrent users with real-time updates across all features.
