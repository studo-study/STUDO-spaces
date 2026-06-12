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
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FlowService } from './flow.service';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';
import type {
  CreateFlowBoard,
  UpdateFLowBoard,
  CreateFlowCourse,
  UpdateFlowCourse,
  CreateFlowRow,
  UpdateFlowRow,
  CreateFlowResource,
  UpdateFlowResource,
  FlowBoardOverview,
  FlowBoardResponse,
  FlowCourseResponse,
  FullFlowCourseResponse,
  FlowRowResponse,
  FlowResourceResponse,
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
@UseGuards(CheckUserAccessGuard)
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  // ─── FLOWBOARDS ───────────────────────────────────────────

  @ApiOperation({ summary: 'Haal alle flowboards op (admin).' })
  @ApiResponse({ status: 200, description: 'Alle flowboards opgehaald' })
  @Roles(Role.ADMIN)
  @Get()
  async getAllFlowboards(): Promise<FlowBoardOverview[]> {
    return this.flowService.getAll();
  }

  @ApiOperation({ summary: 'Haal flowboards op van een user.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowboards van user opgehaald' })
  @Roles(Role.USER)
  @Get('user/:user_id')
  async getFlowboardsByUserId(
    @Param('user_id', ParseUserIdPipe) userId: string,
  ): Promise<FlowBoardOverview[]> {
    return this.flowService.getByUserId(userId);
  }

  @ApiOperation({ summary: 'Haal een volledig flowboard op.' })
  @ApiParam({ name: 'board_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowboard opgehaald' })
  @Roles(Role.USER)
  @Get('board/:board_id')
  async getFlowboardById(
    @Param('board_id') boardId: string,
  ): Promise<FlowBoardResponse> {
    return this.flowService.getById(boardId);
  }

  @ApiOperation({ summary: 'Maak een nieuw flowboard aan.' })
  @ApiResponse({ status: 201, description: 'Flowboard aangemaakt' })
  @Roles(Role.USER)
  @Post('board')
  async createFlowboard(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateFlowBoard,
  ): Promise<FlowBoardOverview> {
    return this.flowService.createFlowboard(req.user.id, body);
  }

  @ApiOperation({ summary: 'Update een flowboard.' })
  @ApiParam({ name: 'board_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowboard geüpdatet' })
  @Roles(Role.USER)
  @Patch('board/:board_id')
  async updateFlowboard(
    @Param('board_id') boardId: string,
    @Body() body: UpdateFLowBoard,
  ): Promise<FlowBoardOverview> {
    return this.flowService.updateFlowboard(boardId, body);
  }

  @ApiOperation({ summary: 'Verwijder een flowboard.' })
  @ApiParam({ name: 'board_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowboard verwijderd' })
  @Roles(Role.USER)
  @Delete('board/:board_id')
  async deleteFlowboard(@Param('board_id') boardId: string): Promise<void> {
    return this.flowService.deleteFlowboard(boardId);
  }

  // ─── FLOWCOURSES ──────────────────────────────────────────

  @ApiOperation({ summary: 'Haal alle flowcourses op van een user.' })
  @ApiParam({ name: 'user_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowcourses van user opgehaald' })
  @Roles(Role.USER)
  @Get('courses/user/:user_id')
  async getCoursesByUserId(
    @Param('user_id', ParseUserIdPipe) userId: string,
  ): Promise<FlowCourseResponse[]> {
    return this.flowService.getCoursesByUserId(userId);
  }

  @ApiOperation({ summary: 'Haal een flowcourse op met rows.' })
  @ApiParam({ name: 'course_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowcourse opgehaald' })
  @Roles(Role.USER)
  @Get('course/:course_id')
  async getCourseById(
    @Param('course_id') courseId: string,
  ): Promise<FullFlowCourseResponse> {
    return this.flowService.getCourseById(courseId);
  }

  @ApiOperation({ summary: 'Maak een nieuwe flowcourse aan.' })
  @ApiResponse({ status: 201, description: 'Flowcourse aangemaakt' })
  @Roles(Role.USER)
  @Post('course')
  async createCourse(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateFlowCourse,
  ): Promise<FlowCourseResponse> {
    return this.flowService.createCourse(req.user.id, body);
  }

  @ApiOperation({ summary: 'Update een flowcourse.' })
  @ApiParam({ name: 'course_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowcourse geüpdatet' })
  @Roles(Role.USER)
  @Patch('course/:course_id')
  async updateCourse(
    @Param('course_id') courseId: string,
    @Body() body: UpdateFlowCourse,
  ): Promise<FlowCourseResponse> {
    return this.flowService.updateCourse(courseId, body);
  }

  @ApiOperation({ summary: 'Verwijder een flowcourse.' })
  @ApiParam({ name: 'course_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowcourse verwijderd' })
  @Roles(Role.USER)
  @Delete('course/:course_id')
  async deleteCourse(@Param('course_id') courseId: string): Promise<void> {
    return this.flowService.deleteCourse(courseId);
  }

  // ─── FLOWROWS ─────────────────────────────────────────────

  @ApiOperation({ summary: 'Maak een nieuwe flowrow aan.' })
  @ApiResponse({ status: 201, description: 'Flowrow aangemaakt' })
  @Roles(Role.USER)
  @Post('row')
  async createRow(@Body() body: CreateFlowRow): Promise<FlowRowResponse> {
    return this.flowService.createRow(body);
  }

  @ApiOperation({ summary: 'Update een flowrow.' })
  @ApiParam({ name: 'row_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowrow geüpdatet' })
  @Roles(Role.USER)
  @Patch('row/:row_id')
  async updateRow(
    @Param('row_id') rowId: string,
    @Body() body: UpdateFlowRow,
  ): Promise<FlowRowResponse> {
    return this.flowService.updateRow(rowId, body);
  }

  @ApiOperation({ summary: 'Verwijder een flowrow.' })
  @ApiParam({ name: 'row_id', type: String })
  @ApiResponse({ status: 200, description: 'Flowrow verwijderd' })
  @Roles(Role.USER)
  @Delete('row/:row_id')
  async deleteRow(@Param('row_id') rowId: string): Promise<void> {
    return this.flowService.deleteRow(rowId);
  }

  // ─── FLOWRESOURCES ───────────────────────────────────────

  @ApiOperation({ summary: 'Voeg een resource toe aan een row.' })
  @ApiParam({ name: 'row_id', type: String })
  @ApiResponse({ status: 201, description: 'Resource aangemaakt' })
  @Roles(Role.USER)
  @Post('row/:row_id/resource')
  async createResource(
    @Param('row_id') rowId: string,
    @Body() body: CreateFlowResource,
  ): Promise<FlowResourceResponse> {
    return this.flowService.createResource(rowId, body);
  }

  @ApiOperation({ summary: 'Update een resource.' })
  @ApiParam({ name: 'resource_id', type: String })
  @ApiResponse({ status: 200, description: 'Resource geüpdatet' })
  @Roles(Role.USER)
  @Patch('resource/:resource_id')
  async updateResource(
    @Param('resource_id') resourceId: string,
    @Body() body: UpdateFlowResource,
  ): Promise<FlowResourceResponse> {
    return this.flowService.updateResource(resourceId, body);
  }

  @ApiOperation({ summary: 'Verwijder een resource.' })
  @ApiParam({ name: 'resource_id', type: String })
  @ApiResponse({ status: 200, description: 'Resource verwijderd' })
  @Roles(Role.USER)
  @Delete('resource/:resource_id')
  async deleteResource(
    @Param('resource_id') resourceId: string,
  ): Promise<void> {
    return this.flowService.deleteResource(resourceId);
  }
}
