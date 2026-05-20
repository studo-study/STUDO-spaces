import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  type DatabaseProvider,
  DrizzleAsyncProvider,
  drizzleProvider,
  InjectDrizzle,
} from './drizzle.provider';
import path from 'node:path';
import { migrate } from 'drizzle-orm/postgres-js/migrator'; // 👈 postgres-js in plaats van mysql2

@Module({
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(DrizzleModule.name);

  constructor(@InjectDrizzle() private readonly db: DatabaseProvider) {}

  async onModuleInit() {
    this.logger.log('⏳ Running migrations...');

    try {
      await migrate(this.db, {
        migrationsFolder: path.resolve(process.cwd(), 'migrations'),
      });
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
