import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { FlowBoardResponse, FlowBoardOverview } from '@studo/types';
import { eq } from 'drizzle-orm';
import { flowboards, flowcourses, flowrows, users } from '../drizzle/schema';

@Injectable()
export class FlowService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<FlowBoardOverview[]> {
    const boards = await this.db.query.flowboards.findMany();

    return Promise.all(
      boards.map(async (board) => {
        const owner = await this.db.query.users.findFirst({
          where: eq(users.id, board.owner_id),
        });

        return {
          id: board.id,
          owner_id: board.owner_id,
          owner_name: owner?.displayName ?? '',
          owner_pfp: owner?.img_url ?? '',
          title: board.title,
          icon: board.icon,
          creator_id: board.owner_id,
          year: board.year,
          semester: board.semester ?? '',
          school: board.school_name ?? '',
          school_id: board.school_id ?? '',
        };
      }),
    );
  }

  async getById(boardId: string): Promise<FlowBoardResponse | null> {
    const board = await this.db.query.flowboards.findFirst({
      where: eq(flowboards.id, boardId),
    });
    if (!board) return null;

    const owner = await this.db.query.users.findFirst({
      where: eq(users.id, board.owner_id),
    });

    const courses = await this.db.query.flowcourses.findMany({
      where: eq(flowcourses.board_id, board.id),
    });

    const mappedCourses = await Promise.all(
      courses.map(async (course) => {
        const addedBy = await this.db.query.users.findFirst({
          where: eq(users.id, course.added_by),
        });

        const rows = await this.db.query.flowrows.findMany({
          where: eq(flowrows.flowcourse_id, course.id),
        });

        return {
          id: course.id,
          board_id: course.board_id,
          added_by_display_name: addedBy?.displayName ?? '',
          added_by_id: course.added_by,
          title: course.title,
          icon: course.icon,
          description: course.description ?? '',
          rows: rows.map((row) => ({
            id: row.id,
            course_id: row.flowcourse_id,
            title: row.title,
            description: row.description ?? '',
            priority: row.priority ?? 'no_priority',
            course_link: row.course_link ?? undefined,
            summary_link: row.summary_link ?? undefined,
            status: row.status ?? 'to_do',
            due_date: row.due_date?.toISOString() ?? '',
            studoset_id: row.studoset ?? '',
            visualset_id: row.visualset ?? '',
          })),
        };
      }),
    );

    return {
      id: board.id,
      owner_id: board.owner_id,
      owner_name: owner?.displayName ?? '',
      owner_pfp: owner?.img_url ?? '',
      title: board.title,
      icon: board.icon,
      creator_id: board.owner_id,
      year: board.year,
      semester: board.semester ?? '',
      school: board.school_name ?? '',
      school_id: board.school_id ?? '',
      courses: mappedCourses,
    };
  }

  async getByUserId(userId: string): Promise<FlowBoardOverview[]> {
    const boards = await this.db.query.flowboards.findMany({
      where: eq(flowboards.owner_id, userId),
    });

    if (!boards) {
      throw new NotFoundException();
    }

    const owner = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return boards.map((board) => ({
      id: board.id,
      owner_id: board.owner_id,
      owner_name: owner?.displayName ?? '',
      owner_pfp: owner?.img_url ?? '',
      title: board.title,
      icon: board.icon,
      creator_id: board.owner_id,
      year: board.year,
      semester: board.semester ?? '',
      school: board.school_name ?? '',
      school_id: board.school_id ?? '',
    }));
  }
}
