import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { followUser, unfollowUser } from '../../services/customerService';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onFollowChange,
  size = 'md',
  variant = 'primary',
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkFollowStatus = async () => {
      const { data } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('follower_id', user.id)
        .eq('followee_id', targetUserId)
        .maybeSingle();

      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [user, targetUserId]);

  const handleFollow = async () => {
    if (!user || loading) return;

    setLoading(true);

    try {
      if (isFollowing) {
        const result = await unfollowUser(user.id, targetUserId);
        if (result.success) {
          setIsFollowing(false);
          onFollowChange?.(false);
        }
      } else {
        const result = await followUser(user.id, targetUserId);
        if (result.success) {
          setIsFollowing(true);
          onFollowChange?.(true);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={isFollowing ? 'secondary' : variant}
      size={size}
      className={`flex items-center gap-2 ${isFollowing ? 'bg-gray-200 hover:bg-gray-300' : ''}`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </Button>
  );
}
