import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { asc, eq } from 'drizzle-orm';
import { chat } from '../drizzle/schema';
import {
  AllUserChatsResponse,
  ChatResponse,
  FullChatResponse,
} from '@studo/types/dist/chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAllChats() {}
  async getAllUsersChats(id: string): Promise<AllUserChatsResponse> {
    const chats: ChatResponse[] = await this.db.query.chat.findMany({
      where: eq(chat.userId, id),
    });
    return {
      chats: chats,
    };
  }

  async getChatById(id: string): Promise<FullChatResponse> {
    const result = await this.db.query.chat.findFirst({
      where: eq(chat.id, id),
      with: {
        messages: {
          orderBy: (message) => [asc(message.sortIndex)],
          with: {
            payloads: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(`Chat ${id} not found`);
    }

    return {
      id: result.id,
      userId: result.userId,
      boardId: result.boardId,
      title: result.title,
      creationDate: result.creationDate,
      pinned: result.pinned,
      chats: result.messages.map((message) => ({
        id: message.id,
        chatId: message.chatId,
        svenMessage: message.svenMessage,
        sortIndex: message.sortIndex,
        content: message.content,
        createdAt: message.createdAt,
        payload: message.payloads.map((payload) => ({
          id: payload.id,
          title: payload.title,
          messageId: payload.messageId,
          flowCourseId: payload.flowcourseId ?? undefined,
          studosetId: payload.studosetId ?? undefined,
          cardId: payload.cardId ?? undefined,
        })),
      })),
    };
  }
}
