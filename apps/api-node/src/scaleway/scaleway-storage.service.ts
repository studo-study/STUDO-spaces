import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// veilige narrowing van een unknown catch-error
const errMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e);
const errStack = (e: unknown): string | undefined =>
  e instanceof Error ? e.stack : undefined;

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
    const region = this.configService.get<string>(
      'SCALEWAY_REGION',
      'nl-NL-ams',
    );

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
    } catch (error: unknown) {
      // volledige detail server-side loggen, generieke boodschap naar de client
      this.logger.error(
        `Failed to upload image (${fileName}): ${errMessage(error)}`,
        errStack(error),
      );
      throw new InternalServerErrorException('Image upload failed');
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
        throw new BadRequestException('Invalid image URL format');
      }

      const key = match[1];

      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Image deleted successfully: ${key}`);
    } catch (error: unknown) {
      // BadRequest (ongeldige URL) niet omzetten naar een 500
      if (error instanceof BadRequestException) throw error;
      this.logger.error(
        `Failed to delete image: ${errMessage(error)}`,
        errStack(error),
      );
      throw new InternalServerErrorException('Image deletion failed');
    }
  }
}
