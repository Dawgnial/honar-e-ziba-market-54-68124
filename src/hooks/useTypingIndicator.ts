import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface TypingUser {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export const useTypingIndicator = (conversationId: string, currentUserId: string, currentUserName: string) => {
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(new Map());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const channelName = `typing:${conversationId}`;
    const typingChannel = supabase.channel(channelName);

    typingChannel
      .on('presence', { event: 'sync' }, () => {
        const state = typingChannel.presenceState<TypingUser>();
        const users = new Map<string, TypingUser>();
        
        Object.keys(state).forEach((key) => {
          const presences = state[key];
          if (presences && presences.length > 0) {
            const presence = presences[0];
            // Don't show current user's typing status
            if (presence.userId !== currentUserId) {
              users.set(presence.userId, presence);
            }
          }
        });
        
        setTypingUsers(users);
      })
      .subscribe();

    setChannel(typingChannel);

    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId, currentUserId]);

  const startTyping = useCallback(async () => {
    if (!channel) return;

    await channel.track({
      userId: currentUserId,
      userName: currentUserName,
      isTyping: true,
    });
  }, [channel, currentUserId, currentUserName]);

  const stopTyping = useCallback(async () => {
    if (!channel) return;

    await channel.untrack();
  }, [channel]);

  const isAnyoneTyping = typingUsers.size > 0;
  const typingUserNames = Array.from(typingUsers.values()).map(u => u.userName);

  return {
    isAnyoneTyping,
    typingUserNames,
    startTyping,
    stopTyping,
  };
};
