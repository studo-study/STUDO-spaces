import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  type DatabaseProvider,
  DrizzleAsyncProvider,
  drizzleProvider,
  InjectDrizzle,
} from './drizzle.provider';
import path from 'node:path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as fs from 'node:fs'; // 👈 postgres-js in plaats van mysql2

@Module({
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(DrizzleModule.name);

  constructor(@InjectDrizzle() private readonly db: DatabaseProvider) {}

  async onModuleInit() {
    this.logger.log('⏳ Running migrations...');

    // Probeer meerdere kandidaat-paden, pak de eerste die bestaat
    const candidates = [
      path.resolve(__dirname, '..', '..', 'migrations'),
      path.resolve(__dirname, '..', '..', '..', 'migrations'),
      path.resolve(process.cwd(), 'apps/api-node/migrations'),
      path.resolve(process.cwd(), 'migrations'),
    ];

    const migrationsFolder = candidates.find((p) => fs.existsSync(p));

    if (!migrationsFolder) {
      this.logger.error(
        `❌ No migrations folder found. Tried: ${candidates.join(', ')}`,
      );
      throw new Error('Migrations folder not found');
    }

    this.logger.log(`📂 Using migrations folder: ${migrationsFolder}`);

    try {
      await migrate(this.db, { migrationsFolder });
      this.logger.log('✅ Migrations completed!');
    } catch (error) {
      this.logger.error('❌ Migration failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('🔌 Closing database connection...');
    await this.db.$client.end();
  }
}
