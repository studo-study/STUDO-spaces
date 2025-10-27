import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFolderDto,
  FolderListResponseDto,
  FolderResponseDto,
  SwitchFolderDto,
} from './folder.dto';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { FOLDERS, Studyset, STUDYSETS } from '../data/mock_data';
import { StudysetListResponseDto } from '../studyset/studyset.dto';

@Injectable()
export class FolderService {
  create(folder: CreateFolderDto): FolderResponseDto {
    const f = {
      id: uuidv4.toString(),
      name: folder.name,
      user_id: folder.owner,
    };
    FOLDERS.push(f);
    return f;
  }

  getAll(): FolderListResponseDto {
    return { folders: FOLDERS };
  }

  getById(folder_id: string): FolderResponseDto {
    const folder = FOLDERS.find((f: FolderResponseDto) => f.id === folder_id);
    if (!folder) {
      throw new NotFoundException();
    }

    return folder;
  }

  getAllFolderSets(folder_id: string): StudysetListResponseDto {
    const list = STUDYSETS.filter((s: Studyset) => s.folder_id === folder_id);
    return {
      sets: list,
    };
  }

  deleteById(folder_id: string) {
    throw new Error('Not yet implemented');
  }
}
