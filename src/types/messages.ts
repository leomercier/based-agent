export interface Message {
  role: string;
  content: string;
  sender?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  function: {
    name: string;
    arguments: string;
  };
}

export interface StreamChunk {
  sender?: string;
  content?: string | null;
  tool_calls?: ToolCall[] | null;
  delim?: string;
  response?: any;
}

export interface ResponseObject {
  messages: Message[];
}
