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
      where: eq(flowresources.rowId, rowId),
    });
    return resources.map((r) => ({
      id: r.flowresourceId,
      title: r.title,
      link: r.link,
      linkType: r.linkType ?? undefined,
      resourceType: r.resourceType ?? undefined,
    }));
  }

  private async mapRow(
    row: typeof flowrows.$inferSelect,
  ): Promise<FlowRowResponse> {
    const resources = await this.mapResources(row.id);
    return {
      id: row.id,
      courseId: row.flowcourseId,
      title: row.title,
      orderIndex: row.orderIndex ?? 0,
      description: row.description ?? '',
      priority: row.priority ?? 'no_priority',
      status: row.status ?? 'not_started',
      dueDate: row.dueDate?.toISOString() ?? '',
      studosetId: row.studoset ?? '',
      visualsetId: row.visualset ?? '',
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
    const addedBy = await this.getUser(course.addedBy);

    const rows = await this.db.query.flowrows.findMany({
      where: eq(flowrows.flowcourseId, course.id),
    });

    const totalLength = rows.length;
    const totalDone = rows.filter((r) => r.status === 'done').length;
    const totalInProgress = rows.filter((r) => r.status === 'doing').length;

    const base: FlowCourseResponse = {
      id: course.id,
      boardId: course?.boardId ?? null,
      addedByDisplayName: addedBy?.displayName ?? '',
      addedById: course.addedBy,
      title: course.title,
      icon: course.icon,
      description: course.description ?? '',
      totalDone: totalDone,
      totalInProgress: totalInProgress,
      totalLength: totalLength,
      resource: course.resource ?? '',
      examDate: course.examDate ?? '',
      lessonDays: course.lessonDays ?? '',
    };

    if (!includeRows) return base;

    const sortedRows = [...rows].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
    );
    const mappedRows = await Promise.all(sortedRows.map((r) => this.mapRow(r)));
    return { ...base, rows: mappedRows } satisfies FullFlowCourseResponse;
  }

  private async mapBoardOverview(
    board: typeof flowboards.$inferSelect,
    owner?: typeof users.$inferSelect | null,
  ): Promise<FlowBoardOverview> {
    if (!owner) owner = await this.getUser(board.ownerId);

    const courses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.boardId, board.id),
    });

    let totalLength = 0;
    let totalDone = 0;

    for (const course of courses) {
      const rows = await this.db.query.flowrows.findMany({
        where: eq(flowrows.flowcourseId, course.id),
      });
      totalLength += rows.length;
      totalDone += rows.filter((r) => r.status === 'done').length;
    }

    return {
      id: board.id,
      ownerId: board.ownerId,
      ownerName: owner?.displayName ?? '',
      ownerPfp: owner?.imgUrl ?? '',
      title: board.title,
      icon: board.icon,
      creatorId: board.ownerId,
      year: board.year ?? null,
      semester: board.semester ?? null,
      school: board.schoolName ?? null,
      schoolId: board.schoolId ?? null,
      progress:
        totalLength > 0 ? Math.round((totalDone / totalLength) * 100) : 0,
      totalLength: totalLength,
      totalDone: totalDone,
      totalInProgress: totalLength - totalDone,
      courses: courses.length,
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

    const owner = await this.getUser(board.ownerId);

    const courses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.boardId, board.id),
    });

    const mappedCourses = await Promise.all(
      courses.map((c) => this.mapCourse(c, true)),
    );

    const totalLength = mappedCourses.reduce(
      (sum, c) => sum + c.totalLength,
      0,
    );
    const totalDone = mappedCourses.reduce((sum, c) => sum + c.totalDone, 0);
    const totalInProgress = mappedCourses.reduce(
      (sum, c) => sum + c.totalInProgress,
      0,
    );

    return {
      id: board.id,
      ownerId: board.ownerId,
      ownerName: owner?.displayName ?? '',
      ownerPfp: owner?.imgUrl ?? '',
      title: board.title,
      icon: board.icon,
      creatorId: board.ownerId,
      year: board.year ?? null,
      semester: board.semester ?? null,
      school: board.schoolName ?? null,
      schoolId: board.schoolId ?? null,
      totalDone: totalDone,
      totalInProgress: totalInProgress,
      totalLength: totalLength,
      courses: mappedCourses,
    };
  }

  async getByUserId(userId: string): Promise<FlowBoardOverview[]> {
    const boards = await this.db.query.flowboards.findMany({
      where: eq(flowboards.ownerId, userId),
    });
    const owner = await this.getUser(userId);
    return Promise.all(boards.map((b) => this.mapBoardOverview(b, owner)));
  }

  async getCoursesByUserId(userId: string): Promise<FlowCourseResponse[]> {
    const allCourses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.addedBy, userId),
    });
    return Promise.all(allCourses.map((c) => this.mapCourse(c)));
  }

  async createFlowboard(
    userId: string,
    body: CreateFlowBoard,
  ): Promise<FlowBoardOverview> {
    const id = crypto.randomUUID();

    await this.db.insert(flowboards).values({
      id,
      ownerId: userId,
      title: body.title,
      icon: body.icon,
      year: body.year,
      semester: body.semester ?? null,
      schoolName: body.school ?? null,
      schoolId: body.schoolId ?? null,
    });

    const owner = await this.getUser(userId);

    return {
      id,
      ownerId: userId,
      ownerName: owner?.displayName ?? '',
      ownerPfp: owner?.imgUrl ?? '',
      title: body.title,
      icon: body.icon,
      creatorId: userId,
      year: body.year,
      semester: body.semester ?? null,
      school: body.school ?? null,
      schoolId: body.schoolId ?? null,
      progress: 0,
      totalLength: 0,
      totalDone: 0,
      totalInProgress: 0,
      courses: 0,
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
        ...(body.schoolId !== undefined && { school_id: body.schoolId }),
        updatedAt: new Date(),
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
    if (body.boardId) {
      const board = await this.db.query.flowboards.findFirst({
        where: eq(flowboards.id, body.boardId),
      });
      if (!board) throw new NotFoundException('Flowboard not found');
    }

    const id = crypto.randomUUID();

    await this.db.insert(flowcourses).values({
      id,
      boardId: body.boardId ?? null,
      addedBy: userId,
      title: body.title,
      icon: body.icon,
      description: body.description ?? null,
      resource: body.resource ?? null,
      examDate: body.examDate ?? null,
      lessonDays: body.lessonDays ?? null,
    });

    const addedBy = await this.getUser(userId);

    return {
      id,
      boardId: body.boardId ?? null,
      addedByDisplayName: addedBy?.displayName ?? '',
      addedById: userId,
      title: body.title,
      icon: body.icon,
      description: body.description ?? '',
      totalDone: 0,
      totalInProgress: 0,
      totalLength: 0,
      resource: body.resource ?? '',
      examDate: body.examDate ?? '',
      lessonDays: body.lessonDays ?? '',
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
        ...(body.examDate !== undefined && { exam_date: body.examDate }),
        ...(body.lessonDays !== undefined && {
          lessonDays: body.lessonDays,
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
      where: eq(flowcourses.id, body.courseId),
    });
    if (!course) throw new NotFoundException('Flowcourse not found');

    const id = crypto.randomUUID();

    // Auto-calculate order_index if not provided
    let orderIndex = body.orderIndex;
    if (orderIndex === undefined) {
      const existingRows = await this.db.query.flowrows.findMany({
        where: eq(flowrows.flowcourseId, body.courseId),
      });
      orderIndex = existingRows.length;
    }

    await this.db.insert(flowrows).values({
      id,
      flowcourseId: body.courseId,
      title: body.title,
      orderIndex: orderIndex,
      description: body.description ?? null,
      priority: (body.priority ??
        'no_priority') as (typeof priorityEnum.enumValues)[number],
      status: (body.status ??
        'not_started') as (typeof statusEnum.enumValues)[number],
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      studoset: body.studosetId ?? null,
      visualset: body.visualsetId ?? null,
    });

    if (body.resources?.length) {
      await Promise.all(
        body.resources.map((res) =>
          this.db.insert(flowresources).values({
            flowresourceId: crypto.randomUUID(),
            rowId: id,
            title: res.title,
            link: res.link,
            linkType: res.linkType ?? null,
            resourceType: (res.resourceType ?? null) as
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
        ...(body.orderIndex !== undefined && {
          orderIndex: body.orderIndex,
        }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.priority !== undefined && {
          priority: body.priority as (typeof priorityEnum.enumValues)[number],
        }),
        ...(body.status !== undefined && {
          status: body.status as (typeof statusEnum.enumValues)[number],
        }),
        ...(body.dueDate !== undefined && {
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        }),
        ...(body.studosetId !== undefined && { studoset: body.studosetId }),
        ...(body.visualsetId !== undefined && {
          visualset: body.visualsetId,
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
      flowresourceId: id,
      rowId: rowId,
      title: body.title,
      link: body.link,
      linkType: body.linkType ?? null,
      resourceType: (body.resourceType ?? null) as
        | (typeof resourceTypeEnum.enumValues)[number]
        | null,
    });

    return {
      id,
      title: body.title,
      link: body.link,
      linkType: body.linkType,
      resourceType: body.resourceType,
    };
  }

  async updateResource(
    resourceId: string,
    body: UpdateFlowResource,
  ): Promise<FlowResourceResponse> {
    const resource = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresourceId, resourceId),
    });
    if (!resource) throw new NotFoundException('Resource not found');

    await this.db
      .update(flowresources)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.link !== undefined && { link: body.link }),
        ...(body.linkType !== undefined && { link_type: body.linkType }),
        ...(body.resourceType !== undefined && {
          resourceType:
            body.resourceType as (typeof resourceTypeEnum.enumValues)[number],
        }),
      })
      .where(eq(flowresources.flowresourceId, resourceId));

    const updated = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresourceId, resourceId),
    });

    return {
      id: updated!.flowresourceId,
      title: updated!.title,
      link: updated!.link,
      linkType: updated!.linkType ?? undefined,
      resourceType: updated!.resourceType ?? undefined,
    };
  }

  async deleteResource(resourceId: string): Promise<void> {
    const resource = await this.db.query.flowresources.findFirst({
      where: eq(flowresources.flowresourceId, resourceId),
    });
    if (!resource) throw new NotFoundException('Resource not found');

    await this.db
      .delete(flowresources)
      .where(eq(flowresources.flowresourceId, resourceId));
  }
}
