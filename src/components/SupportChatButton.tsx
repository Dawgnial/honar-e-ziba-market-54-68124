import { useState, useEffect } from 'react';
import { MessageCircle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import SupportChatWindow from './SupportChatWindow';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupportChat, SupportMessage } from '@/hooks/useSupportChat';
import { useNotification } from '@/hooks/useNotification';

const SupportChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { notify, isMuted, toggleMute } = useNotification();

  useEffect(() => {
    const storedConversationId = localStorage.getItem('support_conversation_id');
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, []);

  const handleNewMessage = (message: SupportMessage) => {
    if (!isOpen) {
      setHasNewMessage(true);
      notify({
        title: 'پیام جدید از پشتیبانی',
        body: message.message.substring(0, 50) + (message.message.length > 50 ? '...' : ''),
        tag: 'support-chat'
      });
    }
  };

  const { unreadCount } = useSupportChat(conversationId || undefined, handleNewMessage);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-[9999]"
          >
            <div className="relative">
              <motion.div
                animate={hasNewMessage ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 10px 30px rgba(var(--primary), 0.3)',
                    '0 15px 40px rgba(var(--primary), 0.5)',
                    '0 10px 30px rgba(var(--primary), 0.3)'
                  ]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: hasNewMessage ? Infinity : 0,
                  repeatType: 'loop'
                }}
              >
                <Button
                  onClick={handleOpen}
                  size="lg"
                  className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground relative"
                >
                  <MessageCircle className="h-7 w-7" />
                </Button>
              </motion.div>
              
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-6 min-w-6 flex items-center justify-center bg-destructive text-destructive-foreground border-2 border-background px-1.5"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 bottom-6 z-[9999]"
          >
            <div className="bg-background border border-border rounded-lg shadow-2xl w-[380px] h-[600px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold text-base">پشتیبانی</h3>
                    <p className="text-xs opacity-90">آنلاین - پاسخگویی سریع</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
                    title={isMuted ? 'روشن کردن صدا' : 'خاموش کردن صدا'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Window */}
              <SupportChatWindow onClose={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatButton;
