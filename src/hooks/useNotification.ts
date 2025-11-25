import { useState, useEffect, useCallback } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const useNotification = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('chat_notification_muted');
    return stored === 'true';
  });
  
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return Notification.permission;
  }, []);

  const playNotificationSound = useCallback(() => {
    if (isMuted) return;

    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Create a pleasant notification sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      setTimeout(() => {
        audioContext.close();
      }, 500);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [isMuted]);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    // Don't show if window is focused
    if (document.hasFocus()) {
      return;
    }

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/logo.png',
          tag: options.tag,
          dir: 'rtl',
          lang: 'fa'
        });
      } else if (Notification.permission === 'default') {
        const perm = await requestPermission();
        if (perm === 'granted') {
          new Notification(options.title, {
            body: options.body,
            icon: options.icon || '/logo.png',
            tag: options.tag,
            dir: 'rtl',
            lang: 'fa'
          });
        }
      }
    }
  }, [requestPermission]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('chat_notification_muted', String(newValue));
      return newValue;
    });
  }, []);

  const notify = useCallback((options: NotificationOptions) => {
    playNotificationSound();
    showNotification(options);
  }, [playNotificationSound, showNotification]);

  return {
    notify,
    playNotificationSound,
    showNotification,
    isMuted,
    toggleMute,
    permission,
    requestPermission
  };
};
