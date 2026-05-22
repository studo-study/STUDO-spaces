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

  private serializeProfile(p: {
    user_id: string;
    displayName: string;
    img_url: string;
    banner_url: string | null;
    join_date: Date;
    joinNumber: number;
    streak: number;
    verified: boolean;
    tags: string[];
  }) {
    return { ...p, join_date: p.join_date.toISOString() };
  }

  async getAll(): Promise<ProfileListResponseDto> {
    const all = await this.db.query.profiles.findMany();
    return { profiles: all.map((p) => this.serializeProfile(p)) };
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
      profile: this.serializeProfile(profile),
      studysets: ss,
      visualsets: vs,
    };
  }
}
