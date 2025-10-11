import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addFavoriteRestaurant, removeFavoriteRestaurant, isRestaurantFavorited } from '../../services/customerService';
import { useAuth } from '../../contexts/AuthContext';

interface FavoriteButtonProps {
  restaurantId: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  restaurantId,
  onFavoriteChange,
  showLabel = false,
  size = 'md',
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkFavoriteStatus = async () => {
      const favorited = await isRestaurantFavorited(user.id, restaurantId);
      setIsFavorite(favorited);
    };

    checkFavoriteStatus();
  }, [user, restaurantId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || loading) return;

    setLoading(true);
    setAnimating(true);

    try {
      if (isFavorite) {
        const result = await removeFavoriteRestaurant(user.id, restaurantId);
        if (result.success) {
          setIsFavorite(false);
          onFavoriteChange?.(false);
        }
      } else {
        const result = await addFavoriteRestaurant(user.id, restaurantId);
        if (result.success) {
          setIsFavorite(true);
          onFavoriteChange?.(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  if (!user) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        flex items-center gap-2 p-2 rounded-lg transition-all duration-200
        ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
        ${animating ? 'scale-125' : 'scale-100'}
        hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all ${isFavorite ? 'fill-current' : ''}`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}
