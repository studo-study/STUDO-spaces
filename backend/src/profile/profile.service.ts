import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ProfileDto,
  ProfileListResponseDto,
  ProfileResponseDto,
} from './profile.dto';
import { PROFILES, STUDYSETS } from '../data/mock_data';
import {
  StudysetListResponseDto,
  StudysetResponseDto,
} from '../studyset/studyset.dto';

@Injectable()
export class ProfileService {
  getAll(): ProfileListResponseDto {
    return { profiles: PROFILES };
  }

  getById(id: string): ProfileResponseDto {
    const profile = PROFILES.find(
      (profile: ProfileDto) => profile.user_id === id,
    );
    if (!profile) {
      throw new NotFoundException();
    }
    const studysets: StudysetListResponseDto = {
      sets: STUDYSETS.filter((set: StudysetResponseDto) => set.user_id === id),
    };

    if (!studysets) {
      throw new NotFoundException();
    }
    return { profile: profile, sets: studysets };
  }
}
