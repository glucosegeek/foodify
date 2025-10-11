import { supabase } from '../lib/supabase';

export interface ReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  mentions: string[];
  edited_at?: string;
  is_deleted: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  replies?: ReviewComment[];
  is_liked?: boolean;
}

export interface CommentLike {
  user_id: string;
  comment_id: string;
  created_at: string;
}

export async function getReviewComments(reviewId: string, userId?: string): Promise<ReviewComment[]> {
  try {
    const { data: comments, error } = await supabase
      .from('review_comments')
      .select(`
        *,
        user:profiles!review_comments_user_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq('review_id', reviewId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!comments) return [];

    let commentLikes: string[] = [];
    if (userId) {
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', comments.map(c => c.id));

      commentLikes = likes?.map(l => l.comment_id) || [];
    }

    const commentsWithLikes = comments.map(comment => ({
      ...comment,
      is_liked: commentLikes.includes(comment.id),
    }));

    const commentMap = new Map<string, ReviewComment>();
    const rootComments: ReviewComment[] = [];

    commentsWithLikes.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    commentsWithLikes.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;

      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(
  reviewId: string,
  userId: string,
  content: string,
  parentCommentId?: string,
  mentions?: string[]
): Promise<{ success: boolean; comment?: ReviewComment; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('review_comments')
      .insert({
        review_id: reviewId,
        user_id: userId,
        content,
        parent_comment_id: parentCommentId,
        mentions: mentions || [],
      })
      .select(`
        *,
        user:profiles!review_comments_user_id_fkey(id, username, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    if (mentions && mentions.length > 0) {
      await createMentionNotifications(reviewId, userId, mentions, content);
    }

    return { success: true, comment: data as ReviewComment };
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return { success: false, error: error.message };
  }
}

export async function updateComment(
  commentId: string,
  userId: string,
  content: string,
  mentions?: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('review_comments')
      .update({
        content,
        edited_at: new Date().toISOString(),
        mentions: mentions || [],
      })
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating comment:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('review_comments')
      .update({
        is_deleted: true,
        content: '[deleted]',
      })
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }
}

export async function likeComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: userId,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error liking comment:', error);
    return { success: false, error: error.message };
  }
}

export async function unlikeComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error unliking comment:', error);
    return { success: false, error: error.message };
  }
}

export async function getCommentLikeCount(commentId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('comment_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

export async function isCommentLiked(
  commentId: string,
  userId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error('Error checking if comment is liked:', error);
    return false;
  }
}

async function createMentionNotifications(
  reviewId: string,
  mentionerUserId: string,
  mentionedUserIds: string[],
  content: string
): Promise<void> {
  try {
    const notifications = mentionedUserIds.map(userId => ({
      recipient_id: userId,
      actor_id: mentionerUserId,
      type: 'mention',
      entity_type: 'comment',
      entity_id: reviewId,
      message: `mentioned you in a comment: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
    }));

    await supabase.from('notifications').insert(notifications);
  } catch (error) {
    console.error('Error creating mention notifications:', error);
  }
}

export async function getCommentCount(reviewId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('review_comments')
      .select('*', { count: 'exact', head: true })
      .eq('review_id', reviewId)
      .eq('is_deleted', false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
}
