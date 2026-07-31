import { Injectable } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { chat } from '../drizzle/schema';
import { AllUserChatsResponse, ChatResponse } from '@studo/types/dist/chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAllUsersChats(id: string): Promise<AllUserChatsResponse> {
    const chats: ChatResponse[] = await this.db.query.chat.findMany({
      where: eq(chat.userId, id),
    });
    return { chats };
  }
}
