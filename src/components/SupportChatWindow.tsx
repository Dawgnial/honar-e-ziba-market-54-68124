import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { useSupportChat } from '@/hooks/useSupportChat';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface SupportChatWindowProps {
  onClose: () => void;
}

const SupportChatWindow = ({ onClose }: SupportChatWindowProps) => {
  const { user, userProfile } = useSupabaseAuth();
  const [conversationId, setConversationId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, loading, sendMessage } = useSupportChat(conversationId || undefined);
  
  const { isAnyoneTyping, typingUserNames, startTyping, stopTyping } = useTypingIndicator(
    conversationId || '',
    user?.id || 'anonymous',
    userName || 'کاربر'
  );

  useEffect(() => {
    // Load conversation ID from localStorage or create new one
    const storedConversationId = localStorage.getItem('support_conversation_id');
    if (storedConversationId) {
      setConversationId(storedConversationId);
      setShowNameForm(false);
    } else {
      const newConversationId = crypto.randomUUID();
      setConversationId(newConversationId);
      localStorage.setItem('support_conversation_id', newConversationId);
    }

    // Set user info if logged in
    if (user && userProfile) {
      setUserName(userProfile.name || '');
      setUserEmail(userProfile.email || '');
    }
  }, [user, userProfile]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = () => {
    if (!userName.trim()) return;
    setShowNameForm(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      stopTyping();
      await sendMessage(message, userName, userEmail);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showNameForm) {
        handleStartChat();
      } else {
        handleSendMessage();
      }
    }
  };

  if (showNameForm) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-lg mb-2">خوش آمدید!</h4>
          <p className="text-sm text-muted-foreground">
            لطفاً اطلاعات خود را وارد کنید تا بتوانیم بهتر به شما کمک کنیم
          </p>
        </div>
        
        <div className="w-full space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">نام *</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              onKeyPress={handleKeyPress}
              className="text-right"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">ایمیل (اختیاری)</label>
            <Input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="ایمیل خود را وارد کنید"
              onKeyPress={handleKeyPress}
              className="text-right"
            />
          </div>

          <Button
            onClick={handleStartChat}
            disabled={!userName.trim()}
            className="w-full"
          >
            شروع گفتگو
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div>
              <p className="text-muted-foreground mb-2">
                هنوز پیامی ارسال نشده است
              </p>
              <p className="text-sm text-muted-foreground">
                سوال یا مشکل خود را با ما در میان بگذارید
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.is_from_admin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.is_from_admin
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {msg.is_from_admin && (
                    <p className="text-xs font-semibold mb-1 opacity-90">
                      {msg.user_name}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.is_from_admin ? 'opacity-70' : 'opacity-90'}`}>
                    {format(new Date(msg.created_at), 'HH:mm', { locale: faIR })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isAnyoneTyping && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs opacity-70">
                      {typingUserNames.join(', ')} در حال نوشتن...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            onBlur={stopTyping}
            placeholder="پیام خود را بنویسید..."
            className="min-h-[60px] max-h-[120px] resize-none text-right"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SupportChatWindow;
