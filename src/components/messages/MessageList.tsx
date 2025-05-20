import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  Badge 
} from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Trash2, 
  Home, 
  User, 
  Mail, 
  Clock, 
  CheckCircle, 
  Circle 
} from 'lucide-react';
import { MessageConversation } from './MessageConversation';

export interface Message {
  _id: string;
  subject: string;
  message: string;
  property: {
    _id: string;
    title: string;
    images: string[];
  };
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onDeleteMessage: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
  onReply: (message: Message, replyText: string) => void;
  loading: boolean;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  onDeleteMessage, 
  onMarkAsRead,
  onReply,
  loading 
}: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (selectedMessage) {
    return (
      <MessageConversation 
        message={selectedMessage}
        currentUserId={currentUserId}
        onBack={() => setSelectedMessage(null)}
        onReply={(replyText) => {
          onReply(selectedMessage, replyText);
        }}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mb-4 flex justify-center">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Messages</h3>
          <p className="text-gray-500 mb-4">
            You don't have any messages yet. When you receive messages, they will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isReceived = message.recipient._id === currentUserId;
        const otherPerson = isReceived ? message.sender : message.recipient;
        
        return (
          <Card 
            key={message._id} 
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${!message.read && isReceived ? 'border-l-4 border-l-blue-500' : ''}`}
            onClick={() => {
              if (!message.read && isReceived) {
                onMarkAsRead(message._id);
              }
              setSelectedMessage(message);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${otherPerson.name}&background=random`} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium flex items-center gap-2">
                      {otherPerson.name}
                      {!message.read && isReceived && (
                        <Badge variant="default" className="ml-2 bg-blue-500">New</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium mb-1">{message.subject}</div>
                  
                  <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {message.message}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <Home className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[200px]">{message.property.title}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {isReceived && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!message.read) {
                                    onMarkAsRead(message._id);
                                  }
                                }}
                              >
                                {message.read ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {message.read ? 'Read' : 'Mark as read'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMessage(message._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Delete message
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
