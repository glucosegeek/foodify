import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Flag, Filter, Send, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Review {
  id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  comment: string;
  visit_date: string;
  created_at: string;
  helpful_count: number;
  photos?: string[];
  verification_level: 'unverified' | 'verified_visit' | 'verified_purchase';
  has_response: boolean;
  response?: {
    text: string;
    created_at: string;
  };
  moderation_status: 'active' | 'flagged' | 'hidden';
}

export function RestaurantReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customer_name: 'Sarah Johnson',
      customer_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b932c5af?w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Absolutely amazing experience! The truffle risotto was perfectly cooked and the service was impeccable. Will definitely be back!',
      visit_date: '2024-01-15',
      created_at: '2024-01-16T10:30:00Z',
      helpful_count: 12,
      photos: [
        'https://images.unsplash.com/photo-1476124369491-b79d2e6b1b4c?w=400',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'
      ],
      verification_level: 'verified_visit',
      has_response: true,
      response: {
        text: 'Thank you so much for your kind words, Sarah! We\'re thrilled you enjoyed the risotto. Looking forward to welcoming you back soon!',
        created_at: '2024-01-16T14:20:00Z'
      },
      moderation_status: 'active'
    },
    {
      id: '2',
      customer_name: 'Michael Chen',
      customer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4,
      comment: 'Great food and atmosphere. The pizza was delicious, though service was a bit slow during peak hours. Overall a good experience.',
      visit_date: '2024-01-14',
      created_at: '2024-01-14T20:15:00Z',
      helpful_count: 8,
      verification_level: 'verified_visit',
      has_response: false,
      moderation_status: 'active'
    },
    {
      id: '3',
      customer_name: 'Emma Davis',
      rating: 3,
      comment: 'Food was okay but not exceptional. Prices are a bit high for the portion sizes. Service was friendly though.',
      visit_date: '2024-01-12',
      created_at: '2024-01-13T11:45:00Z',
      helpful_count: 5,
      verification_level: 'unverified',
      has_response: false,
      moderation_status: 'active'
    },
    {
      id: '4',
      customer_name: 'Anonymous User',
      rating: 2,
      comment: 'Disappointed with the experience. Food was cold and service took forever. Would not recommend.',
      visit_date: '2024-01-10',
      created_at: '2024-01-11T09:20:00Z',
      helpful_count: 3,
      verification_level: 'unverified',
      has_response: false,
      moderation_status: 'flagged'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'flagged'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;

    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? {
            ...review,
            has_response: true,
            response: {
              text: replyText,
              created_at: new Date().toISOString()
            }
          }
        : review
    ));

    setReplyText('');
    setReplyingTo(null);
  };

  const handleHideReview = (reviewId: string) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId
        ? { ...review, moderation_status: review.moderation_status === 'hidden' ? 'active' : 'hidden' as const }
        : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending' && review.has_response) return false;
    if (filter === 'responded' && !review.has_response) return false;
    if (filter === 'flagged' && review.moderation_status !== 'flagged') return false;
    if (ratingFilter > 0 && review.rating !== ratingFilter) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'verified_visit':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            ✓ Verified Visit
          </span>
        );
      case 'verified_purchase':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            ✓ Verified Purchase
          </span>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => !r.has_response).length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    flagged: reviews.filter(r => r.moderation_status === 'flagged').length
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Feedback</h1>
        <p className="text-gray-600 mt-2">Respond to reviews and manage customer feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Pending Response</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Average Rating</p>
            <p className="text-2xl font-bold text-green-600">{stats.avgRating} ⭐</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-1">Flagged</p>
            <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'responded'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'flagged'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Flagged ({stats.flagged})
          </button>
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value={0}>All Ratings</option>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className={`${
              review.moderation_status === 'hidden' ? 'opacity-50 border-2 border-gray-300' : ''
            } ${review.moderation_status === 'flagged' ? 'border-2 border-red-200' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {review.customer_avatar ? (
                  <img
                    src={review.customer_avatar}
                    alt={review.customer_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {review.customer_name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.customer_name}</h3>
                        {getVerificationBadge(review.verification_level)}
                        {review.moderation_status === 'flagged' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </span>
                        )}
                        {review.moderation_status === 'hidden' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          • Visited {formatDate(review.visit_date)}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.helpful_count} helpful
                    </span>
                  </div>

                  {review.has_response && review.response && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mt-4">
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 text-orange-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-900 mb-1">
                            Restaurant Response
                          </p>
                          <p className="text-sm text-gray-700">{review.response.text}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(review.response.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {replyingTo === review.id ? (
                    <div className="mt-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        placeholder="Write your response..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" onClick={() => handleSendReply(review.id)}>
                          <Send className="h-3 w-3 mr-1" />
                          Send Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-4">
                      {!review.has_response && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReplyingTo(review.id)}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleHideReview(review.id)}
                      >
                        {review.moderation_status === 'hidden' ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600">
              {filter !== 'all' || ratingFilter > 0
                ? 'Try adjusting your filters'
                : 'Your reviews will appear here'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
