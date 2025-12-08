-- Allow admins to delete support messages (for closing conversations)
CREATE POLICY "Admins can delete messages"
ON public.support_messages
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));