import { useState } from 'react';
import { MessageCircle, Send, Loader2, User, Mail, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConversations, useSupportChat } from '@/hooks/useSupportChat';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

const AdminSupport = () => {
  const { user } = useSupabaseAuth();
  const { conversations, loading: conversationsLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const { messages, loading: messagesLoading, sendAdminReply } = useSupportChat(
    selectedConversationId || undefined
  );

  const { isAnyoneTyping, typingUserNames, startTyping, stopTyping } = useTypingIndicator(
    selectedConversationId || '',
    user?.id || 'admin',
    'مدیریت'
  );

  const { isCustomerOnline } = useOnlineStatus(
    selectedConversationId || '',
    user?.id || 'admin',
    'مدیریت',
    'admin'
  );

  const selectedConversation = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  );

  const handleSendReply = async () => {
    if (!replyMessage.trim() || sending) return;

    try {
      setSending(true);
      stopTyping();
      await sendAdminReply(replyMessage);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">پیام‌های پشتیبانی</h1>
        <p className="text-muted-foreground">مدیریت و پاسخگویی به پیام‌های کاربران</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              مکالمات ({conversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {conversationsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>هنوز پیامی دریافت نشده است</p>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.conversation_id}
                      onClick={() => setSelectedConversationId(conversation.conversation_id)}
                      className={`w-full p-4 text-right hover:bg-accent transition-colors ${
                        selectedConversationId === conversation.conversation_id
                          ? 'bg-accent'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{conversation.user_name}</span>
                        </div>
                        {conversation.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                      {conversation.user_phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1" dir="ltr">
                          <Phone className="h-3 w-3" />
                          <span>{conversation.user_phone}</span>
                        </div>
                      )}
                      {conversation.user_email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Mail className="h-3 w-3" />
                          <span>{conversation.user_email}</span>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {conversation.last_message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(conversation.last_message_time), 'yyyy/MM/dd HH:mm', {
                            locale: faIR,
                          })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? (
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedConversation.user_name}
                    </div>
                    <Badge 
                      variant={isCustomerOnline() ? "default" : "secondary"}
                      className="text-xs"
                    >
                      <div className={`w-2 h-2 rounded-full mr-1 ${isCustomerOnline() ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {isCustomerOnline() ? 'آنلاین' : 'آفلاین'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {selectedConversation.user_phone && (
                      <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground" dir="ltr">
                        <Phone className="h-4 w-4" />
                        {selectedConversation.user_phone}
                      </div>
                    )}
                    {selectedConversation.user_email && (
                      <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {selectedConversation.user_email}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                'انتخاب مکالمه'
              )}
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 flex flex-col p-0">
            {!selectedConversationId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>یک مکالمه را انتخاب کنید</p>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            <p className="text-xs font-semibold mb-1 opacity-90">
                              {msg.is_from_admin ? 'شما' : msg.user_name}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {format(new Date(msg.created_at), 'HH:mm', { locale: faIR })}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isAnyoneTyping && (
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs opacity-90">
                                {typingUserNames.join(', ')} در حال نوشتن...
                              </span>
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Reply Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={replyMessage}
                      onChange={handleReplyChange}
                      onKeyPress={handleKeyPress}
                      onBlur={stopTyping}
                      placeholder="پاسخ خود را بنویسید..."
                      className="min-h-[80px] max-h-[150px] resize-none text-right"
                      disabled={sending}
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || sending}
                      size="icon"
                      className="h-[80px] w-[80px] shrink-0"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSupport;
