-- Fix infinite recursion in support_messages RLS policies

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON support_messages;

-- Create simpler, non-recursive policies
CREATE POLICY "Authenticated users can view their own messages"
ON support_messages FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

CREATE POLICY "Anonymous users can view support messages"
ON support_messages FOR SELECT
USING (
  auth.uid() IS NULL
);

-- Ensure anonymous users can also update is_read status for their messages
DROP POLICY IF EXISTS "Anonymous users can update their messages" ON support_messages;
CREATE POLICY "Anonymous users can update message read status"
ON support_messages FOR UPDATE
USING (auth.uid() IS NULL)
WITH CHECK (auth.uid() IS NULL);