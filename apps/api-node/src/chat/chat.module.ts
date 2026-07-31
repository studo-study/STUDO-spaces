import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [DrizzleModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
