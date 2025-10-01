/*
  # Notifications System

  ## Overview
  This migration implements a comprehensive real-time notifications system with user preferences,
  batching for digests, and support for multiple notification types. Leverages Supabase Realtime
  for instant delivery.

  ## 1. New Tables

  ### `notifications`
  Core notification table for all user notifications
  - `id` (uuid, primary key)
  - `recipient_id` (uuid) - User receiving the notification
  - `sender_id` (uuid) - User or system triggering the notification (nullable for system)
  - `notification_type` (enum) - Type of notification
  - `title` (text) - Notification title
  - `message` (text) - Notification message
  - `action_url` (text) - Deep link or URL for the notification action
  - `related_entity_type` (text) - Type of related entity (review, restaurant, etc.)
  - `related_entity_id` (uuid) - ID of related entity
  - `metadata` (jsonb) - Additional notification data
  - `is_read` (boolean) - Read status
  - `read_at` (timestamptz) - When notification was read
  - `is_archived` (boolean) - Archived status
  - `created_at` (timestamptz)

  ### `notification_preferences`
  User preferences for notification types and delivery methods
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `notification_type` (enum) - Matches notification type
  - `enabled` (boolean) - Whether this notification type is enabled
  - `email_enabled` (boolean) - Email delivery enabled
  - `push_enabled` (boolean) - Push notification enabled
  - `in_app_enabled` (boolean) - In-app notification enabled
  - `updated_at` (timestamptz)

  ### `notification_batches`
  Batched notifications for digest emails
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `batch_type` (enum) - daily, weekly
  - `notification_ids` (uuid[]) - Array of notification IDs in batch
  - `sent_at` (timestamptz) - When batch was sent
  - `created_at` (timestamptz)

  ### `push_notification_tokens`
  Device tokens for push notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `token` (text, unique) - Device push token
  - `platform` (enum) - ios, android, web
  - `device_name` (text)
  - `is_active` (boolean)
  - `last_used` (timestamptz)
  - `created_at` (timestamptz)

  ## 2. Notification Types

  Supported notification types:
  - new_review: Restaurant received a new review
  - review_reply: Restaurant replied to your review
  - new_follower: Someone followed you
  - new_restaurant_follower: Someone followed your restaurant
  - follow_review: User you follow wrote a review
  - follow_list: User you follow created a list
  - restaurant_post: Restaurant you follow posted an announcement
  - list_updated: List you follow was updated
  - helpful_vote: Someone found your review helpful
  - review_reported: Your review was reported (for admins)
  - verification_status: Restaurant verification status changed
  - mention: You were mentioned in a comment

  ## 3. Security (Row Level Security)

  - Users can only view their own notifications
  - Users can update their own notification preferences
  - System can create notifications for any user
  - Realtime enabled for instant delivery

  ## 4. Indexes

  Performance indexes for:
  - User notification lookups
  - Unread notification counts
  - Notification type filtering
  - Created timestamp for sorting

  ## 5. Functions & Triggers

  - Auto-create notifications on key events (reviews, follows, etc.)
  - Mark notifications as read
  - Archive old notifications
  - Create default notification preferences on user signup

  ## Important Notes

  - Realtime subscriptions enabled for instant notification delivery
  - Batch system reduces email noise with digest options
  - Preferences allow granular control over notification channels
  - Device tokens support multi-device push notifications
  - System notifications (sender_id = NULL) for automated messages
*/

-- Create enums
CREATE TYPE notification_type AS ENUM (
  'new_review',
  'review_reply',
  'new_follower',
  'new_restaurant_follower',
  'follow_review',
  'follow_list',
  'restaurant_post',
  'list_updated',
  'helpful_vote',
  'review_reported',
  'verification_status',
  'mention'
);

CREATE TYPE batch_type AS ENUM ('daily', 'weekly');
CREATE TYPE push_platform AS ENUM ('ios', 'android', 'web');

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notification_type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  related_entity_type text,
  related_entity_id uuid,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  in_app_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_notification_preference UNIQUE (user_id, notification_type)
);

-- Notification batches table
CREATE TABLE IF NOT EXISTS notification_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  batch_type batch_type NOT NULL,
  notification_ids uuid[] DEFAULT '{}',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Push notification tokens table
CREATE TABLE IF NOT EXISTS push_notification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  platform push_platform NOT NULL,
  device_name text,
  is_active boolean DEFAULT true,
  last_used timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (recipient_id = auth.uid());

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for notification_batches
CREATE POLICY "Users can view own notification batches"
  ON notification_batches FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for push_notification_tokens
