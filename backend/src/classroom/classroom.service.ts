import { Injectable } from '@nestjs/common';
import { Cards, CARDS, CLASSROOMS, Studyset, STUDYSETS } from '../data/mock_data';
import {
  ClassroomListResponseDto,
  ClassroomResponseDto,
} from './classroom.dto';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from '../studyset/studyset.dto';

@Injectable()
export class ClassroomService {
  getAll(): ClassroomListResponseDto {
    return { classrooms: CLASSROOMS };
  }

  getById(id: string): ClassroomResponseDto {
  }

  create({

         }: CreateStudysetDto): string {
    return 'Not Yet implemented';
  }

  updateById(id: string): UpdateStudysetDto {
    throw new Error('not yet implemented');
  }

  deleteById(id: string): string {
    return 'Not Yet implemented';
  }
}
