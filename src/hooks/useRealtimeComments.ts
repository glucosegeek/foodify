import { useState, useEffect } from 'react';
import { ReviewComment, getReviewComments } from '../services/commentService';
import { realtimeService } from '../services/realtimeService';

export function useRealtimeComments(reviewId: string, userId?: string) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getReviewComments(reviewId, userId);
        if (isMounted) {
          setComments(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    const unsubscribe = realtimeService.subscribeToComments(
      reviewId,
      async () => {
        const updated = await getReviewComments(reviewId, userId);
        if (isMounted) {
          setComments(updated);
        }
      },
      async () => {
        const updated = await getReviewComments(reviewId, userId);
        if (isMounted) {
          setComments(updated);
        }
      },
      async () => {
        const updated = await getReviewComments(reviewId, userId);
        if (isMounted) {
          setComments(updated);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reviewId, userId]);

  const refresh = async () => {
    const data = await getReviewComments(reviewId, userId);
    setComments(data);
  };

  return { comments, loading, error, refresh };
}
