import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FlowService } from './flow.service';
import { FolderListResponseDto } from '../folder/folder.dto';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import { FlowBoardOverview, FlowBoardResponse } from '@studo/types';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';

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
  @Roles(Role.ADMIN, Role.USER)
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
  @Roles(Role.ADMIN, Role.USER)
  @Get(':user_id')
  async getFlowboardByUserId(
    @Param('user_id', ParseUserIdPipe) user_id: string,
  ): Promise<FlowBoardOverview[]> {
    return this.flowService.getByUserId(user_id);
  }
}
