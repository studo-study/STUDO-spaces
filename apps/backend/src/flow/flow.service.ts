import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import type {
  FlowBoardResponse,
  FlowBoardOverview,
  FlowCourseResponse,
  FullFlowCourseResponse,
  FlowRowResponse,
  FlowResourceResponse,
  CreateFlowBoard,
  UpdateFLowBoard,
  CreateFlowCourse,
  UpdateFlowCourse,
  CreateFlowRow,
  UpdateFlowRow,
  CreateFlowResource,
  UpdateFlowResource,
} from '@studo/types';
import { eq } from 'drizzle-orm';
import {
  flowboards,
  flowcourses,
  flowrows,
  flowresources,
  users,
  statusEnum,
  priorityEnum,
  resourceTypeEnum,
} from '../drizzle/schema';

@Injectable()
export class FlowService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  // ─── HELPERS ──────────────────────────────────────────────

  private async getUser(userId: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  private async mapResources(rowId: string): Promise<FlowResourceResponse[]> {
    const resources = await this.db.query.flowresources.findMany({
      where: eq(flowresources.row_id, rowId),
    });
    return resources.map((r) => ({
      id: r.flowresource_id,
      title: r.title,
      link: r.link,
      link_type: r.link_type ?? undefined,
      resource_type: r.resource_type ?? undefined,
    }));
  }

  private async mapRow(
    row: typeof flowrows.$inferSelect,
  ): Promise<FlowRowResponse> {
    const resources = await this.mapResources(row.id);
    return {
      id: row.id,
      course_id: row.flowcourse_id,
      title: row.title,
      description: row.description ?? '',
      priority: row.priority ?? 'no_priority',
      status: row.status ?? 'not_started',
      due_date: row.due_date?.toISOString() ?? '',
      studoset_id: row.studoset ?? '',
      visualset_id: row.visualset ?? '',
      resources,
    };
  }

  private async mapCourse(
    course: typeof flowcourses.$inferSelect,
    includeRows: true,
  ): Promise<FullFlowCourseResponse>;
  private async mapCourse(
    course: typeof flowcourses.$inferSelect,
    includeRows?: false,
  ): Promise<FlowCourseResponse>;
  private async mapCourse(
    course: typeof flowcourses.$inferSelect,
    includeRows = false,
  ): Promise<FlowCourseResponse | FullFlowCourseResponse> {
    const addedBy = await this.getUser(course.added_by);

    const rows = await this.db.query.flowrows.findMany({
      where: eq(flowrows.flowcourse_id, course.id),
    });

    const totalLength = rows.length;
    const totalDone = rows.filter((r) => r.status === 'done').length;
    const totalInProgress = rows.filter((r) => r.status === 'doing').length;

    const base: FlowCourseResponse = {
      id: course.id,
      board_id: course.board_id,
      added_by_display_name: addedBy?.displayName ?? '',
      added_by_id: course.added_by,
      title: course.title,
      icon: course.icon,
      description: course.description ?? '',
      total_done: totalDone,
      total_in_progress: totalInProgress,
      total_length: totalLength,
      resource: course.resource ?? '',
      exam_date: course.exam_date ?? '',
      lesson_days: course.lesson_days ?? '',
    };

    if (!includeRows) return base;

    const mappedRows = await Promise.all(rows.map((r) => this.mapRow(r)));
    return { ...base, rows: mappedRows } satisfies FullFlowCourseResponse;
  }

  private async mapBoardOverview(
    board: typeof flowboards.$inferSelect,
    owner?: typeof users.$inferSelect | null,
  ): Promise<FlowBoardOverview> {
    if (!owner) owner = await this.getUser(board.owner_id);

    const courses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.board_id, board.id),
    });

    let totalLength = 0;
    let totalDone = 0;

    for (const course of courses) {
      const rows = await this.db.query.flowrows.findMany({
        where: eq(flowrows.flowcourse_id, course.id),
      });
      totalLength += rows.length;
      totalDone += rows.filter((r) => r.status === 'done').length;
    }

    return {
      id: board.id,
      owner_id: board.owner_id,
      owner_name: owner?.displayName ?? '',
      owner_pfp: owner?.img_url ?? '',
      title: board.title,
      icon: board.icon,
      creator_id: board.owner_id,
      year: board.year ?? null,
      semester: board.semester ?? null,
      school: board.school_name ?? null,
      school_id: board.school_id ?? null,
      progress:
        totalLength > 0 ? Math.round((totalDone / totalLength) * 100) : 0,
      total_length: totalLength,
    };
  }

  // ─── FLOWBOARDS ───────────────────────────────────────────

  async getAll(): Promise<FlowBoardOverview[]> {
    const boards = await this.db.query.flowboards.findMany();
    return Promise.all(boards.map((b) => this.mapBoardOverview(b)));
  }

  async getById(boardId: string): Promise<FlowBoardResponse> {
    const board = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, boardId),
    });
    if (!board) throw new NotFoundException('Flowboard not found');

    const owner = await this.getUser(board.owner_id);

    const courses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.board_id, board.id),
    });

    const mappedCourses = await Promise.all(
      courses.map((c) => this.mapCourse(c, true)),
    );

    const totalLength = mappedCourses.reduce(
      (sum, c) => sum + c.total_length,
      0,
    );
    const totalDone = mappedCourses.reduce((sum, c) => sum + c.total_done, 0);
    const totalInProgress = mappedCourses.reduce(
      (sum, c) => sum + c.total_in_progress,
      0,
    );

    return {
      id: board.id,
      owner_id: board.owner_id,
      owner_name: owner?.displayName ?? '',
      owner_pfp: owner?.img_url ?? '',
      title: board.title,
      icon: board.icon,
      creator_id: board.owner_id,
      year: board.year ?? null,
      semester: board.semester ?? null,
      school: board.school_name ?? null,
      school_id: board.school_id ?? null,
      total_done: totalDone,
      total_in_progress: totalInProgress,
      total_length: totalLength,
      courses: mappedCourses,
    };
  }

  async getByUserId(userId: string): Promise<FlowBoardOverview[]> {
    const boards = await this.db.query.flowboards.findMany({
      where: eq(flowboards.owner_id, userId),
    });
    const owner = await this.getUser(userId);
    return Promise.all(boards.map((b) => this.mapBoardOverview(b, owner)));
  }

  async createFlowboard(
    userId: string,
    body: CreateFlowBoard,
  ): Promise<FlowBoardOverview> {
    const id = crypto.randomUUID();

    await this.db.insert(flowboards).values({
      id,
      owner_id: userId,
      title: body.title,
      icon: body.icon,
      year: body.year,
      semester: body.semester ?? null,
      school_name: body.school ?? null,
      school_id: body.school_id ?? null,
    });

    const owner = await this.getUser(userId);

    return {
      id,
      owner_id: userId,
      owner_name: owner?.displayName ?? '',
      owner_pfp: owner?.img_url ?? '',
      title: body.title,
      icon: body.icon,
      creator_id: userId,
      year: body.year,
      semester: body.semester ?? null,
      school: body.school ?? null,
      school_id: body.school_id ?? null,
      progress: 0,
      total_length: 0,
    };
  }

  async updateFlowboard(
    boardId: string,
    body: UpdateFLowBoard,
  ): Promise<FlowBoardOverview> {
    const board = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, boardId),
    });
    if (!board) throw new NotFoundException('Flowboard not found');

    await this.db
      .update(flowboards)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.year !== undefined && { year: body.year }),
        ...(body.semester !== undefined && { semester: body.semester }),
        ...(body.school !== undefined && { school_name: body.school }),
        ...(body.school_id !== undefined && { school_id: body.school_id }),
        updated_at: new Date(),
      })
      .where(eq(flowboards.id, boardId));

    const updated = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, boardId),
    });

    return this.mapBoardOverview(updated!);
  }

  async deleteFlowboard(boardId: string): Promise<void> {
    const board = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, boardId),
    });
    if (!board) throw new NotFoundException('Flowboard not found');

    await this.db.delete(flowboards).where(eq(flowboards.id, boardId));
  }

  // ─── FLOWCOURSES ──────────────────────────────────────────

  async getCourseById(courseId: string): Promise<FullFlowCourseResponse> {
    const course = await this.db.query.flowcourses.findFirst({
      where: eq(flowcourses.id, courseId),
    });
    if (!course) throw new NotFoundException('Flowcourse not found');

    return await this.mapCourse(course, true);
  }

  async createCourse(
    userId: string,
    body: CreateFlowCourse,
  ): Promise<FlowCourseResponse> {
    const board = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, body.board_id),
    });
    if (!board) throw new NotFoundException('Flowboard not found');

    const id = crypto.randomUUID();

    await this.db.insert(flowcourses).values({
      id,
      board_id: body.board_id,
      added_by: userId,
      title: body.title,
      icon: body.icon,
      description: body.description ?? null,
      resource: body.resource ?? null,
      exam_date: body.exam_date ?? null,
      lesson_days: body.lesson_days ?? null,
    });

    const addedBy = await this.getUser(userId);

    return {
      id,
      board_id: body.board_id,
      added_by_display_name: addedBy?.displayName ?? '',
      added_by_id: userId,
      title: body.title,
      icon: body.icon,
      description: body.description ?? '',
      total_done: 0,
      total_in_progress: 0,
      total_length: 0,
      resource: body.resource ?? '',
      exam_date: body.exam_date ?? '',
      lesson_days: body.lesson_days ?? '',
    };
  }

  async updateCourse(
    courseId: string,
    body: UpdateFlowCourse,
  ): Promise<FlowCourseResponse> {
    const course = await this.db.query.flowcourses.findFirst({
      where: eq(flowcourses.id, courseId),
    });
    if (!course) throw new NotFoundException('Flowcourse not found');

    await this.db
      .update(flowcourses)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.exam_date !== undefined && { exam_date: body.exam_date }),
        ...(body.lesson_days !== undefined && {
          lesson_days: body.lesson_days,
        }),
      })
      .where(eq(flowcourses.id, courseId));

    const updated = await this.db.query.flowcourses.findFirst({
      where: eq(flowcourses.id, courseId),
    });

    return await this.mapCourse(updated!);
  }

  async deleteCourse(courseId: string): Promise<void> {
    const course = await this.db.query.flowcourses.findFirst({
      where: eq(flowcourses.id, courseId),
    });
    if (!course) throw new NotFoundException('Flowcourse not found');

    await this.db.delete(flowcourses).where(eq(flowcourses.id, courseId));
  }

  // ─── FLOWROWS ─────────────────────────────────────────────

  async createRow(body: CreateFlowRow): Promise<FlowRowResponse> {
    const course = await this.db.query.flowcourses.findFirst({
      where: eq(flowcourses.id, body.course_id),
    });
    if (!course) throw new NotFoundException('Flowcourse not found');

    const id = crypto.randomUUID();

    await this.db.insert(flowrows).values({
      id,
      flowcourse_id: body.course_id,
      title: body.title,
      description: body.description ?? null,
      priority: (body.priority ??
        'no_priority') as (typeof priorityEnum.enumValues)[number],
      status: (body.status ??
        'not_started') as (typeof statusEnum.enumValues)[number],
      due_date: body.due_date ? new Date(body.due_date) : null,
      studoset: body.studoset_id ?? null,
      visualset: body.visualset_id ?? null,
    });

    if (body.resources?.length) {
      await Promise.all(
        body.resources.map((res) =>
          this.db.insert(flowresources).values({
            flowresource_id: crypto.randomUUID(),
            row_id: id,
            title: res.title,
            link: res.link,
            link_type: res.link_type ?? null,
            resource_type: (res.resource_type ?? null) as
              | (typeof resourceTypeEnum.enumValues)[number]
              | null,
          }),
        ),
      );
    }

    return this.mapRow(
      (await this.db.query.flowrows.findFirst({
        where: eq(flowrows.id, id),
      }))!,
    );
  }

  async updateRow(
    rowId: string,
    body: UpdateFlowRow,
  ): Promise<FlowRowResponse> {
    const row = await this.db.query.flowrows.findFirst({
      where: eq(flowrows.id, rowId),
    });
    if (!row) throw new NotFoundException('Flowrow not found');

    await this.db
      .update(flowrows)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.priority !== undefined && {
          priority: body.priority as (typeof priorityEnum.enumValues)[number],
        }),
        ...(body.status !== undefined && {
          status: body.status as (typeof statusEnum.enumValues)[number],
        }),
        ...(body.due_date !== undefined && {
          due_date: body.due_date ? new Date(body.due_date) : null,
        }),
        ...(body.studoset_id !== undefined && { studoset: body.studoset_id }),
        ...(body.visualset_id !== undefined && {
          visualset: body.visualset_id,
        }),
      })
      .where(eq(flowrows.id, rowId));

    const updated = await this.db.query.flowrows.findFirst({
      where: eq(flowrows.id, rowId),
    });

    return this.mapRow(updated!);
  }

  async deleteRow(rowId: string): Promise<void> {
    const row = await this.db.query.flowrows.findFirst({
      where: eq(flowrows.id, rowId),
    });
    if (!row) throw new NotFoundException('Flowrow not found');

    await this.db.delete(flowrows).where(eq(flowrows.id, rowId));
  }

  // ─── FLOWRESOURCES ───────────────────────────────────────

  async createResource(
    rowId: string,
    body: CreateFlowResource,
  ): Promise<FlowResourceResponse> {
    const row = await this.db.query.flowrows.findFirst({
      where: eq(flowrows.id, rowId),
    });
    if (!row) throw new NotFoundException('Flowrow not found');

    const id = crypto.randomUUID();

    await this.db.insert(flowresources).values({
      flowresource_id: id,
      row_id: rowId,
      title: body.title,
      link: body.link,
      link_type: body.link_type ?? null,
      resource_type: (body.resource_type ?? null) as
        | (typeof resourceTypeEnum.enumValues)[number]
        | null,
    });

    return {
      id,
      title: body.title,
      link: body.link,
      link_type: body.link_type,
      resource_type: body.resource_type,
    };
  }

  async updateResource(
    resourceId: string,
    body: UpdateFlowResource,
  ): Promise<FlowResourceResponse> {
    const resource = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresource_id, resourceId),
    });
    if (!resource) throw new NotFoundException('Resource not found');

    await this.db
      .update(flowresources)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.link !== undefined && { link: body.link }),
        ...(body.link_type !== undefined && { link_type: body.link_type }),
        ...(body.resource_type !== undefined && {
          resource_type:
            body.resource_type as (typeof resourceTypeEnum.enumValues)[number],
        }),
      })
      .where(eq(flowresources.flowresource_id, resourceId));

    const updated = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresource_id, resourceId),
    });

    return {
      id: updated!.flowresource_id,
      title: updated!.title,
      link: updated!.link,
      link_type: updated!.link_type ?? undefined,
      resource_type: updated!.resource_type ?? undefined,
    };
  }

  async deleteResource(resourceId: string): Promise<void> {
    const resource = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresource_id, resourceId),
    });
    if (!resource) throw new NotFoundException('Resource not found');

    await this.db
      .delete(flowresources)
      .where(eq(flowresources.flowresource_id, resourceId));
  }
}
