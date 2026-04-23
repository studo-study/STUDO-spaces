// src/common/services/scaleway-storage.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScalewayStorageService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly logger = new Logger(ScalewayStorageService.name);

  constructor(private configService: ConfigService) {
    // Valideer dat alle required config aanwezig is
    const accessKey = this.configService.get<string>('SCALEWAY_ACCESS_KEY');
    const secretKey = this.configService.get<string>('SCALEWAY_SECRET_KEY');
    const bucketName = this.configService.get<string>('SCALEWAY_BUCKET_NAME');
    const region = this.configService.get<string>('SCALEWAY_REGION', 'nl-NL-ams');

    if (!accessKey || !secretKey || !bucketName) {
      throw new Error(
        'Missing Scaleway configuration. Please check SCALEWAY_ACCESS_KEY, SCALEWAY_SECRET_KEY, and SCALEWAY_BUCKET_NAME in your .env file',
      );
    }

    this.region = region;
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: `https://s3.${this.region}.scw.cloud`,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }

  onModuleInit() {
    this.logger.log('Scaleway Storage Service initialized');
    this.logger.log(`Region: ${this.region}`);
    this.logger.log(`Bucket: ${this.bucketName}`);
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
    folder: 'visualsets' | 'profiles' = 'visualsets',
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${userId}/${uuidv4()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const publicUrl = `https://${this.bucketName}.s3.${this.region}.scw.cloud/${fileName}`;
      this.logger.log(`Image uploaded successfully: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      this.logger.error(
        `Failed to upload image: ${error.message}`,
        error.stack,
      );
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) =>
      this.uploadImage(file, userId, 'visualsets'),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Optioneel: Delete een image (voor cleanup)
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract key from URL
      const urlPattern = new RegExp(
        `https://${this.bucketName}.s3.${this.region}.scw.cloud/(.+)`,
      );
      const match = imageUrl.match(urlPattern);

      if (!match || !match[1]) {
        throw new Error('Invalid image URL format');
      }

      const key = match[1];

      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Image deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete image: ${error.message}`);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }
}
