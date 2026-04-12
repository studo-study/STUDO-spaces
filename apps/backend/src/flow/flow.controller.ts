import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FlowService } from './flow.service';
import { FolderListResponseDto } from '../folder/folder.dto';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import type {
  CreateFlowBoard,
  FlowBoardOverview,
  FlowBoardResponse,
} from '@studo/types';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@ApiTags('flows')
@ApiBearerAuth()
@Controller('flows')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  // GET ALL FLOWBOARDS ------------------------------------------------
  @ApiOperation({ summary: 'Haal alle flowboards op (admin).' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Alle flowboards opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllFlowboards(): Promise<FlowBoardOverview[]> {
    return this.flowService.getAll();
  }

  // GET FLOWBOARD BY ID ------------------------------------------------
  @ApiOperation({ summary: 'Haal alle flowboards op (admin).' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'flowboard opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get('/board/:flow_id')
  async getFlowboardById(
    @Param('flow_id', ParseUserIdPipe) flow_id: string,
  ): Promise<FlowBoardResponse | null> {
    return this.flowService.getById(flow_id);
  }

  // GET FLOWBOARDS BY USER_ID ------------------------------------------------
  @ApiOperation({ summary: 'Haal alle flowboards op (admin).' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'flowboard opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Get(':user_id')
  async getFlowboardByUserId(
    @Param('user_id', ParseUserIdPipe) user_id: string,
  ): Promise<FlowBoardOverview[]> {
    return this.flowService.getByUserId(user_id);
  }

  // CREATE NEW FLOWBOARDS ------------------------------------------------
  @ApiOperation({ summary: 'Haal alle flowboards op (admin).' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'flowboard opgehaald',
    type: FolderListResponseDto,
  })
  @UseGuards(CheckUserAccessGuard)
  @Roles(Role.USER)
  @Post()
  async creatFlowboard(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateFlowBoard,
  ): Promise<FlowBoardOverview> {
    return this.flowService.createFlowboard(req.user.id, body);
  }

  // DELETE FLOWBOARDS ------------------------------------------------
  @ApiOperation({ summary: 'Verwijder een flowboard.' })
  @ApiParam({ name: 'flow_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Flowboard verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Delete(':flow_id')
  @Roles(Role.USER)
  async deleteFlowboard(@Param('flow_id') flow_id: string): Promise<void> {
    return this.flowService.deleteFlowboard(flow_id);
  }

  // DELETE FLOWROW ------------------------------------------------
  @ApiOperation({ summary: 'Verwijder een flowrow.' })
  @ApiParam({ name: 'row_id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Flowrow verwijderd',
  })
  @UseGuards(CheckUserAccessGuard)
  @Delete('row/:row_id')
  @Roles(Role.USER)
  async deleteFlowrow(@Param('row_id') row_id: string): Promise<void> {
    return this.flowService.deleteFlowrow(row_id);
  }
}
