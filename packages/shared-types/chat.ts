export interface MessageRequest {
  date: string;
  content: string;
  payload?: PayLoadRequest[];
}

export interface PayLoadRequest {
  flowCourseId?: string;
  studosetId?: string;
  cardId?: string;
}

export interface ChatResponse {
  id: string;
  userId: string;
  boardId: string | null;
  title: string;
  creationDate: string;
  pinned: boolean;
}
export interface MessageRequest {
  id: string;
  date: string;
  content: string;
}
export interface MessageResponse {
  id: string;
  chatId: string;
  svenMessage: boolean;
  sortIndex: number;
  content: string;
  createdAt: string;
}

export interface ChatPayLoadResponse {
  id: string;
  title: string;
  messageId: string;
  flowCourseId?: string;
  studosetId?: string;
  cardId?: string;
}

export interface FullMessageResponse extends MessageResponse {
  payload: ChatPayLoadResponse[];
}

export interface FullChatResponse extends ChatResponse {
  chats: FullMessageResponse[];
}

export interface AllChatsResponse {
  chats: ChatResponse[];
}
export interface AllUserChatsResponse extends AllChatsResponse {}
