import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DatabaseConfig, ServerConfig } from '../config/configuration';
import { Inject } from '@nestjs/common';
import * as tables from './schema';
import * as relations from './relations';

// relations moeten mee in het schema-object, anders kent drizzle de
// `.with`-relaties niet (query's geven dan `never` terug / falen runtime).
const schema = { ...tables, ...relations };

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ServerConfig>) => {
      const databaseConfig = configService.get<DatabaseConfig>('database')!;
      const client = postgres(databaseConfig.url, { max: 30 });
      return drizzle(client, { schema }) as PostgresJsDatabase<typeof schema>;
    },
  },
];

export const InjectDrizzle = () => Inject(DrizzleAsyncProvider);

export type DatabaseProvider = PostgresJsDatabase<typeof schema> & {
  $client: ReturnType<typeof postgres>;
};
