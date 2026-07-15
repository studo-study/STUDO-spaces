import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileResponseDto } from './profile.dto';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { profiles, studysets, visualsets } from '../drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { VisualsetResponseDto } from '../visualset/visualset.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  private serializeProfile(p: {
    userId: string;
    displayName: string;
    imgUrl: string;
    bannerUrl: string | null;
    joinDate: Date;
    joinNumber: number;
    streak: number;
    verified: boolean;
    tags: string[];
  }) {
    return { ...p, joinDate: p.joinDate.toISOString() };
  }

  /**
   * Load a profile together with its sets. When `publicOnly` is true only the
   * user's public sets are returned (used by the unauthenticated endpoint).
   */
  private async loadProfile(
    userId: string,
    publicOnly: boolean,
  ): Promise<ProfileResponseDto> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
    if (!profile) {
      throw new NotFoundException();
    }

    const studysetWhere = publicOnly
      ? and(eq(studysets.userId, userId), eq(studysets.publicSet, true))
      : eq(studysets.userId, userId);
    const visualsetWhere = publicOnly
      ? and(eq(visualsets.userId, userId), eq(visualsets.publicSet, true))
      : eq(visualsets.userId, userId);

    const ss: StudysetResponseDto[] = await this.db.query.studysets.findMany({
      where: studysetWhere,
    });
    const vs: VisualsetResponseDto[] = await this.db.query.visualsets.findMany({
      where: visualsetWhere,
    });

    return {
      profile: this.serializeProfile(profile),
      studysets: ss,
      visualsets: vs,
    };
  }

  async getById(userId: string): Promise<ProfileResponseDto> {
    return this.loadProfile(userId, false);
  }

  async getPublicById(userId: string): Promise<ProfileResponseDto> {
    return this.loadProfile(userId, true);
  }
}