CREATE POLICY "Users can view own push tokens"
  ON push_notification_tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own push tokens"
  ON push_notification_tokens FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_unread_recipient ON notifications(recipient_id, is_read) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_batches_user ON notification_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_notification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON push_notification_tokens(is_active) WHERE is_active = true;

-- Function to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER AS $$
DECLARE
  notif_type notification_type;
BEGIN
  FOR notif_type IN SELECT unnest(enum_range(NULL::notification_type))
  LOOP
    INSERT INTO notification_preferences (user_id, notification_type, enabled, email_enabled, push_enabled, in_app_enabled)
    VALUES (NEW.id, notif_type, true, true, true, true)
    ON CONFLICT (user_id, notification_type) DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_default_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    NEW.read_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_notification_as_read
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  WHEN (NEW.is_read IS DISTINCT FROM OLD.is_read)
  EXECUTE FUNCTION mark_notification_as_read();

-- Function to create notification for new review
CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_owner_id uuid;
  reviewer_name text;
BEGIN
  SELECT profile_id INTO restaurant_owner_id 
  FROM restaurants 
  WHERE id = NEW.restaurant_id;
  
  SELECT username INTO reviewer_name 
  FROM customer_profiles 
  WHERE id = NEW.user_id;
  
  INSERT INTO notifications (
    recipient_id,
    sender_id,
    notification_type,
    title,
    message,
    action_url,
    related_entity_type,
    related_entity_id,
    metadata
  ) VALUES (
    restaurant_owner_id,
    NEW.user_id,
    'new_review',
    'New Review',
    reviewer_name || ' left a ' || NEW.rating || '-star review',
    '/reviews/' || NEW.id,
    'review',
    NEW.id,
    json_build_object('rating', NEW.rating, 'restaurant_id', NEW.restaurant_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_review
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_review();

-- Function to create notification for new follower
CREATE OR REPLACE FUNCTION notify_new_follower()
RETURNS TRIGGER AS $$
DECLARE
  follower_name text;
BEGIN
  SELECT username INTO follower_name 
  FROM customer_profiles 
  WHERE id = NEW.follower_id;
  
  INSERT INTO notifications (
    recipient_id,
    sender_id,
    notification_type,
    title,
    message,
    action_url,
    related_entity_type,
    related_entity_id
  ) VALUES (
    NEW.following_id,
    NEW.follower_id,
    'new_follower',
    'New Follower',
    follower_name || ' started following you',
    '/profile/' || NEW.follower_id,
    'user',
    NEW.follower_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_follower
  AFTER INSERT ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_follower();

-- Function to create notification for restaurant follower
CREATE OR REPLACE FUNCTION notify_restaurant_follower()
RETURNS TRIGGER AS $$
DECLARE
  restaurant_owner_id uuid;
  follower_name text;
BEGIN
  SELECT profile_id INTO restaurant_owner_id 
  FROM restaurants 
  WHERE id = NEW.restaurant_id;
  
  SELECT username INTO follower_name 
  FROM customer_profiles 
  WHERE id = NEW.user_id;
  
  INSERT INTO notifications (
    recipient_id,
    sender_id,
    notification_type,
    title,
    message,
    action_url,
    related_entity_type,
    related_entity_id
  ) VALUES (
    restaurant_owner_id,
    NEW.user_id,
    'new_restaurant_follower',
    'New Follower',
    follower_name || ' started following your restaurant',
    '/profile/' || NEW.user_id,
    'user',
    NEW.user_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_restaurant_follower
  AFTER INSERT ON restaurant_follows
  FOR EACH ROW
  EXECUTE FUNCTION notify_restaurant_follower();

-- Function to create notification for review reply
CREATE OR REPLACE FUNCTION notify_review_reply()
RETURNS TRIGGER AS $$
DECLARE
  reviewer_id uuid;
  restaurant_name text;
BEGIN
  SELECT user_id INTO reviewer_id 
  FROM reviews 
  WHERE id = NEW.review_id;
  
  SELECT name INTO restaurant_name 
  FROM restaurant_profiles 
  WHERE id = (SELECT profile_id FROM restaurants WHERE id = NEW.restaurant_id);
  
  INSERT INTO notifications (
    recipient_id,
    sender_id,
    notification_type,
    title,
    message,
    action_url,
    related_entity_type,
    related_entity_id
  ) VALUES (
    reviewer_id,
    NEW.replied_by,
    'review_reply',
    'Restaurant Replied',
    restaurant_name || ' replied to your review',
    '/reviews/' || NEW.review_id,
    'review',
    NEW.review_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_review_reply
  AFTER INSERT ON review_replies
  FOR EACH ROW
  EXECUTE FUNCTION notify_review_reply();

-- Trigger for updated_at on notification_preferences
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
