import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';

import { createTestApp } from '../helpers/create-app';
import { login } from '../helpers/login';
import { testAuthHeader } from '../helpers/testAuthHeader';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../../src/drizzle/drizzle.provider';
import { clearUsers, seedUsers } from '../seeds/users';
import { clearProfiles, seedProfiles, PROFILES_SEED } from '../seeds/profiles';

describe('Profiles', () => {
  let app: INestApplication;
  let db: DatabaseProvider;
  let server: Server;
  let authToken: string;

  const baseUrl = '/api/profiles';

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    db = app.get(DrizzleAsyncProvider);

    await seedUsers(app, db);
    await seedProfiles(db);

    authToken = await login(app);
  });

  afterAll(async () => {
    await clearProfiles(db);
    await clearUsers(db);
    await app.close();
  });

  // GET /api/profiles/:profile_id
  describe('GET /api/profiles/:profile_id', () => {
    it('moet 200 en gevraagde profiel retourneren', async () => {
      const profileId = PROFILES_SEED[0].userId;

      const response = await request(server)
        .get(`${baseUrl}/${profileId}`)
        .auth(authToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toMatchObject({
        userId: PROFILES_SEED[0].userId,
        displayName: PROFILES_SEED[0].displayName,
      });
    });

    it('moet 404 retourneren wanneer profile niet bestaat', async () => {
      const fakeUuid = '99999999-9999-9999-9999-999999999999';

      const response = await request(server)
        .get(`${baseUrl}/${fakeUuid}`)
        .auth(authToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
    });

    testAuthHeader(() =>
      request(server).get(`${baseUrl}/${PROFILES_SEED[0].userId}`),
    );
  });

  // GET /api/profiles/public/:profile_id (geen auth vereist)
  describe('GET /api/profiles/public/:profile_id', () => {
    it('moet 200 en publiek profiel retourneren zonder authenticatie', async () => {
      const profileId = PROFILES_SEED[0].userId;

      const response = await request(server).get(
        `${baseUrl}/public/${profileId}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toMatchObject({
        userId: PROFILES_SEED[0].userId,
        displayName: PROFILES_SEED[0].displayName,
      });
    });
  });
});
