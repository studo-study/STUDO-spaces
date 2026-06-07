import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { StudysessionResponseDto } from '../studysession/studysession.dto';
import { SwitchFolderDto } from '../folder/folder.dto';
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
  folder_sets,
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
    user_id: string,
    data: CreateVisualsetDto,
  ): Promise<VisualsetResponseDto> {
    const date = new Date();
    const name = await this.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });
    if (!name) {
      throw new NotFoundException('no user with this id exists');
    }

    const Pins: PinResponseDto[] = [];
    const setId = uuidv4();
    const visualset = {
      id: setId,
      title: data.title,
      course: data.subject,
      created_at: date.toISOString(),
      last_studied: '',
      last_updated: date.toISOString(),
      public_set: false,
      user_id: user_id,
      displayName: name.displayName,
      img_url: name.img_url,
      studoset: false,
    };

    //sessie creeeren
    const ssid = uuidv4();
    const session = {
      id: ssid,
      started_at: date.toISOString(),
      duration_min: 0,
      second_last_login: 'unknown',
      last_login: 'unknown',
      ended_at: 'unknown',
      index: 0,
      accuracy: 100,
      average_response_time: 0,
      longest_focus_streak: 0,
      device_type: 'unknown',
      last_seen: date.toISOString(),
      last_studied: date.toISOString(),
      user_id: user_id,
      set_id: setId,
      set_type: 'visualset',
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
        grid_x: image.grid_x,
        grid_y: image.grid_y,
        scale: String(image.scale),
        set_id: setId,
      };
      IMAGES.push(Image);
      //pins creeeren
      data.pins
        .filter((pin) => {
          return pin.img_url === image.url;
        })
        .map((pin) => {
          const Pin = {
            id: uuidv6(),
            definition: pin.definition,
            x: pin.x,
            y: pin.y,
            number: pin.number,
            created_at: date.toISOString(),
            updated_at: date.toISOString(),
            image_id: imgId,
            set_id: setId,
            owner_id: user_id,
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
      .where(eq(users.id, user_id));

    for (const Image of IMAGES) {
      await this.db.insert(images).values(Image);
    }

    for (const pin of Pins) {
      await this.db.insert(pins).values(pin);

      // sessionpin aanmaken
      const sessionPin = {
        id: uuidv4(),
        number: pin.number,
        pin_viewcount: 0,
        pin_total_viewcount: 0,
        inQueue: false,
        mastered: false,
        times_relearned: 0,
        pin_id: pin.id,
        session_id: ssid,
        owner_id: user_id,
      };
      await this.db.insert(sessionpins).values(sessionPin);
    }

    if (data.folder_id) {
      await this.db.insert(folder_sets).values({
        id: uuidv4(),
        user_id: user_id,
        set_id: setId,
        set_type: 'visualset',
        folder_id: data.folder_id,
      });
    }

    return visualset;
  }

  async getAll(): Promise<VisualsetResponseListDto> {
    const items = await this.db.query.visualsets.findMany();
    return { visualsets: items };
  }

  async getById(
    user_id: string,
    set_id: string,
  ): Promise<FullVSResponseListDto> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('No ((visualset)) with this id exists');
    }

    const dbImages = await this.db.query.images.findMany({
      where: eq(images.set_id, set_id),
    });

    const dbPins = await this.db.query.pins.findMany({
      where: eq(pins.set_id, set_id),
    });

    const dbLikes = await this.db.query.setlikes.findMany({
      where: eq(setlikes.set_id, set_id),
    });

    const imagesWithPins = dbImages.map((img) => ({
      id: img.id,
      title: img.title,
      url: img.url,
      index: img.index,
      grid_x: img.grid_x,
      grid_y: img.grid_y,
      scale: img.scale,
      set_id: img.set_id,
      pins: {
        pins: dbPins
          .filter((pin) => pin.image_id === img.id)
          .map((pin) => ({
            id: pin.id,
            definition: pin.definition,
            x: pin.x,
            y: pin.y,
            number: pin.number,
            created_at: pin.created_at,
            updated_at: pin.updated_at,
            image_id: pin.image_id,
            set_id: pin.set_id,
            owner_id: pin.owner_id,
          }))
          .sort((a, b) => a.number - b.number),
      },
    }));

    const session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.user_id, user_id),
        eq(studysessions.set_id, set_id),
      ),
    });

    let sesh = null;
    if (!session) {
      await this.createSession(user_id, set_id);
      sesh = await this.getBySetId(user_id, set_id);
    } else {
      sesh = await this.getBySetId(user_id, set_id);
    }

    const classusers = await this.db.query.classroomusers.findMany({
      where: eq(classroomusers.user_id, user_id),
    });

    const classes = [];
    for (const u of classusers) {
      const classroom = await this.db.query.classrooms.findFirst({
        where: eq(classrooms.id, u.classroom_id),
      });
      if (classroom) {
        classes.push(classroom);
      }
    }

    const setclasses = [];
    for (const c of classes) {
      const class_set = await this.db.query.classroomsets.findFirst({
        where: and(
          eq(classroomsets.set_id, set_id),
          eq(classroomsets.classroom_id, c.id),
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
    user_id: string,
    set_id: string,
  ): Promise<StudysessionResponseDto> {
    let session = await this.db.query.studysessions.findFirst({
      where: and(
        eq(studysessions.set_id, set_id),
        eq(studysessions.user_id, user_id),
      ),
    });

    if (!session) {
      session = await this.createSession(user_id, set_id);
    }

    const sessionPins = await this.db.query.sessionpins.findMany({
      where: eq(sessionpins.session_id, session.id),
    });

    return { ...session, pins: sessionPins, cards: null };
  }

  async updateById(
    user_id: string,
    set_id: string,
    body: UpdateVisualsetDto,
  ): Promise<FullVSResponseListDto> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    if (set.user_id !== user_id) {
      throw new ForbiddenException('You do not own this ((visualset))');
    }

    await this.db
      .update(visualsets)
      .set({
        title: body?.title,
        course: body?.course,
        public_set: body?.public_set,
      })
      .where(eq(visualsets.id, set_id));

    if (body.folder_id) {
      const existing = await this.db.query.folder_sets.findFirst({
        where: and(
          eq(folder_sets.user_id, user_id),
          eq(folder_sets.set_id, set_id),
          eq(folder_sets.set_type, 'visualset'),
        ),
      });
      if (existing) {
        await this.db
          .update(folder_sets)
          .set({ folder_id: body.folder_id })
          .where(eq(folder_sets.id, existing.id));
      } else {
        await this.db.insert(folder_sets).values({
          id: uuidv4(),
          user_id: user_id,
          set_id: set_id,
          set_type: 'visualset',
          folder_id: body.folder_id,
        });
      }
    }

    // images updaten
    if (body.images && body.images.length > 0) {
      await Promise.all(
        body.images.map((image) =>
          this.db
            .update(images)
            .set({
              title: image?.title,
              url: image?.url,
              grid_x: image?.grid_x,
              grid_y: image?.grid_y,
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
              updated_at: new Date().toISOString(),
            })
            .where(eq(pins.id, pin.id)),
        ),
      );
    }

    return this.getById(user_id, set_id);
  }

  async deleteById(user_id: string, set_id: string): Promise<void> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    if (set.user_id !== user_id) {
      await this.db
        .delete(studysessions)
        .where(
          and(
            eq(studysessions.set_id, set_id),
            eq(studysessions.user_id, user_id),
            eq(studysessions.set_type, 'visualset'),
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
            eq(studysessions.set_id, set_id),
            eq(studysessions.set_type, 'visualset'),
          ),
        );

      await tx
        .delete(setlikes)
        .where(
          and(eq(setlikes.set_id, set_id), eq(setlikes.set_type, 'visualset')),
        );

      await tx
        .delete(classroomsets)
        .where(
          and(
            eq(classroomsets.set_id, set_id),
            eq(classroomsets.set_type, 'visualset'),
          ),
        );

      await tx
        .delete(classroomactivities)
        .where(
          and(
            eq(classroomactivities.set_id, set_id),
            eq(classroomactivities.set_type, 'visualset'),
          ),
        );

      const result = await tx
        .delete(visualsets)
        .where(eq(visualsets.id, set_id))
        .returning();

      if (result.length === 0) {
        throw new NotFoundException('Failed to delete ((visualset))');
      }
    });
  }

  async switchFolder(
    user_id: string,
    dto: SwitchFolderDto,
  ): Promise<FullVSResponseListDto> {
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, dto.set_id),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    if (set.user_id !== user_id) {
      throw new ForbiddenException('You do not own this visualset');
    }

    const existing = await this.db.query.folder_sets.findFirst({
      where: and(
        eq(folder_sets.user_id, user_id),
        eq(folder_sets.set_id, dto.set_id),
        eq(folder_sets.set_type, 'visualset'),
      ),
    });

    if (existing) {
      await this.db
        .update(folder_sets)
        .set({ folder_id: dto.destinationFolder_id })
        .where(eq(folder_sets.id, existing.id));
    } else {
      await this.db.insert(folder_sets).values({
        id: uuidv4(),
        user_id: user_id,
        set_id: dto.set_id,
        set_type: 'visualset',
        folder_id: dto.destinationFolder_id,
      });
    }

    return this.getById(user_id, dto.set_id);
  }

  async likeSet(
    user_id: string,
    body: CreateSetLikeDto,
  ): Promise<SetLikeResponseDto> {
    const date = new Date();
    const like = {
      id: uuidv4(),
      set_id: body.set_id,
      set_type: 'visualset',
      user_id: user_id,
      created_at: date.toISOString(),
    };

    await this.db.insert(setlikes).values(like);

    return like;
  }

  async removeLike(user_id: string, set_id: string): Promise<void> {
    const result = await this.db
      .delete(setlikes)
      .where(and(eq(setlikes.set_id, set_id), eq(setlikes.user_id, user_id)))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException('No like with this id exists');
    }
  }

  async getAllLikes(set_id: string): Promise<SetLikeResponseDto[]> {
    return await this.db.query.setlikes.findMany({
      where: eq(setlikes.set_id, set_id),
    });
  }

  async createSession(
    user_id: string,
    set_id: string,
  ): Promise<StudysessionResponseDto> {
    // Check of de ((visualset)) bestaat
    const set = await this.db.query.visualsets.findFirst({
      where: eq(visualsets.id, set_id),
    });

    if (!set) {
      throw new NotFoundException('Visualset not found');
    }

    const date = new Date();
    const ssid = uuidv4();

    // Session aanmaken
    const session = {
      id: ssid,
      started_at: date.toISOString(),
      duration_min: 0,
      second_last_login: 'unknown',
      last_login: 'unknown',
      ended_at: 'unknown',
      index: 0,
      accuracy: 100,
      average_response_time: 0,
      longest_focus_streak: 0,
      device_type: 'unknown',
      last_seen: date.toISOString(),
      last_studied: date.toISOString(),
      user_id,
      set_id,
      set_type: 'visualset',
    };

    await this.db.insert(studysessions).values(session);

    // Alle pins ophalen
    const pinnetjes = await this.db.query.pins.findMany({
      where: eq(pins.set_id, set_id),
    });

    // Pins parallel inserten
    const seshpins = await Promise.all(
      pinnetjes.map(async (pin) => {
        const created = {
          id: uuidv4(),
          number: pin.number,
          pin_viewcount: 0,
          pin_total_viewcount: 0,
          inQueue: false,
          mastered: false,
          times_relearned: 0,
          pin_id: pin.id,
          session_id: ssid,
          owner_id: user_id,
        };
        await this.db.insert(sessionpins).values(created);
        return created;
      }),
    );

    // Return de session met pins
    return { ...session, cards: null, pins: seshpins };
  }
}
