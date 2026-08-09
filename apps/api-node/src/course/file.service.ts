/// <reference types="multer" />
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { CourseDocument, FullCourseDocument } from '@studo/types';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { courseDocuments, courseUsers } from '../drizzle/schema';
import { and, eq } from 'drizzle-orm';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {
  private readonly s3 = new S3Client({
    region: 'auto',
    // jurisdiction-scoped bucket (bv. eu) vereist het jurisdiction-endpoint;
    // val terug op het standaard account-endpoint als het niet gezet is.
    endpoint:
      process.env.R2_JURISDICTION_ENDPOINT ??
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async CourseUserCheck(userId: string, courseId: string) {
    const user = await this.db.query.courseUsers.findFirst({
      where: and(
        eq(courseUsers.userId, userId),
        eq(courseUsers.courseId, courseId),
      ),
    });

    if (!user) {
      throw new NotFoundException('User not in course');
    }
  }

  async upload(
    courseId: string,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<CourseDocument[]> {
    await this.CourseUserCheck(userId, courseId);
    const results = await Promise.all(
      files.map((file) => this.uploadSingle(file, courseId, userId)),
    );
    return results.filter((r): r is CourseDocument => r !== null);
  }

  async uploadSingle(
    file: Express.Multer.File,
    courseId: string,
    userId: string,
  ): Promise<CourseDocument | null> {
    const uuid = uuidv4();
    const extension = file.originalname.split('.').pop();
    const key = `course/${courseId}/${uuid}.${extension}`;

    const [record] = await this.db
      .insert(courseDocuments)
      .values({
        id: uuid,
        courseId: courseId,
        uploaderId: userId,
        title: file.originalname,
        status: 'uploading',
        storageKey: key,
        mimeType: file.mimetype,
        fileSize: file.size,
      })
      .returning();

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      await this.redis.xadd(
        'studo:documents:parse',
        'MAXLEN',
        '~',
        10000,
        '*',
        'payload',
        JSON.stringify({
          v: 1,
          mimeType: record.mimeType,
          courseId: courseId,
          documentId: record.id,
          r2Key: record.storageKey,
        }),
      );
    } catch (e) {
      await this.db
        .update(courseDocuments)
        .set({ status: 'failed' })
        .where(eq(courseDocuments.id, record.id));
      throw e;
    }

    return record;
  }

  async getDocument(
    courseId: string,
    docId: string,
    userId: string,
  ): Promise<FullCourseDocument> {
    const datum = new Date();
    await this.CourseUserCheck(userId, courseId);
    const record = await this.db.query.courseDocuments.findFirst({
      where: and(
        eq(courseDocuments.id, docId),
        eq(courseDocuments.courseId, courseId),
      ),
      with: {
        chunks: true,
      },
    });

    if (!record) {
      throw new NotFoundException('document is not found');
    }

    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: record.storageKey,
      }),
      { expiresIn: 3600 },
    );

    if (!url) {
      throw new NotFoundException('url is not fetched');
    }

    await this.db
      .update(courseDocuments)
      .set({
        lastOpened: datum,
      })
      .where(eq(courseDocuments.id, docId));

    return {
      ...record,
      lastOpened: datum,
      chunks: record?.chunks.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        createdAt: chunk.createdAt,
        updatedAt: chunk.updatedAt,
      })),
      url: url,
    };
  }

  async reprocess(courseId: string, docId: string) {
    const document = await this.db.query.courseDocuments.findFirst({
      where: eq(courseDocuments.id, docId),
    });

    if (!document) {
      throw new NotFoundException("document doesn't exist");
    }

    try {
      await this.redis.xadd(
        'studo:documents:parse',
        'MAXLEN',
        '~',
        10000,
        '*',
        'payload',
        JSON.stringify({
          v: 1,
          mimeType: document.mimeType,
          courseId: courseId,
          documentId: document.id,
          r2Key: document.storageKey,
        }),
      );
    } catch (e) {
      await this.db
        .update(courseDocuments)
        .set({ status: 'failed' })
        .where(eq(courseDocuments.id, document.id));
      throw e;
    }
  }
}
