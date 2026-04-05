import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileListResponseDto, ProfileResponseDto } from './profile.dto';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { profiles, studysets, visualsets } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { VisualsetResponseDto } from '../visualset/visualset.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<ProfileListResponseDto> {
    return { profiles: await this.db.query.profiles.findMany() };
  }

  async getById(user_id: string): Promise<ProfileResponseDto> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(profiles.user_id, user_id),
    });
    if (!profile) {
      throw new NotFoundException();
    }

    const ss: StudysetResponseDto[] = await this.db.query.studysets.findMany({
      where: eq(studysets.user_id, user_id),
    });
    const vs: VisualsetResponseDto[] = await this.db.query.visualsets.findMany({
      where: eq(visualsets.user_id, user_id),
    });

    return {
      profile: profile,
      studysets: ss,
      visualsets: vs,
    };
  }
}
