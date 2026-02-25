import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { async } from 'rxjs';
import {
  ClassroomResponse,
  ProfileResponse,
  PublicSetResponse,
  SearchResultsDto,
  SetResponse,
} from './search.dto';
import {
  cards,
  classrooms,
  images,
  profiles,
  setlikes,
  studysessions,
  studysets,
  visualsets,
} from '../drizzle/schema';
import { and, eq, ilike } from 'drizzle-orm';
import { ProfileResponseDto } from '../profile/profile.dto';
import { StudysetService } from '../studyset/studyset.service';
import { VisualsetService } from '../visualset/visualset.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async search(user_id: string, query: string) {
    const term: string = `%${query}%`;

    const [profileResult, classroomResult, studysetResult, visualsetResult] =
      await Promise.all([
        this.db.query.profiles.findMany({
          where: ilike(profiles.displayName, term),
        }),
        this.db.query.classrooms.findMany({
          where: ilike(classrooms.name, term),
        }),
        this.db.query.studysets.findMany({
          where: and(
            ilike(studysets.title, term),
            eq(studysets.public_set, true),
          ),
        }),
        this.db.query.visualsets.findMany({
          where: and(
            ilike(visualsets.title, term),
            eq(visualsets.public_set, true),
          ),
        }),
      ]);

    //return arrays definieren
    const ProfileArray: ProfileResponse[] = [];
    const SetArray: SetResponse[] = [];
    const ClassArray: ClassroomResponse[] = [];

    //data verwerkken
    //profiel
    profileResult.map((p) => {
      const profiel = {
        id: p.user_id,
        displayName: p.displayName,
        img_url: p.img_url,
        studoProfile: p.verified,
        role: 'student',
        profileType: 'profile',
        type: 'profile',
      };

      ProfileArray.push(profiel);
    });

    for (const c of classroomResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, c.owner_id),
      });

      if (!ownerProfile) {
        throw new NotFoundException(`User ${c.owner_id} not found`);
      }

      //classrooms
      const klas = {
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        owner_id: c.owner_id,
        type: 'classroom',
        verified: c.verified,
      };

      ClassArray.push(klas);
    }

    //studoset
    //owner, sessie zoeken studoset + item pushen naar array
    const SService = new StudysetService(this.db);
    for (const ss of studysetResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, ss.user_id),
      });

      const StuSe = await SService.getById(user_id, ss.id);

      if (!ownerProfile) {
        throw new NotFoundException(`User ${ss.user_id} not found`);
      }
      const sesh = await this.db.query.studysessions.findFirst({
        where: and(
          eq(studysessions.set_id, ss.id),
          eq(studysessions.user_id, user_id),
        ),
      });

      const set = {
        id: ss.id,
        title: ss.title,
        subject: ss.course,
        last_studied: sesh?.last_studied,
        owner: ownerProfile.displayName,
        img_url: ownerProfile.img_url,
        owner_id: ss.user_id,
        verified: ownerProfile.verified,
        likes: StuSe.likes.length,
        items: StuSe.cards.length,
        type: 'studyset',
      };

      SetArray.push(set);
    }

    //owner zoeken ((visualset))
    const VService = new VisualsetService(this.db);
    for (const vs of visualsetResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, vs.user_id),
      });

      const StuSe = await VService.getById(user_id, vs.id);

      if (!ownerProfile) {
        throw new NotFoundException(`User ${vs.user_id} not found`);
      }
      const sesh = await this.db.query.studysessions.findFirst({
        where: and(
          eq(studysessions.set_id, vs.id),
          eq(studysessions.user_id, user_id),
        ),
      });

      const set = {
        id: vs.id,
        title: vs.title,
        subject: vs.course,
        last_studied: sesh?.last_studied,
        owner: ownerProfile.displayName,
        img_url: ownerProfile.img_url,
        owner_id: vs.user_id,
        verified: ownerProfile.verified,
        likes: StuSe.likes.likes.length,
        items: StuSe.images.length,
        type: 'visualset',
      };

      SetArray.push(set);
    }
    //return statement
    return {
      data: [
        { type: 'set', data: SetArray },
        { type: 'profile', data: ProfileArray },
        { type: 'classroom', data: ClassArray },
      ],
    };
  }

  async publicSearch(query: string) {
    const term: string = `%${query}%`;

    const [profileResult, classroomResult, studysetResult, visualsetResult] =
      await Promise.all([
        this.db.query.profiles.findMany({
          where: ilike(profiles.displayName, term),
        }),
        this.db.query.classrooms.findMany({
          where: ilike(classrooms.name, term),
        }),
        this.db.query.studysets.findMany({
          where: and(
            ilike(studysets.title, term),
            eq(studysets.public_set, true),
          ),
        }),
        this.db.query.visualsets.findMany({
          where: and(
            ilike(visualsets.title, term),
            eq(visualsets.public_set, true),
          ),
        }),
      ]);

    //return arrays definieren
    const ProfileArray: ProfileResponse[] = [];
    const SetArray: PublicSetResponse[] = [];
    const ClassArray: ClassroomResponse[] = [];

    //data verwerkken
    //profiel
    profileResult.map((p) => {
      const profiel = {
        id: p.user_id,
        displayName: p.displayName,
        img_url: p.img_url,
        studoProfile: p.verified,
        role: 'student',
        profileType: 'profile',
        type: 'profile',
      };

      ProfileArray.push(profiel);
    });

    for (const c of classroomResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, c.owner_id),
      });

      if (!ownerProfile) {
        throw new NotFoundException(`User ${c.owner_id} not found`);
      }

      //classrooms
      const klas = {
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        owner_id: c.owner_id,
        type: 'classroom',
        verified: c.verified,
      };

      ClassArray.push(klas);
    }

    //studoset
    //owner, sessie zoeken studoset + item pushen naar array
    for (const ss of studysetResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, ss.user_id),
      });

      if (!ownerProfile) {
        throw new NotFoundException(`User ${ss.user_id} not found`);
      }

      const Likes = await this.db.query.setlikes.findMany({
        where: eq(setlikes.set_id, ss.id),
      });
      const Cards = await this.db.query.cards.findMany({
        where: eq(cards.set_id, ss.id),
      });

      const set = {
        id: ss.id,
        title: ss.title,
        subject: ss.course,
        owner: ownerProfile.displayName,
        img_url: ownerProfile.img_url,
        owner_id: ss.user_id,
        verified: ownerProfile.verified,
        likes: Likes.length,
        items: Cards.length,
        type: 'studyset',
      };

      SetArray.push(set);
    }

    //owner zoeken ((visualset))
    const VService = new VisualsetService(this.db);
    for (const vs of visualsetResult) {
      const ownerProfile = await this.db.query.profiles.findFirst({
        where: eq(profiles.user_id, vs.user_id),
      });

      if (!ownerProfile) {
        throw new NotFoundException(`User ${vs.user_id} not found`);
      }

      const Likes = await this.db.query.setlikes.findMany({
        where: eq(setlikes.set_id, vs.id),
      });
      const Images = await this.db.query.images.findMany({
        where: eq(images.set_id, vs.id),
      });

      const set = {
        id: vs.id,
        title: vs.title,
        subject: vs.course,
        owner: ownerProfile.displayName,
        img_url: ownerProfile.img_url,
        owner_id: vs.user_id,
        verified: ownerProfile.verified,
        likes: Likes.length,
        items: Images.length,
        type: 'visualset',
      };

      SetArray.push(set);
    }
    //return statement
    return {
      data: [
        { type: 'set', data: SetArray },
        { type: 'profile', data: ProfileArray },
        { type: 'classroom', data: ClassArray },
      ],
    };
  }
}
