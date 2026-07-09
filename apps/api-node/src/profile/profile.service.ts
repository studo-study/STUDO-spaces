import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileListResponseDto, ProfileResponseDto } from './profile.dto';
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

  async getAll(): Promise<ProfileListResponseDto> {
    const all = await this.db.query.profiles.findMany();
    return { profiles: all.map((p) => this.serializeProfile(p)) };
  }

  async getById(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
    if (!profile) {
      throw new NotFoundException();
    }

    const ss: StudysetResponseDto[] = await this.db.query.studysets.findMany({
      where: eq(studysets.userId, userId),
    });
    const vs: VisualsetResponseDto[] = await this.db.query.visualsets.findMany({
      where: eq(visualsets.userId, userId),
    });

    return {
      profile: this.serializeProfile(profile),
      studysets: ss,
      visualsets: vs,
    };
  }

  async getPublicById(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
    if (!profile) {
      throw new NotFoundException();
    }

    const ss: StudysetResponseDto[] = await this.db.query.studysets.findMany({
      where: and(eq(studysets.userId, userId), eq(studysets.publicSet, true)),
    });
    const vs: VisualsetResponseDto[] = await this.db.query.visualsets.findMany({
      where: and(eq(visualsets.userId, userId), eq(visualsets.publicSet, true)),
    });

    return {
      profile: this.serializeProfile(profile),
      studysets: ss,
      visualsets: vs,
    };
  }
}
