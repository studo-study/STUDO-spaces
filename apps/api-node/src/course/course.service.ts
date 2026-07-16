import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { courses, courseUsers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { Course, FullCourseResponse } from '@studo/types';

const iso = (d: Date | null): string | null => d?.toISOString() ?? null;

@Injectable()
export class CourseService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

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

  async getFullCourse(courseId: string): Promise<FullCourseResponse> {
    const course = await this.db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        board: true,
        members: { with: { user: true } },
        tables: { with: { rows: { with: { resources: true } } } },
        sets: true,
        documents: true,
      },
    });

    if (!course) {
      throw new NotFoundException('No course with this id exists');
    }
    const academyYear = course.academyYear ?? course.board?.academyYear ?? null;
    const examDate = course.examDate ?? course.board?.examDate ?? null;
    const institute = course.institute ?? course.board?.institute ?? null;

    const tables = course.tables.map((t) => ({
      id: t.id,
      courseId: t.courseId,
      title: t.title,
      createdAt: iso(t.createdAt),
      updatedAt: iso(t.updatedAt),
      rows: t.rows
        .sort((a, b) => a.rowIndex - b.rowIndex)
        .map((r) => ({
          id: r.id,
          tableId: r.tableId,
          rowIndex: r.rowIndex,
          createdBy: r.createdBy,
          status: r.status,
          priority: r.priority,
          type: r.type,
          description: r.description,
          resources: r.resources.map((res) => ({
            id: res.id,
            rowId: res.rowId,
            link: res.link,
          })),
        })),
    }));

    const allRows = tables.flatMap((t) => t.rows);

    return {
      id: course.id,
      boardId: course.boardId,
      title: course.title,
      icon: course.icon,
      publicCourse: course.publicCourse,
      createdAt: iso(course.createdAt),
      updatedAt: iso(course.updatedAt),
      academyYear,
      examDate,
      institute,
      totalRows: allRows.length,
      totalDone: allRows.filter((r) => r.status === 'done').length,
      totalInProgress: allRows.filter((r) => r.status === 'doing').length,
      tables,
      sets: course.sets.map((s) => ({
        setId: s.setId,
        setType: s.setType,
        addedBy: s.addedBy,
        courseId: s.courseId,
        createdAt: iso(s.createdAt),
        updatedAt: iso(s.updatedAt),
      })),
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
        createdAt: iso(d.createdAt),
        updatedAt: iso(d.updatedAt),
      })),
      members: course.members.map((m) => ({
        userId: m.userId,
        courseId: m.courseId,
        role: m.role,
        displayName: m.user?.displayName,
        imgUrl: m.user?.imgUrl,
        createdAt: iso(m.createdAt),
      })),
    };
  }
}
