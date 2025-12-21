import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../helpers/create-app';
import { login, loginAdmin } from '../helpers/login';
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
  let authToken: string;
  let adminToken: string;

  const baseUrl = '/api/profiles';

  beforeAll(async () => {
    app = await createTestApp();
    db = app.get(DrizzleAsyncProvider);

    await seedUsers(app, db);
    await seedProfiles(db);

    // Login
    authToken = await login(app);
    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearProfiles(db);
    await clearUsers(db);
    await app.close();
  });

  // GET /api/profiles (Admin only)
  describe('GET /api/profiles', () => {
    it('moet 200 retourneren en alle profielen tonen (enkel vr admins)', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(adminToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.profiles).toBeDefined();
      expect(response.body.profiles.length).toBeGreaterThan(0);
      expect(response.body.profiles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: PROFILES_SEED[0].user_id,
            displayName: PROFILES_SEED[0].displayName,
          }),
        ]),
      );
    });

    it('moet 403 retourneren wanneer normale gebruiker oprvaagt', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(authToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(baseUrl));
  });

  // GET /api/profiles/:profile_id
  describe('GET /api/profiles/:profile_id', () => {
    it('moet 200 en gevraagde profiel retourneren', async () => {
      const profileId = PROFILES_SEED[0].user_id;

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${profileId}`)
        .auth(authToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.profile).toMatchObject({
        user_id: PROFILES_SEED[0].user_id,
        displayName: PROFILES_SEED[0].displayName,
      });
    });

    it('moet  404 retourneren wanneer profile niet bestaat', async () => {
      const fakeUuid = '99999999-9999-9999-9999-999999999999';

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${fakeUuid}`)
        .auth(authToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(
        `${baseUrl}/${PROFILES_SEED[0].user_id}`,
      ),
    );
  });
});
