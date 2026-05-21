import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFolderDto,
  FolderListResponseDto,
  FolderResponseDto,
  FolderSetsDto,
  FullFolderResponseDto,
} from './folder.dto';
import { v6 as uuidv6 } from 'uuid';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { folder_sets, folders, studysets, visualsets } from '../drizzle/schema';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class FolderService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async create(
    user_id: string,
    folder: CreateFolderDto,
  ): Promise<FolderResponseDto> {
    const id = uuidv6();
    const f = {
      id: id,
      name: folder.name,
      owner_id: user_id,
    };
    await this.db.insert(folders).values(f);
    return f;
  }

  async getAll(): Promise<FolderListResponseDto> {
    return {
      folders: await this.db.query.folders.findMany(),
    };
  }

  async getAllUser(user_id: string): Promise<FolderListResponseDto> {
    return {
      folders: await this.db.query.folders.findMany({
        where: eq(folders.owner_id, user_id),
      }),
    };
  }

  async getById(
    folder_id: string,
    user_id: string,
  ): Promise<FullFolderResponseDto> {
    const folder = await this.db.query.folders.findFirst({
      where: eq(folders.id, folder_id),
    });

    if (!folder) {
      throw new NotFoundException();
    }

    const sets = await this.getAllFolderSets(folder_id, user_id);

    return {
      id: folder.id,
      name: folder.name,
      owner_id: folder.owner_id,
      sets: sets,
    };
  }

  async getAllFolderSets(
    folder_id: string,
    user_id: string,
  ): Promise<FolderSetsDto> {
    const entries = await this.db.query.folder_sets.findMany({
      where: and(
        eq(folder_sets.folder_id, folder_id),
        eq(folder_sets.user_id, user_id),
      ),
    });

    const studysetIds = entries
      .filter((e) => e.set_type === 'studyset')
      .map((e) => e.set_id);

    const visualsetIds = entries
      .filter((e) => e.set_type === 'visualset')
      .map((e) => e.set_id);

    const ss =
      studysetIds.length > 0
        ? await this.db.query.studysets.findMany({
            where: inArray(studysets.id, studysetIds),
          })
        : [];

    const vs =
      visualsetIds.length > 0
        ? await this.db.query.visualsets.findMany({
            where: inArray(visualsets.id, visualsetIds),
          })
        : [];

    return { studysets: ss, visualsets: vs };
  }

  async deleteById(folder_id: string): Promise<void> {
    const result = await this.db
      .delete(folders)
      .where(eq(folders.id, folder_id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No folder with this id exists');
    }
  }
}
