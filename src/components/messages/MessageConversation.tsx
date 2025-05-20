import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Home 
} from 'lucide-react';
import { Message } from './MessageList';

interface MessageConversationProps {
  message: Message;
  currentUserId: string;
  onBack: () => void;
  onReply: (replyText: string) => void;
}

export function MessageConversation({ 
  message, 
  currentUserId, 
  onBack, 
  onReply 
}: MessageConversationProps) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReceived = message.recipient._id === currentUserId;
  const otherPerson = isReceived ? message.sender : message.recipient;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(replyText);
      setReplyText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Conversation</h3>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{message.subject}</CardTitle>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <Home className="h-3 w-3 mr-1" />
                {message.property.title}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="mt-1">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${message.sender.name}&background=random`} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium text-sm">{message.sender.name}</div>
              <div className="text-sm text-gray-500 mb-2">{message.sender.email}</div>
              <div className="p-3 bg-gray-100 rounded-lg">
                {message.message}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Reply to {otherPerson.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Write your reply here..."
              className="min-h-[120px] mb-3"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!replyText.trim() || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reply'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
