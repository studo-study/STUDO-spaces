import { Injectable } from '@nestjs/common';
import {} from '../studyset/studyset.dto';
import { CreateCardDto, CreateCardListDto } from '../studyset/card.dto';
import {
  Cards,
  CARDS,
  SESSIONS,
  SET_LIKES,
  SetLike,
  Studyset,
  STUDYSETS,
} from '../data/mock_data';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { SwitchFolderDto } from '../folder/folder.dto';
import { CreateSetLikeDto, SetLikeResponseDto } from '../studyset/setlike.dto';
import { CreateVisualsetDto, VisualsetResponseDto } from './visualset.dto';

@Injectable()
export class VisualsetService {
  create(data: CreateVisualsetDto): VisualsetResponseDto {
    const date = new Date();
    const setId = uuidv4.toString();
    const set = {
        id: setId,
        title: data.title,
        subject: data.subject,
        global_term_language: data.global_term_language
        global_definition_language: data.global_definition_language,
        created_at: date.toISOString(),
        last_studied: '',
        last_updated: date.toISOString(),
        publicSet: boolean;
        hearts: number;
        user_id: string;
        folder_id: string;
        grid_x: number;
        grid_y: number;
        scale: number;
    };

    //sessie creeeren
    const session = {
      id: uuidv4.toString(),
      started_at: date.toISOString(),
      duration: 0,
      second_last_login: '',
      last_login: '',
      ended_at: '',
      index: 0,
      accuracy: 100,
      average_response_time: 0,
      longest_focus_streak: 0,
      device_type: '',
      last_seen: '',
      user_id: data.user_id,
      set_id: setId,
    };

    //kaarten creeeren
    data.cardlist.forEach((cardList: CreateCardListDto) => {
      cardList.cards.forEach((c: CreateCardDto) => {
        const card = {
          id: uuidv6.toString(),
          term: c.term,
          definition: c.definition,
          image: c.image ?? null,
          number: c.number,
          created_at: date.toISOString(),
          updated_at: '',
          card_viewcount: 0,
          card_totalviewcount: 0,
          inQueue: false,
          mastered: false,
          times_relearned: 0,
          set_id: setId,
          owner_id: data.user_id,
        };

        CARDS.push(card);
      });
    });

    STUDYSETS.push(set);
    SESSIONS.push(session);

    return set;
  }

  getAll(): StudysetListResponseDto {
    return { sets: STUDYSETS };
  }

  getById(set_id: string): fullSetResponseDto {
    const set = STUDYSETS.find((item: Studyset) => item.id === set_id);
    if (!set) {
      throw new Error('No studyset with this id exists');
    }

    return {
      ...set,
      cards: {
        cards: CARDS.filter((item: Cards) => item.set_id === set_id),
      },
      likes: {
        likes: SET_LIKES.filter((item: SetLike) => item.set_id === set_id),
      },
    };
  }

  getBySetId(setId: string): StudysessionResponseDto {
    const session = SESSIONS.find((session) => session.set_id === setId);

    if (!session) {
      throw new Error("Session doesn't exist");
    }
    return session;
  }

  updateById(set_id: string, body: UpdateStudysetDto): StudysetResponseDto {
    throw new Error('not yet implemented');
  }

  deleteById(set_id: string): string {
    //TODO: sessie + kaarten niet vergeten
    return 'Not Yet implemented';
  }

  switchFolder(dto: SwitchFolderDto): StudysetResponseDto {
    const set = STUDYSETS.find((s: Studyset) => s.id === dto.set_id);
    if (!set) {
      throw new Error('No set with this id exists');
    }
    set.folder_id = dto.destinationFolder_id;
    return set;
  }

  likeSet(body: CreateSetLikeDto): SetLikeResponseDto {
    const date = new Date();
    const like = {
      id: uuidv4.toString(),
      set_id: body.set_id,
      user_id: body.user_id,
      created_at: date.toISOString(),
    };

    SET_LIKES.push(like);
    return like;
  }
}
