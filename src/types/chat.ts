
export interface ChatRequest {
  session_id: string | null;
  customer_id: string;
  prompt: string;
}

export interface ChatEvent {
  type: 'text' | 'tool_call' | 'error' | 'meta';
  message?: string;
  finished?: boolean;
  tool?: string;
  arguments?: Record<string, any>;
  result?: any;
  session_id?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'tool_call';
  content: string;
  isStreaming?: boolean;
  tool?: string;
  arguments?: Record<string, any>;
  result?: any;
}
