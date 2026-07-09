import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { CreateSetLikeDto, SetLikeResponseDto } from '../studyset/setlike.dto';
import {
  CreateVisualsetDto,
  FullVSResponseListDto,
  ImageDto,
  VisualsetResponseDto,
  VisualsetResponseListDto,
  UpdateVisualsetDto,
} from './visualset.dto';
import { PinResponseDto } from '../pin/pin.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import {
  classroomactivities,
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
import { and, eq, sql } from 'drizzle-orm';

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

    const Pins: PinResponseDto[] = [];
    const setId = uuidv4();
    const visualset = {
      id: setId,
      title: data.title,
      createdAt: date.toISOString(),
      lastStudied: '',
      lastUpdated: date.toISOString(),
      publicSet: false,
      userId: userId,
      displayName: name.displayName,
      imgUrl: name.imgUrl,
      studoset: false,
    };

    //sessie creeeren
    const ssid = uuidv4();
    const session = {
      id: ssid,
      startedAt: date.toISOString(),
      durationMin: 0,
      secondLastLogin: 'unknown',
      lastLogin: 'unknown',
      endedAt: 'unknown',
      index: 0,
      accuracy: 100,
      averageResponseTime: 0,
      longestFocusStreak: 0,
      deviceType: 'unknown',
      lastSeen: date.toISOString(),
      lastStudied: date.toISOString(),
      userId: userId,
      setId: setId,
      setType: 'visualset',
    };

    //images creeeren
    const IMAGES: ImageDto[] = [];
    data.images.forEach((image) => {
      const imgId = uuidv6();
      const Image: ImageDto = {
        id: imgId,
        title: image.title,
        url: image.url,
        index: image.index,
        gridX: image.gridX,
        gridY: image.gridY,
        scale: String(image.scale),
        setId: setId,
      };
      IMAGES.push(Image);
      //pins creeeren
      data.pins
        .filter((pin) => {
          return pin.imgUrl === image.url;
        })
        .map((pin) => {
          const Pin = {
            id: uuidv6(),
            definition: pin.definition,
            x: pin.x,
            y: pin.y,
            number: pin.number,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
            imageId: imgId,
            setId: setId,
            ownerId: userId,
          };
          Pins.push(Pin);
        });
    });

    await this.db.insert(visualsets).values(visualset);
    await this.db.insert(studysessions).values(session);
    await this.db
      .update(users)
      .set({
        totalSets: sql`${users.totalSets}
        + 1`,
      })
      .where(eq(users.id, userId));

    for (const Image of IMAGES) {
      await this.db.insert(images).values(Image);
    }

    for (const pin of Pins) {
      await this.db.insert(pins).values(pin);

      // sessionpin aanmaken
      const sessionPin = {
        id: uuidv4(),
        number: pin.number,
        pinViewcount: 0,
        pinTotalViewcount: 0,
        inQueue: false,
        mastered: false,
        timesRelearned: 0,
        pinId: pin.id,
        sessionId: ssid,
        ownerId: userId,
      };
      await this.db.insert(sessionpins).values(sessionPin);
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

    let sesh = null;
    if (!session) {
      await this.createSession(userId, setId);
      sesh = await this.getBySetId(userId, setId);
    } else {
      sesh = await this.getBySetId(userId, setId);
    }

    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.userId, userId),
    });

    const classes = [];
    for (const u of classusers) {
      const classroom = await this.db.query.classrooms.findFirst({
        where: eq(classrooms.id, u.classroomId),
      });
      if (classroom) {
        classes.push(classroom);
      }
    }

    const setclasses = [];
    for (const c of classes) {
      const class_set = await this.db.query.classroomsets.findFirst({
        where: and(
          eq(classroomsets.setId, setId),
          eq(classroomsets.classroomId, c.id),
        ),
      });
      if (class_set) {
        setclasses.push(c);
      }
    }

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
      await tx
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.setId, setId),
            eq(studysessions.setType, 'visualset'),
          ),
        );

      await tx
        .delete(setlikes)
        .where(
          and(eq(setlikes.setId, setId), eq(setlikes.setType, 'visualset')),
        );

      await tx
        .delete(classroomsets)
        .where(
          and(
            eq(classroomsets.setId, setId),
            eq(classroomsets.setType, 'visualset'),
          ),
        );

      await tx
        .delete(classroomactivities)
        .where(
          and(
            eq(classroomactivities.setId, setId),
            eq(classroomactivities.setType, 'visualset'),
          ),
        );

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
    const like = {
      id: uuidv4(),
      setId: body.setId,
      setType: 'visualset',
      userId: userId,
      createdAt: date.toISOString(),
    };

    await this.db.insert(setlikes).values(like);

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

    const date = new Date();
    const ssid = uuidv4();

    // Session aanmaken
    const session = {
      id: ssid,
      startedAt: date.toISOString(),
      durationMin: 0,
      secondLastLogin: 'unknown',
      lastLogin: 'unknown',
      endedAt: 'unknown',
      index: 0,
      accuracy: 100,
      averageResponseTime: 0,
      longestFocusStreak: 0,
      deviceType: 'unknown',
      lastSeen: date.toISOString(),
      lastStudied: date.toISOString(),
      userId,
      setId,
      setType: 'visualset',
    };

    await this.db.insert(studysessions).values(session);

    // Alle pins ophalen
    const pinnetjes = await this.db.query.pins.findMany({
      where: eq(pins.setId, setId),
    });

    // Pins parallel inserten
    const seshpins = await Promise.all(
      pinnetjes.map(async (pin) => {
        const created = {
          id: uuidv4(),
          number: pin.number,
          pinViewcount: 0,
          pinTotalViewcount: 0,
          inQueue: false,
          mastered: false,
          timesRelearned: 0,
          pinId: pin.id,
          sessionId: ssid,
          ownerId: userId,
        };
        await this.db.insert(sessionpins).values(created);
        return created;
      }),
    );

    // Return de session met pins
    return { ...session, cards: null, pins: seshpins };
  }
}
