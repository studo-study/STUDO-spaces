import { Injectable } from '@nestjs/common';
import {
  StudysessionListResponseDto,
  StudysessionResponseDto,
  TotalStats,
  UpdateStudysessionDto,
} from './studysession.dto';
import { CARDS, SESSIONS, Studysession, STUDYSETS } from '../data/mock_data';

@Injectable()
export class StudysessionService {
  getAll(): StudysessionListResponseDto {
    return { sessions: SESSIONS };
  }

  getById(session_id: string): StudysessionResponseDto {
    const session = SESSIONS.find((session) => session.id === session_id);

    if (!session) {
      throw new Error("Session doesn't exist");
    }
    return session;
  }

  updateById(
    session_id: string,
    body: UpdateStudysessionDto,
  ): StudysessionResponseDto {
    throw new Error('not yet implemented');
  }

  deleteById(session_id: string) {
    throw new Error('not yet implemented');
  }
}
