import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { and, eq, inArray } from 'drizzle-orm';
import {
  classrooms,
  profiles,
  studoprofilecommunities,
  studoprofiles,
  studotracks,
  studysets,
  trackcommunities,
  trackset,
  visualsets,
} from '../drizzle/schema';
import { StudysetResponseDto } from '../studyset/studyset.dto';
import { VisualsetResponseDto } from '../visualset/visualset.dto';
import { CommunityDTO } from './studoprofile.dto';
import { ClassroomResponse } from '../search/search.dto';

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
      ? await this.db.query.trackset.findMany({
          where: inArray(trackset.track_id, trackIds),
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
        studysets: allStudysets.filter((ss) => trackSetIds.includes(ss.id)),
        visualsets: allVisualsets.filter((vs) => trackSetIds.includes(vs.id)),
      };
    });

    // TODO: trackcommunities ophalen als je dat nodig hebt
    const profilecommunities =
      await this.db.query.studoprofilecommunities.findMany({
        where: studoprofilecommunities.studoprofile_id,
        id,
      });

    const communityIds = profilecommunities.map((ts) => t.id);

    const studoclassrooms = await Promise.all([
      communityIds.length
        ? this.db.query.classrooms.findMany({
            where: inArray(classrooms.id, communityIds),
          })
        : ([] as (typeof classrooms.$inferSelect)[]),
    ]);

    const communities: CommunityDTO[] = [];
    studoclassrooms.forEach((ts) => {
      communities.push({});
    });

    return {
      profile: studoprofile,
      tracks: enrichedTracks,
      communties: communities,
    };
  }
}
