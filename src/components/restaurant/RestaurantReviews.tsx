import React, { useState } from 'react';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Review } from '../../types/restaurant';
import { useAuth } from '../../contexts/AuthContext';

interface RestaurantReviewsProps {
  reviews: Review[];
  restaurantId: string;
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => void;
}

export function RestaurantReviews({ reviews, restaurantId, onAddReview }: RestaurantReviewsProps) {
  const { user } = useAuth();
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${interactive ? 'cursor-pointer' : ''} ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 transition-colors' : ''}`}
            onClick={interactive ? () => onRatingChange?.(i + 1) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const review = {
        user_name: user.email?.split('@')[0] || 'Anonim',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        helpful_count: 0
      };

      onAddReview?.(review);
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Opinie klientów</h3>
        
        {reviews.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-gray-600">
                <p>Średnia ocena na podstawie</p>
                <p className="font-semibold">{reviews.length} opinii</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {user ? (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Dodaj swoją opinię</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twoja ocena
            </label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentarz
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Podziel się swoimi wrażeniami z tej restauracji..."
              required
            />
          </div>

          <Button 
            type="submit" 
            loading={isSubmitting}
            disabled={!newReview.comment.trim()}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Dodaj opinię</span>
          </Button>
        </form>
      ) : (
        <div className="mb-8 bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">Zaloguj się, aby dodać opinię</p>
          <a href="/auth" className="text-orange-500 hover:text-orange-600 font-medium">
            Zaloguj się
          </a>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Brak opinii. Bądź pierwszy!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {review.user_avatar ? (
                    <img
                      src={review.user_avatar}
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">
                        {review.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-gray-900">{review.user_name}</h5>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Pomocne ({review.helpful_count || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}