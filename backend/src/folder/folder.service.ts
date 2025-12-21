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
import { folders, studysets, visualsets } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class FolderService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {
  }

  async create(user_id: string, folder: CreateFolderDto): Promise<FolderResponseDto> {
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

  async getById(folder_id: string): Promise<FullFolderResponseDto> {
    console.log('🔍 getById called with:', folder_id);

    const folder = await this.db.query.folders.findFirst({
      where: eq(folders.id, folder_id),
    });

    console.log('📁 Found folder:', folder);

    if (!folder) {
      throw new NotFoundException();
    }

    console.log('🔄 Fetching sets...');
    const sets = await this.getAllFolderSets(folder_id);
    console.log('📚 Found sets:', sets);

    const result = {
      id: folder.id,
      name: folder.name,
      owner_id: folder.owner_id,
      sets: sets,
    };

    console.log('✅ Returning result:', JSON.stringify(result, null, 2));

    return result;
  }

  async getAllFolderSets(folder_id: string): Promise<FolderSetsDto> {
    const ss = await this.db.query.studysets.findMany({
      where: eq(studysets.folder_id, folder_id),
    });

    const vs = await this.db.query.visualsets.findMany({
      where: eq(visualsets.folder_id, folder_id),
    });
    return {
      studysets: ss,
      visualsets: vs,
    };
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
