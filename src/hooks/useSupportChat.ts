import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export interface SupportMessage {
  id: string;
  conversation_id: string;
  user_id: string | null;
  user_name: string;
  user_email: string | null;
  message: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  conversation_id: string;
  user_name: string;
  user_email: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useSupportChat = (conversationId?: string) => {
  const { user } = useSupabaseAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('خطا در بارگذاری پیام‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    if (!conversationId) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`support-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async (message: string, userName: string, userEmail?: string) => {
    if (!conversationId || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user?.id || null,
          user_name: userName,
          user_email: userEmail || null,
          message: message.trim(),
          is_from_admin: false,
          is_read: false
        });

      if (error) throw error;
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
      throw error;
    }
  };

  const sendAdminReply = async (message: string) => {
    if (!conversationId || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user?.id || null,
          user_name: 'مدیریت',
          user_email: null,
          message: message.trim(),
          is_from_admin: true,
          is_read: false
        });

      if (error) throw error;
      await loadMessages();
    } catch (error) {
      console.error('Error sending admin reply:', error);
      toast.error('خطا در ارسال پاسخ');
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    sendAdminReply,
    markAsRead,
    refreshMessages: loadMessages
  };
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation_id
      const grouped = (data || []).reduce((acc, msg) => {
        if (!acc[msg.conversation_id]) {
          acc[msg.conversation_id] = {
            conversation_id: msg.conversation_id,
            user_name: msg.user_name,
            user_email: msg.user_email,
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: 0,
            messages: []
          };
        }
        
        if (!msg.is_read && !msg.is_from_admin) {
          acc[msg.conversation_id].unread_count++;
        }
        
        if (new Date(msg.created_at) > new Date(acc[msg.conversation_id].last_message_time)) {
          acc[msg.conversation_id].last_message = msg.message;
          acc[msg.conversation_id].last_message_time = msg.created_at;
        }
        
        return acc;
      }, {} as Record<string, any>);

      setConversations(Object.values(grouped));
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('خطا در بارگذاری مکالمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('support-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    conversations,
    loading,
    refreshConversations: loadConversations
  };
};
