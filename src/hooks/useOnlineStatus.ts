import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface OnlineUser {
  userId: string;
  userName: string;
  userRole: 'user' | 'admin';
  lastSeen: string;
}

export const useOnlineStatus = (conversationId: string, userId: string, userName: string, userRole: 'user' | 'admin') => {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(new Map());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!conversationId || !userId) return;

    const channelName = `online:${conversationId}`;
    const onlineChannel = supabase.channel(channelName);

    onlineChannel
      .on('presence', { event: 'sync' }, () => {
        const state = onlineChannel.presenceState<OnlineUser>();
        const users = new Map<string, OnlineUser>();
        
        Object.keys(state).forEach((key) => {
          const presences = state[key];
          if (presences && presences.length > 0) {
            const presence = presences[0];
            users.set(presence.userId, presence);
          }
        });
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track this user as online
          await onlineChannel.track({
            userId,
            userName,
            userRole,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    setChannel(onlineChannel);

    // Update last seen every 30 seconds
    const interval = setInterval(async () => {
      if (onlineChannel) {
        await onlineChannel.track({
          userId,
          userName,
          userRole,
          lastSeen: new Date().toISOString(),
        });
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(onlineChannel);
    };
  }, [conversationId, userId, userName, userRole]);

  const isUserOnline = (checkUserId: string) => {
    return onlineUsers.has(checkUserId);
  };

  const isAdminOnline = () => {
    return Array.from(onlineUsers.values()).some(user => user.userRole === 'admin');
  };

  const isCustomerOnline = () => {
    return Array.from(onlineUsers.values()).some(user => user.userRole === 'user');
  };

  return {
    onlineUsers,
    isUserOnline,
    isAdminOnline,
    isCustomerOnline,
  };
};
