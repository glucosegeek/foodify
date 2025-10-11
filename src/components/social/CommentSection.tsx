import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Reply, Trash2, Edit2, Send } from 'lucide-react';
import { useRealtimeComments } from '../../hooks/useRealtimeComments';
import { createComment, updateComment, deleteComment, likeComment, unlikeComment, ReviewComment } from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CommentSectionProps {
  reviewId: string;
}

export function CommentSection({ reviewId }: CommentSectionProps) {
  const { user } = useAuth();
  const { comments, loading, refresh } = useRealtimeComments(reviewId, user?.id);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || submitting) return;

    setSubmitting(true);

    try {
      await createComment(reviewId, user.id, newComment, replyTo || undefined);
      setNewComment('');
      setReplyTo(null);
      refresh();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!user || !editContent.trim() || submitting) return;

    setSubmitting(true);

    try {
      await updateComment(commentId, user.id, editContent);
      setEditingComment(null);
      setEditContent('');
      refresh();
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || submitting) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    setSubmitting(true);

    try {
      await deleteComment(commentId, user.id);
      refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string, isLiked: boolean) => {
    if (!user || submitting) return;

    try {
      if (isLiked) {
        await unlikeComment(commentId, user.id);
      } else {
        await likeComment(commentId, user.id);
      }
      refresh();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderComment = (comment: ReviewComment, depth: number = 0) => {
    const isEditing = editingComment === comment.id;
    const isOwner = user?.id === comment.user_id;

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {comment.user?.avatar_url ? (
              <img
                src={comment.user.avatar_url}
                alt={comment.user.full_name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                {comment.user?.full_name?.[0] || comment.user?.username?.[0] || '?'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900">
                {comment.user?.full_name || comment.user?.username || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
              {comment.edited_at && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                    disabled={submitting}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleToggleLike(comment.id, comment.is_liked || false)}
                className={`flex items-center gap-1 text-xs ${
                  comment.is_liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                } transition-colors`}
                disabled={!user || submitting}
              >
                <ThumbsUp className={`w-3 h-3 ${comment.is_liked ? 'fill-current' : ''}`} />
                {comment.like_count > 0 && <span>{comment.like_count}</span>}
              </button>

              {user && depth < 2 && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              )}

              {isOwner && !isEditing && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                    disabled={submitting}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}
            </div>

            {replyTo === comment.id && user && (
              <div className="mt-3 flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setReplyTo(null);
                    setNewComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {user && !replyTo && (
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {user.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
}
