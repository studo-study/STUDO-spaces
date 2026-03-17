import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  ClassroomResponse,
  ProfileResponse,
  SetResponse,
  StudoProfileResponse,
} from './search.dto';
import {
  cards,
  classrooms,
  images,
  profiles,
  setlikes,
  studoprofiles,
  studysets,
  visualsets,
} from '../drizzle/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

@Injectable()
export class SearchService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async search(query: string, id: string) {
    const term: string = `%${query}%`;
    const [
      studoProfileResult,
      profileResult,
      classroomResult,
      studoysetResult,
      visualsetResult,
    ] = await Promise.all([
      this.db.query.studoprofiles.findMany({
        where: sql`
          similarity(${studoprofiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${studoprofiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${studoprofiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${studoprofiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.profiles.findMany({
        where: sql`
          similarity(${profiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${profiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${profiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${profiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.classrooms.findMany({
        where: sql`similarity(${classrooms.name}, ${query}) > 0.3`,
        orderBy: sql`similarity(${classrooms.name}, ${query}) DESC`,
      }),
      this.db.query.studysets.findMany({
        where: and(
          sql`similarity(${studysets.title}, ${query}) > 0.3`,
          eq(studysets.public_set, true),
        ),
        orderBy: sql`similarity(${studysets.title}, ${query}) DESC`,
      }),
      this.db.query.visualsets.findMany({
        where: and(
          sql`similarity(${visualsets.title}, ${query}) > 0.3`,
          eq(visualsets.public_set, true),
        ),
        orderBy: sql`similarity(${visualsets.title}, ${query}) DESC`,
      }),
    ]);

    const ProfileArray: ProfileResponse[] = [];
    const SetArray: SetResponse[] = [];
    const ClassArray: ClassroomResponse[] = [];
    const StudoArray: StudoProfileResponse[] = [];

    // profiles
    profileResult.forEach((p) => {
      ProfileArray.push({
        id: p.user_id,
        displayName: p.displayName,
        img_url: p.img_url,
        type: 'profile',
      });
    });

    //studo-profiles
    studoProfileResult.forEach((s) => {
      StudoArray.push({
        id: s.id,
        displayName: s.displayName,
        img_url: s.img_url,
        banner_url: s.banner_url,
      });
    });

    // classrooms — batch owners
    const classroomOwnerIds = [
      ...new Set(classroomResult.map((c) => c.owner_id)),
    ];
    const classroomOwners = classroomOwnerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.user_id, classroomOwnerIds),
        })
      : [];

    for (const c of classroomResult) {
      const ownerProfile = classroomOwners.find(
        (p) => p.user_id === c.owner_id,
      );
      if (!ownerProfile)
        throw new NotFoundException(`User ${c.owner_id} not found`);

      ClassArray.push({
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        owner_id: c.owner_id,
        type: c.type,
        verified: c.verified,
      });
    }

    // studysets — batch owners, likes, cards
    const studysetIds = studoysetResult.map((ss) => ss.id);
    const studysetOwnerIds = [
      ...new Set(studoysetResult.map((ss) => ss.user_id)),
    ];

    const [studysetOwners, allStudysetLikes, allCards] = studysetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, studysetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, studysetIds),
          }),
          this.db.query.cards.findMany({
            where: inArray(cards.set_id, studysetIds),
          }),
        ])
      : [[], [], []];

    for (const ss of studoysetResult) {
      const owner = studysetOwners.find((p) => p.user_id === ss.user_id);
      if (!owner) throw new NotFoundException(`User ${ss.user_id} not found`);

      SetArray.push({
        id: ss.id,
        title: ss.title,
        subject: ss.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: ss.user_id,
        verified: owner.verified,
        likes: allStudysetLikes.filter((l) => l.set_id === ss.id).length,
        items: allCards.filter((c) => c.set_id === ss.id).length,
        type: 'studyset',
      });
    }

    // visualsets — batch owners, likes, images
    const visualsetIds = visualsetResult.map((vs) => vs.id);
    const visualsetOwnerIds = [
      ...new Set(visualsetResult.map((vs) => vs.user_id)),
    ];

    const [visualsetOwners, allVisualsetLikes, allImages] = visualsetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, visualsetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, visualsetIds),
          }),
          this.db.query.images.findMany({
            where: inArray(images.set_id, visualsetIds),
          }),
        ])
      : [[], [], []];

    for (const vs of visualsetResult) {
      const owner = visualsetOwners.find((p) => p.user_id === vs.user_id);
      if (!owner) throw new NotFoundException(`User ${vs.user_id} not found`);

      SetArray.push({
        id: vs.id,
        title: vs.title,
        subject: vs.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: vs.user_id,
        verified: owner.verified,
        likes: allVisualsetLikes.filter((l) => l.set_id === vs.id).length,
        items: allImages.filter((i) => i.set_id === vs.id).length,
        type: 'visualset',
      });
    }

    return {
      data: [
        { type: 'set', data: SetArray },
        { type: 'profile', data: ProfileArray },
        { type: 'classroom', data: ClassArray },
        { type: 'studo', data: StudoArray },
      ],
    };
  }

  async publicSearch(query: string) {
    const term: string = `%${query}%`;
    const [
      studoProfileResult,
      profileResult,
      classroomResult,
      studoysetResult,
      visualsetResult,
    ] = await Promise.all([
      this.db.query.studoprofiles.findMany({
        where: sql`
          similarity(${studoprofiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${studoprofiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${studoprofiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${studoprofiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.profiles.findMany({
        where: sql`
          similarity(${profiles.displayName}, ${query}) > 0.3
          OR EXISTS (
          SELECT 1 FROM unnest(${profiles.tags}) tag
          WHERE tag ILIKE ${term}
          )
        `,
        orderBy: sql`
          CASE WHEN ${profiles.displayName} ILIKE ${term} THEN 1 ELSE 2 END,
            similarity(${profiles.displayName}, ${query}) DESC
        `,
      }),
      this.db.query.classrooms.findMany({
        where: sql`similarity(${classrooms.name}, ${query}) > 0.3`,
        orderBy: sql`similarity(${classrooms.name}, ${query}) DESC`,
      }),
      this.db.query.studysets.findMany({
        where: and(
          sql`similarity(${studysets.title}, ${query}) > 0.3`,
          eq(studysets.public_set, true),
        ),
        orderBy: sql`similarity(${studysets.title}, ${query}) DESC`,
      }),
      this.db.query.visualsets.findMany({
        where: and(
          sql`similarity(${visualsets.title}, ${query}) > 0.3`,
          eq(visualsets.public_set, true),
        ),
        orderBy: sql`similarity(${visualsets.title}, ${query}) DESC`,
      }),
    ]);

    const ProfileArray: ProfileResponse[] = [];
    const SetArray: SetResponse[] = [];
    const ClassArray: ClassroomResponse[] = [];
    const StudoArray: StudoProfileResponse[] = [];

    // profiles
    profileResult.forEach((p) => {
      ProfileArray.push({
        id: p.user_id,
        displayName: p.displayName,
        img_url: p.img_url,
        type: 'profile',
      });
    });

    //studo-profiles
    studoProfileResult.forEach((s) => {
      StudoArray.push({
        id: s.id,
        displayName: s.displayName,
        img_url: s.img_url,
        banner_url: s.banner_url,
      });
    });

    // classrooms — batch owners
    const classroomOwnerIds = [
      ...new Set(classroomResult.map((c) => c.owner_id)),
    ];
    const classroomOwners = classroomOwnerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.user_id, classroomOwnerIds),
        })
      : [];

    for (const c of classroomResult) {
      const ownerProfile = classroomOwners.find(
        (p) => p.user_id === c.owner_id,
      );
      if (!ownerProfile)
        throw new NotFoundException(`User ${c.owner_id} not found`);

      ClassArray.push({
        id: c.id,
        name: c.name,
        owner: ownerProfile.displayName,
        owner_id: c.owner_id,
        type: c.type,
        verified: c.verified,
      });
    }

    // studysets — batch owners, likes, cards
    const studysetIds = studoysetResult.map((ss) => ss.id);
    const studysetOwnerIds = [
      ...new Set(studoysetResult.map((ss) => ss.user_id)),
    ];

    const [studysetOwners, allStudysetLikes, allCards] = studysetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, studysetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, studysetIds),
          }),
          this.db.query.cards.findMany({
            where: inArray(cards.set_id, studysetIds),
          }),
        ])
      : [[], [], []];

    for (const ss of studoysetResult) {
      const owner = studysetOwners.find((p) => p.user_id === ss.user_id);
      if (!owner) throw new NotFoundException(`User ${ss.user_id} not found`);

      SetArray.push({
        id: ss.id,
        title: ss.title,
        subject: ss.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: ss.user_id,
        verified: owner.verified,
        likes: allStudysetLikes.filter((l) => l.set_id === ss.id).length,
        items: allCards.filter((c) => c.set_id === ss.id).length,
        type: 'studyset',
      });
    }

    // visualsets — batch owners, likes, images
    const visualsetIds = visualsetResult.map((vs) => vs.id);
    const visualsetOwnerIds = [
      ...new Set(visualsetResult.map((vs) => vs.user_id)),
    ];

    const [visualsetOwners, allVisualsetLikes, allImages] = visualsetIds.length
      ? await Promise.all([
          this.db.query.profiles.findMany({
            where: inArray(profiles.user_id, visualsetOwnerIds),
          }),
          this.db.query.setlikes.findMany({
            where: inArray(setlikes.set_id, visualsetIds),
          }),
          this.db.query.images.findMany({
            where: inArray(images.set_id, visualsetIds),
          }),
        ])
      : [[], [], []];

    for (const vs of visualsetResult) {
      const owner = visualsetOwners.find((p) => p.user_id === vs.user_id);
      if (!owner) throw new NotFoundException(`User ${vs.user_id} not found`);

      SetArray.push({
        id: vs.id,
        title: vs.title,
        subject: vs.course,
        owner: owner.displayName,
        img_url: owner.img_url,
        owner_id: vs.user_id,
        verified: owner.verified,
        likes: allVisualsetLikes.filter((l) => l.set_id === vs.id).length,
        items: allImages.filter((i) => i.set_id === vs.id).length,
        type: 'visualset',
      });
    }

    return {
      data: [
        { type: 'set', data: SetArray },
        { type: 'profile', data: ProfileArray },
        { type: 'classroom', data: ClassArray },
        { type: 'studo', data: StudoArray },
      ],
    };
  }
}
