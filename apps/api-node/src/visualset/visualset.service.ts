import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { CreateSetLikeDto, SetLikeResponseDto } from '../studyset/setlike.dto';
import {
  CreateVisualsetDto,
  FullVSResponseListDto,
  VisualsetResponseDto,
  VisualsetResponseListDto,
  UpdateVisualsetDto,
} from './visualset.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  classrooms,
  classroomsets,
  classroomusers,
  images,
  pins,
  sessionpins,
  setlikes,
  studysessions,
  users,
  visualsets,
} from '../drizzle/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { buildNewSession, deleteSetReferences } from '../lib/set-helpers';

@Injectable()
export class VisualsetService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async create(
    userId: string,
    data: CreateVisualsetDto,
  ): Promise<VisualsetResponseDto> {
    const date = new Date();
    const name = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!name) {
      throw new NotFoundException('no user with this id exists');
    }

    const [visualset] = await this.db
      .insert(visualsets)
      .values({
        title: data.title,
        createdAt: date.toISOString(),
        lastUpdated: date.toISOString(),
        publicSet: false,
        userId: userId,
        displayName: name.displayName,
        imgUrl: name.imgUrl,
        studoset: false,
      })
      .returning();
    const setId = visualset.id;

    // sessie creeeren
    const [session] = await this.db
      .insert(studysessions)
      .values(
        buildNewSession({ userId, setId, setType: 'visualset', now: date }),
      )
      .returning();
    const ssid = session.id;

    await this.db
      .update(users)
      .set({
        totalSets: sql`${users.totalSets}
        + 1`,
      })
      .where(eq(users.id, userId));

    //images + pins creeeren
    for (const image of data.images) {
      const [insertedImage] = await this.db
        .insert(images)
        .values({
          title: image.title,
          url: image.url,
          index: image.index,
          gridX: image.gridX,
          gridY: image.gridY,
          scale: String(image.scale),
          setId: setId,
        })
        .returning();

      const imagePins = data.pins.filter((pin) => pin.imgUrl === image.url);
      for (const pin of imagePins) {
        const [insertedPin] = await this.db
          .insert(pins)
          .values({
            definition: pin.definition,
            x: pin.x,
            y: pin.y,
            number: pin.number,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
            imageId: insertedImage.id,
            setId: setId,
            ownerId: userId,
          })
          .returning();

        // sessionpin aanmaken
        await this.db.insert(sessionpins).values({
          number: pin.number,
          pinViewcount: 0,
          pinTotalViewcount: 0,
          inQueue: false,
          mastered: false,
          timesRelearned: 0,
          pinId: insertedPin.id,
          sessionId: ssid,
          ownerId: userId,
        });
      }
    }

    return visualset;
  }

  async getAll(): Promise<VisualsetResponseListDto> {
    const items = await this.db.query.visualsets.findMany();
    return { visualsets: items };
  }

  async getById(userId: string, setId: string): Promise<FullVSResponseListDto> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('No ((visualset)) with this id exists');
    }

    const dbImages = await this.db.query.images.findMany({
      where: eq(images.setId, setId),
    });

    const dbPins = await this.db.query.pins.findMany({
      where: eq(pins.setId, setId),
    });

    const dbLikes = await this.db.query.setlikes.findMany({
      where: eq(setlikes.setId, setId),
    });

    const imagesWithPins = dbImages.map((img) => ({
      id: img.id,
      title: img.title,
      url: img.url,
      index: img.index,
      gridX: img.gridX,
      gridY: img.gridY,
      scale: img.scale,
      setId: img.setId,
      pins: {
        pins: dbPins
          .filter((pin) => pin.imageId === img.id)
          .map((pin) => ({
            id: pin.id,
            definition: pin.definition,
            x: pin.x,
            y: pin.y,
            number: pin.number,
            createdAt: pin.createdAt,
            updatedAt: pin.updatedAt,
            imageId: pin.imageId,
            setId: pin.setId,
            ownerId: pin.ownerId,
          }))
          .sort((a, b) => a.number - b.number),
      },
    }));

    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.userId, userId),
        eq(studysessions.setId, setId),
      ),
    });

    if (!session) {
      await this.createSession(userId, setId);
    }
    const sesh = await this.getBySetId(userId, setId);

    // Classrooms the user belongs to that also contain this set
    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.userId, userId),
    });
    const classroomIds = classusers.map((u) => u.classroomId);

    const [classes, classroomSetsForThisSet] = await Promise.all([
      classroomIds.length > 0
        ? this.db.query.classrooms.findMany({
            where: inArray(classrooms.id, classroomIds),
          })
        : Promise.resolve([] as (typeof classrooms.$inferSelect)[]),
      classroomIds.length > 0
        ? this.db.query.classroomsets.findMany({
            where: and(
              eq(classroomsets.setId, setId),
              inArray(classroomsets.classroomId, classroomIds),
            ),
          })
        : Promise.resolve([] as (typeof classroomsets.$inferSelect)[]),
    ]);

    const classroomIdsWithSet = new Set(
      classroomSetsForThisSet.map((cs) => cs.classroomId),
    );
    const setclasses = classes.filter((c) => classroomIdsWithSet.has(c.id));

    return {
      ...set,
      images: imagesWithPins.sort((a, b) => a.index - b.index),
      likes: { likes: dbLikes },
      session: sesh,
      classrooms: setclasses,
    };
  }

  async getBySetId(
    userId: string,
    setId: string,
  ): Promise<StudysessionResponseDto> {
    let session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.setId, setId),
        eq(studysessions.userId, userId),
      ),
    });

    if (!session) {
      session = await this.createSession(userId, setId);
    }

    const sessionPins = await this.db.query.sessionpins.findMany({
      where: eq(sessionpins.sessionId, session.id),
    });

    return { ...session, pins: sessionPins, cards: null };
  }

  async updateById(
    userId: string,
    setId: string,
    body: UpdateVisualsetDto,
  ): Promise<FullVSResponseListDto> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    if (set.userId !== userId) {
      throw new ForbiddenException('You do not own this ((visualset))');
    }

    await this.db
      .update(visualsets)
      .set({
        title: body?.title,
        publicSet: body?.publicSet,
      })
      .where(eq(visualsets.id, setId));

    // images updaten
    if (body.images && body.images.length > 0) {
      await Promise.all(
        body.images.map((image) =>
          this.db
            .update(images)
            .set({
              title: image?.title,
              url: image?.url,
              gridX: image?.gridX,
              gridY: image?.gridY,
              scale: image?.scale,
            })
            .where(eq(images.id, image.id)),
        ),
      );
    }

    // pins updaten
    if (body.pins && body.pins.length > 0) {
      await Promise.all(
        body.pins.map((pin) =>
          this.db
            .update(pins)
            .set({
              definition: pin?.definition,
              x: pin?.x,
              y: pin?.y,
              number: pin?.number,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(pins.id, pin.id)),
        ),
      );
    }

    return this.getById(userId, setId);
  }

  async deleteById(userId: string, setId: string): Promise<void> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    if (set.userId !== userId) {
      await this.db
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.setId, setId),
            eq(studysessions.userId, userId),
            eq(studysessions.setType, 'visualset'),
          ),
        );
      return;
    }

    await this.db.transaction(async (tx) => {
      // Verwijder polymorphic references
      await deleteSetReferences(tx, setId, 'visualset');

      const result = await tx
        .delete(visualsets)
        .where(eq(visualsets.id, setId))
        .returning();

      if (result.length === 0) {
        throw new NotFoundException('Failed to delete ((visualset))');
      }
    });
  }

  async likeSet(
    userId: string,
    body: CreateSetLikeDto,
  ): Promise<SetLikeResponseDto> {
    const date = new Date();
    const [like] = await this.db
      .insert(setlikes)
      .values({
        setId: body.setId,
        setType: 'visualset',
        userId: userId,
        createdAt: date.toISOString(),
      })
      .returning();

    return like;
  }

  async removeLike(userId: string, setId: string): Promise<void> {
    const result = await this.db
      .delete(setlikes)
      .where(and(eq(setlikes.setId, setId), eq(setlikes.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No like with this id exists');
    }
  }

  async getAllLikes(setId: string): Promise<SetLikeResponseDto[]> {
    return await this.db.query.setlikes.findMany({
      where: eq(setlikes.setId, setId),
    });
  }

  async createSession(
    userId: string,
    setId: string,
  ): Promise<StudysessionResponseDto> {
    // Check of de ((visualset)) bestaat
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, setId),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    // Session aanmaken
    const [session] = await this.db
      .insert(studysessions)
      .values(buildNewSession({ userId, setId, setType: 'visualset' }))
      .returning();
    const ssid = session.id;

    // Alle pins ophalen
    const pinnetjes = await this.db.query.pins.findMany({
      where: eq(pins.setId, setId),
    });

    // Pins parallel inserten
    const seshpins = await Promise.all(
      pinnetjes.map(async (pin) => {
        const [created] = await this.db
          .insert(sessionpins)
          .values({
            number: pin.number,
            pinViewcount: 0,
            pinTotalViewcount: 0,
            inQueue: false,
            mastered: false,
            timesRelearned: 0,
            pinId: pin.id,
            sessionId: ssid,
            ownerId: userId,
            flagged: false,
          })
          .returning();
        return created;
      }),
    );

    // Return de session met pins
    return { ...session, cards: null, pins: seshpins };
  }
}
