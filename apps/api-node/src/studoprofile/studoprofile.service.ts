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
      where: eq(studotracks.studoprofile_id, id),
    });

    const trackIds = tracks.map((t) => t.id);

    // Batch fetch alle tracksets voor alle tracks
    const allTracksets = trackIds.length
      ? await this.db.query.tracksets.findMany({
          where: inArray(tracksets.track_id, trackIds),
        })
      : [];

    // Splits set IDs per type
    const studysetIds = allTracksets
      .filter((ts) => ts.set_type === 'studyset')
      .map((ts) => ts.set_id);
    const visualsetIds = allTracksets
      .filter((ts) => ts.set_type === 'visualset')
      .map((ts) => ts.set_id);

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
        .filter((ts) => ts.track_id === track.id)
        .map((ts) => ts.set_id);

      return {
        id: track.id,
        trackName: track.trackName,
        icon_name: track.icon_name,
        grade: track.grade,
        studysets: allStudysets.filter((ss) => trackSetIds.includes(ss.id)),
        visualsets: allVisualsets.filter((vs) => trackSetIds.includes(vs.id)),
      };
    });

    const profilecommunities =
      await this.db.query.studoprofilecommunities.findMany({
        where: eq(studoprofilecommunities.studoprofile_id, id),
      });

    const communityIds = profilecommunities.map((pc) => pc.classroom_id);

    const studoclassrooms = communityIds.length
      ? await this.db.query.classrooms.findMany({
          where: inArray(classrooms.id, communityIds),
        })
      : ([] as (typeof classrooms.$inferSelect)[]);

    const ownerIds = [...new Set(studoclassrooms.map((c) => c.owner_id))];
    const owners = ownerIds.length
      ? await this.db.query.profiles.findMany({
          where: inArray(profiles.user_id, ownerIds),
        })
      : [];

    const communities: CommunityDTO[] = studoclassrooms.map((c) => {
      const owner = owners.find((o) => o.user_id === c.owner_id);
      return {
        id: c.id,
        name: c.name,
        owner: owner?.displayName ?? 'Unknown',
        owner_id: c.owner_id,
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
