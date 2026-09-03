import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  courseRows,
  courses,
  courseTables,
  courseUsers,
  courseWidgets,
  courseWorkspaces,
  studysets,
  visualsets,
} from '../drizzle/schema';
import { and, eq, inArray } from 'drizzle-orm';
import {
  Course,
  CourseSetItem,
  CourseWidget,
  CreateCourse,
  FullCourseResponse,
  UpdateCourse,
  UpdateCourseWidgets,
} from '@studo/types';

const iso = (d: Date | null): string | null => d?.toISOString() ?? null;

@Injectable()
export class CourseService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async CourseUserCheck(userId: string, courseId: string) {
    const user = await this.db.query.courseUsers.findFirst({
      where: and(
        eq(courseUsers.userId, userId),
        eq(courseUsers.courseId, courseId),
      ),
    });

    if (!user) {
      throw new NotFoundException('User not in course');
    }
  }

  async getAllUserCourses(userId: string): Promise<Course[]> {
    const rows = await this.db.query.courseUsers.findMany({
      where: eq(courseUsers.userId, userId),
      with: { course: true },
    });

    return rows
      .map((r) => r.course)
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .map((c) => ({
        ...c,
        createdAt: iso(c.createdAt),
        updatedAt: iso(c.updatedAt),
      }));
  }
  async getFullCourse(
    courseId: string,
    userId: string,
  ): Promise<FullCourseResponse> {
    await this.CourseUserCheck(userId, courseId);

    const course = await this.db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        board: true,
        members: { with: { user: true } },
        tables: { with: { rows: { with: { resources: true } } } },
        sets: true,
        documents: true,
        workspaces: { with: { widgets: true } },
      },
    });

    if (!course) {
      throw new NotFoundException('No course with this id exists');
    }
    const academyYear = course.academyYear ?? course.board?.academyYear ?? null;
    const examDate = course.examDate ?? course.board?.examDate ?? null;
    const institute = course.institute ?? course.board?.institute ?? null;

    const src = course.tables[0] ?? null;
    const table = src
      ? {
          id: src.id,
          courseId: src.courseId,
          title: src.title,
          description: src.description,
          createdAt: iso(src.createdAt),
          updatedAt: iso(src.updatedAt),
          rows: src.rows
            .sort((a, b) => a.rowIndex - b.rowIndex)
            .map((r) => ({
              id: r.id,
              tableId: r.tableId,
              rowIndex: r.rowIndex,
              createdBy: r.createdBy,
              createdAt: iso(r.createdAt),
              title: r.title ?? undefined,
              status: r.status,
              priority: r.priority,
              type: r.type,
              description: r.description,
              dueDate: r.dueDate,
              resources: r.resources.map((res) => ({
                id: res.id,
                rowId: res.rowId,
                link: res.link,
              })),
            })),
        }
      : null;

    const allRows = table?.rows ?? [];

    const addedByBySet = new Map(course.sets.map((s) => [s.setId, s.addedBy]));
    const studoIds = course.sets
      .filter((s) => s.setType === 'studoset')
      .map((s) => s.setId);
    const visualIds = course.sets
      .filter((s) => s.setType === 'visualset')
      .map((s) => s.setId);

    const [studoRows, visualRows] = await Promise.all([
      studoIds.length
        ? this.db
            .select()
            .from(studysets)
            .where(inArray(studysets.id, studoIds))
        : Promise.resolve([]),
      visualIds.length
        ? this.db
            .select()
            .from(visualsets)
            .where(inArray(visualsets.id, visualIds))
        : Promise.resolve([]),
    ]);

    const sets: CourseSetItem[] = [
      ...studoRows.map((s) => ({
        setType: 'studoset' as const,
        addedBy: addedByBySet.get(s.id) ?? '',
        id: s.id,
        title: s.title,
        globalTermLanguage: s.globalTermLanguage,
        globalDefinitionLanguage: s.globalDefinitionLanguage,
        createdAt: s.createdAt,
        lastUpdated: s.lastUpdated,
        publicSet: s.publicSet,
        displayName: s.displayName,
        imgUrl: s.imgUrl,
        userId: s.userId,
      })),
      ...visualRows.map((s) => ({
        setType: 'visualset' as const,
        addedBy: addedByBySet.get(s.id) ?? '',
        id: s.id,
        title: s.title,
        studoset: s.studoset,
        createdAt: s.createdAt,
        lastUpdated: s.lastUpdated,
        publicSet: s.publicSet,
        displayName: s.displayName,
        imgUrl: s.imgUrl,
        userId: s.userId,
      })),
    ];

    return {
      id: course.id,
      boardId: course.boardId,
      title: course.title,
      icon: course.icon,
      description: course.description,
      publicCourse: course.publicCourse,
      createdAt: iso(course.createdAt),
      updatedAt: iso(course.updatedAt),
      academyYear,
      examDate,
      institute,
      totalRows: allRows.length,
      totalDone: allRows.filter((r) => r.status === 'done').length,
      totalInProgress: allRows.filter((r) => r.status === 'doing').length,
      table,
      sets,
      documents: course.documents.map((d) => ({
        id: d.id,
        courseId: d.courseId,
        uploaderId: d.uploaderId,
        title: d.title,
        author: d.author,
        publishingDate: d.publishingDate,
        status: d.status ?? 'uploading',
        storageKey: d.storageKey,
        mimeType: d.mimeType,
        pageCount: d.pageCount,
        wordCount: d.wordCount,
        fileSize: d.fileSize,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        documentTag: d.documentTag,
        lastOpened: d.lastOpened,
      })),
      members: course.members.map((m) => ({
        userId: m.userId,
        courseId: m.courseId,
        role: m.role,
        displayName: m.user?.displayName,
        imgUrl: m.user?.imgUrl,
        createdAt: iso(m.createdAt),
      })),
      widgets: course.workspaces.flatMap((workspace) =>
        workspace.widgets.map((w) => ({
          id: w.id,
          workspaceId: w.workspaceId,
          type: w.type,
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
          config: w.config,
          createdAt: iso(w.createdAt) ?? '',
          updatedAt: iso(w.updatedAt) ?? '',
        })),
      ),
    };
  }

  private mapWidget(w: typeof courseWidgets.$inferSelect): CourseWidget {
    return {
      id: w.id,
      workspaceId: w.workspaceId,
      type: w.type,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      config: w.config,
      createdAt: iso(w.createdAt) ?? '',
      updatedAt: iso(w.updatedAt) ?? '',
    };
  }

  private async resolveWorkspaceId(courseId: string): Promise<string> {
    const existing = await this.db.query.courseWorkspaces.findFirst({
      where: eq(courseWorkspaces.courseId, courseId),
    });
    if (existing) return existing.id;

    const [created] = await this.db
      .insert(courseWorkspaces)
      .values({ courseId })
      .returning();
    return created.id;
  }

  async getWidgets(
    courseId: string,
    userId: string,
  ): Promise<{ widgets: CourseWidget[] }> {
    await this.CourseUserCheck(userId, courseId);

    const workspaces = await this.db.query.courseWorkspaces.findMany({
      where: eq(courseWorkspaces.courseId, courseId),
      with: { widgets: true },
    });

    return {
      widgets: workspaces.flatMap((ws) =>
        ws.widgets.map((w) => this.mapWidget(w)),
      ),
    };
  }

  async replaceWidgets(
    courseId: string,
    userId: string,
    body: UpdateCourseWidgets,
  ): Promise<{ widgets: CourseWidget[] }> {
    await this.CourseUserCheck(userId, courseId);

    const workspaceId = await this.resolveWorkspaceId(courseId);

    await this.db
      .delete(courseWidgets)
      .where(eq(courseWidgets.workspaceId, workspaceId));

    const rows = body.widgets ?? [];
    if (rows.length === 0) return { widgets: [] };

    const inserted = await this.db
      .insert(courseWidgets)
      .values(
        rows.map((w) => ({
          workspaceId,
          type: w.type,
          x: w.x,
          y: w.y,
          w: w.w,
          h: w.h,
          config: w.config ?? {},
        })),
      )
      .returning();

    return { widgets: inserted.map((w) => this.mapWidget(w)) };
  }

  async createCourse(
    body: CreateCourse,
    userId: string,
  ): Promise<FullCourseResponse> {
    const [course] = await this.db
      .insert(courses)
      .values({
        title: body.title,
        description: body?.description,
        icon: body.icon,
        academyYear: body.academyYear ?? null,
        examDate: body.examDate || null,
        institute: body.institute || null,
      })
      .returning();

    // Koppel de maker als owner, anders verschijnt de course niet in zijn lijst.
    await this.db.insert(courseUsers).values({
      userId,
      courseId: course.id,
      role: 'owner',
    });

    const [generatedTable] = await this.db
      .insert(courseTables)
      .values({
        courseId: course.id,
        title: body.title ?? '',
        description: body.description ?? '',
      })
      .returning();

    for (let i = 0; i < 3; i++) {
      await this.db.insert(courseRows).values({
        rowIndex: i + 1,
        tableId: generatedTable.id,
      });
    }

    return await this.getFullCourse(course.id, userId);
  }

  async updateCourse(courseId: string, body: UpdateCourse) {
    await this.db
      .update(courses)
      .set({
        academyYear: body?.academyYear,
        boardId: body?.boardId,
        examDate: body?.examDate,
        icon: body?.icon,
        institute: body?.institute,
        publicCourse: body?.publicCourse,
        title: body?.title,
        updatedAt: new Date(),
        description: body?.description,
      })
      .where(eq(courses.id, courseId));
  }

  async deleteCourse(courseId: string) {
    await this.db.delete(courses).where(eq(courses.id, courseId));
  }
}
