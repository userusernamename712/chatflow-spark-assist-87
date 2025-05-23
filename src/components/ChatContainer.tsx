
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle, MessageSquare, User } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Message } from '@/types/chat';

type ChatContainerProps = {
  messages: Message[];
  isProcessing: boolean;
  onSendTypicalQuestion?: (question: string) => void;
};

const ChatContainer = ({ messages, isProcessing, onSendTypicalQuestion }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if any message is streaming, and scroll on each streaming update
  useEffect(() => {
    const streamingMessage = messages.find(msg => msg.isStreaming);
    if (streamingMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.map(m => m.isStreaming ? m.content : '').join('')]);

  const handleQuestionClick = (question: string) => {
    if (onSendTypicalQuestion) {
      onSendTypicalQuestion(question);
    }
  };

  return (
    <ScrollArea className="flex-1 p-2 bg-white">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="rounded-full bg-[var(--primary--color-medium)] p-4 mb-4">
            <MessageSquare className="h-6 w-6 text-[var(--primary-color)]" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-[var(--neutral-color-dark)]">Welcome</h3>
          <p className="text-sm text-[var(--neutral-color-medium)] max-w-md mb-6">
            I'm your AI assistant. Ask me questions or request information to get started.
          </p>
          <div className="mt-4 flex flex-col space-y-3">
            <div 
              className="flex items-center card-darken-hover p-3 rounded-sm text-sm text-[var(--neutral-color-medium)] border-l-2 border-[var(--primary-color)] cursor-pointer"
              onClick={() => handleQuestionClick("What can you help me with?")}
            >
              <HelpCircle className="h-3 w-3 mr-2 text-[var(--primary-color)]" />
              <span>Try asking "What can you help me with?"</span>
            </div>
            <div 
              className="flex items-center card-darken-hover p-3 rounded-sm text-sm text-[var(--neutral-color-medium)] border-l-2 border-[var(--primary-color)] cursor-pointer"
              onClick={() => handleQuestionClick("Tell me about my account")}
            >
              <MessageSquare className="h-3 w-3 mr-2 text-[var(--primary-color)]" />
              <span>Or "Tell me about my account"</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1 px-1">
          {messages.map((message) => {
            if (message.type === 'user') {
              return (
                <MessageBubble
                  key={message.id}
                  type="user"
                  content={message.content}
                />
              );
            } else if (message.type === 'tool_call') {
              return (
                <MessageBubble
                  key={message.id}
                  type="tool"
                  content="Looking up information for you..."
                  toolName={message.tool}
                  toolArgs={message.arguments}
                  toolResult={message.result}
                />
              );
            } else {
              return (
                <MessageBubble
                  key={message.id}
                  type="assistant"
                  content={message.content}
                  isStreaming={message.isStreaming}
                />
              );
            }
          })}
          {isProcessing && !messages.some(msg => msg.isStreaming) && (
            <div className="flex space-x-2 p-2 items-center justify-center">
              <div className="h-1.5 w-1.5 bg-[var(--primary-color)] rounded-full animate-pulse"></div>
              <div className="h-1.5 w-1.5 bg-[var(--primary-color)] rounded-full animate-pulse delay-150"></div>
              <div className="h-1.5 w-1.5 bg-[var(--primary-color)] rounded-full animate-pulse delay-300"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatContainer;
