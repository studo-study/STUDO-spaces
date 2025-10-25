import { Injectable } from '@nestjs/common';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import {
  CreateStudysetDto,
  fullSetResponseDto,
  StudysetListResponseDto,
  StudysetResponseDto,
  UpdateStudysetDto,
} from './studyset.dto';
import { STUDYSETS, Studyset, CARDS, Cards, SESSIONS } from '../data/mock_data';

@Injectable()
export class StudysetService {
  getAll(): StudysetListResponseDto {
    return { sets: STUDYSETS };
  }

  getById(id: string): fullSetResponseDto {
    const set = STUDYSETS.find((item: Studyset) => item.id === id);
    if (!set) {
      throw new Error('No studyset with this id exists');
    }

    return {
      ...set,
      cards: {
        cards: CARDS.filter((item: Cards) => item.set_id === id),
      },
    };
  }

  create({
    title,
    subject,
    global_term_language,
    global_definition_language,
    user_id,
    folder_id,
  }: CreateStudysetDto): StudysetResponseDto {
    const date = new Date();
    const setId = uuidv4.toString();
    const set = {
      id: setId,
      title: title,
      subject: subject,
      global_term_language: global_term_language,
      global_definition_language: global_definition_language,
      created_at: date.toISOString(),
      last_studied: '',
      last_updated: '',
      publicSet: false,
      hearts: 0,
      user_id: user_id,
      folder_id: folder_id,
    };

    //sessie creeeren
    const session = {
      id: uuidv4.toString(),
      started_at: date.toISOString(),
      duration: 0,
      second_last_login: '',
      last_login: '',
      user_id: user_id,
      set_id: setId,
    };

    STUDYSETS.push(set);
    SESSIONS.push(session);

    return set;
  }

  updateById(id: string): UpdateStudysetDto {
    throw new Error('not yet implemented');
  }

  deleteById(id: string): string {
    return 'Not Yet implemented';
  }
}
