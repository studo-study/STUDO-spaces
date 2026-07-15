import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { Request as ExpressRequest } from 'express';
import { AllUserChatsResponse } from '@studo/types/dist/chat';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Haal alle chats op van een user.' })
  @ApiResponse({
    status: 200,
    description: 'Alle user chats opgehaald',
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getAllUsersChats(
    @Request() req: AuthenticatedRequest,
  ): Promise<AllUserChatsResponse> {
    return await this.chatService.getAllUsersChats(req.user.id);
  }
}
