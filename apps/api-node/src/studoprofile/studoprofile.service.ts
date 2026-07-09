import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq, inArray } from 'drizzle-orm';
import {
  classrooms,
  profiles,
  studoprofilecommunities,
  studoprofiles,
  studotracks,
  studysets,
  tracksets,
  visualsets,
} from '../drizzle/schema';

import { CommunityDTO } from './studoprofile.dto';

@Injectable()
export class StudoprofileService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
  async trackSearch(id: string) {
    const studoprofile = await this.db.query.studoprofiles.findFirst({
      where: eq(studoprofiles.id, id),
    });
    if (!studoprofile) {
      throw new NotFoundException();
    }

    const tracks = await this.db.query.studotracks.findMany({
      where: eq(studotracks.studoprofileId, id),
    });

    const trackIds = tracks.map((t) => t.id);

    // Batch fetch alle tracksets voor alle tracks
    const allTracksets = trackIds.length
      ? await this.db.query.tracksets.findMany({
          where: inArray(tracksets.trackId, trackIds),
        })
      : [];

    // Splits set IDs per type
    const studysetIds = allTracksets
      .filter((ts) => ts.setType === 'studyset')
      .map((ts) => ts.setId);
    const visualsetIds = allTracksets
      .filter((ts) => ts.setType === 'visualset')
      .map((ts) => ts.setId);

    // Batch fetch sets
    const [allStudysets, allVisualsets] = await Promise.all([
      studysetIds.length
        ? this.db.query.studysets.findMany({
            where: inArray(studysets.id, studysetIds),
          })
        : ([] as (typeof studysets.$inferSelect)[]),
      visualsetIds.length
        ? this.db.query.visualsets.findMany({
            where: inArray(visualsets.id, visualsetIds),
          })
        : ([] as (typeof visualsets.$inferSelect)[]),
    ]);

    // Map per track
    const enrichedTracks = tracks.map((track) => {
      const trackSetIds = allTracksets
        .filter((ts) => ts.trackId === track.id)
        .map((ts) => ts.setId);

      return {
        id: track.id,
        trackName: track.trackName,
        iconName: track.iconName,
        grade: track.grade,
        studysets: allStudysets.filter((ss) => trackSetIds.includes(ss.id)),
        visualsets: allVisualsets.filter((vs) => trackSetIds.includes(vs.id)),
      };
    });

    const profilecommunities =
      await this.db.query.studoprofilecommunities.findMany({
        where: eq(studoprofilecommunities.studoprofileId, id),
      });

    const communityIds = profilecommunities.map((pc) => pc.classroomId);

    const studoclassrooms = communityIds.length
      ? await this.db.query.classrooms.findMany({
          where: inArray(classrooms.id, communityIds),
        })
      : ([] as (typeof classrooms.$inferSelect)[]);

    const ownerIds = [...new Set(studoclassrooms.map((c) => c.ownerId))];
    const owners = ownerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.userId, ownerIds),
        })
      : [];

    const communities: CommunityDTO[] = studoclassrooms.map((c) => {
      const owner = owners.find((o) => o.userId === c.ownerId);
      return {
        id: c.id,
        name: c.name,
        owner: owner?.displayName ?? 'Unknown',
        ownerId: c.ownerId,
        type: c.type,
        verified: c.verified,
      };
    });

    return {
      profile: studoprofile,
      tracks: enrichedTracks,
      communities: communities,
    };
  }
}
