import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '../helpers/create-app';
import { login, loginAdmin, loginAsUser } from '../helpers/login';
import { testAuthHeader } from '../helpers/testAuthHeader';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../../src/drizzle/drizzle.provider';
import { clearUsers, seedUsers } from '../seeds/users';
import { AuthService } from '../../src/auth/auth.service';
import { eq } from 'drizzle-orm';
import { users } from '../../src/drizzle/schema';
import { clearStudysets, seedStudysets } from '../seeds/studysets';
import { clearFolders, seedFolders } from '../seeds/folders';
import { clearCards, seedCards } from '../seeds/cards';
import { clearStudysessions, seedStudysessions } from '../seeds/studysessions';
import { clearSessioncards, seedSessioncards } from '../seeds/sessioncards';
import { clearClassrooms, seedClassrooms } from '../seeds/classrooms';
import { clearClassroomusers, classroomUsers } from '../seeds/classroomusers';
import { clearClassroomsets, seedClassroomsets } from '../seeds/classroomsets';
import {
  clearClassroomactivities,
  seedClassroomactivities,
} from '../seeds/classroomactivities';
import { clearSetlikes, seedSetlikes } from '../seeds/setlikes';
import { randomBytes } from 'node:crypto';
import { UserService } from '../../src/user/users.service';

describe('Users', () => {
  let app: INestApplication;
  let db: DatabaseProvider;
  let userService: UserService;
  let userAuthToken: string;
  let adminAuthToken: string;

  const baseUrl = '/api/users';
  const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
  const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';

  beforeAll(async () => {
    app = await createTestApp();
    db = app.get(DrizzleAsyncProvider);
    userService = app.get(UserService);

    await seedUsers(app, db);
    await seedFolders(db);
    await seedStudysets(db);
    await seedCards(db);
    await seedStudysessions(db);
    await seedSessioncards(db);
    await seedClassrooms();
    await classroomUsers();
    await seedClassroomsets();
    await seedClassroomactivities();
    await seedSetlikes(db);

    userAuthToken = await loginAsUser(app);
    adminAuthToken = await loginAdmin(app);
  });

  afterAll(async () => {
    await clearClassroomactivities(db);
    await clearClassroomsets(db);
    await clearClassroomusers(db);
    await clearClassrooms(db);
    await clearSetlikes(db);
    await clearSessioncards(db);
    await clearStudysessions(db);
    await clearCards(db);
    await clearStudysets(db);
    await clearFolders(db);
    await clearUsers(db);

    await app.close();
  });

  describe('POST /api/users', () => {
    it('moet 201 retourneren en token voor geregistreerde gebruiker', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeTruthy();
    });

    it('moet 409 retourneren bij duplicate email', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Duplicate User',
        email: 'charles@test.com',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toEqual(
        'There is already a user with this email address',
      );
    });

    it('moet 400 retourneren wanneer displayName ontbreekt', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        email: 'register@hogent.be',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('displayName');
    });

    it('moet 400 retourneren wanneer email ontbreekt', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Register User',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('email');
    });

    it('moet 400 retourneren wanneer password ontbreekt', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('password');
    });

    it('moet 400 retourneren wanneer role ontbreekt', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: '123456789101112',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('role');
    });

    it('moet 400 retourneren wanneer password te kort is', async () => {
      const response = await request(app.getHttpServer()).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: 'short',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('password');
    });

    it('moet 400 retourneren wanneer password te lang is', async () => {
      const response = await request(app.getHttpServer())
        .post(baseUrl)
        .send({
          displayName: 'Register User',
          email: 'register@hogent.be',
          password: randomBytes(65).toString('hex'),
          role: 'student',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('password');
    });
  });

  describe('GET /api/users', () => {
    it('moet 200 retourneren en alle users tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.users.length).toBeGreaterThanOrEqual(2);

      expect(response.body.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: userId1,
            displayName: 'Charles Degraeuwe',
            email: 'charles@test.com',
          }),
          expect.objectContaining({
            id: userId2,
            displayName: 'Paul Allen',
            email: 'paulallen@example.com',
          }),
        ]),
      );
    });

    it('moet 403 retourneren wanneer gewone user alle users opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(baseUrl)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() => request(app.getHttpServer()).get(baseUrl));
  });

  describe('GET /api/users/:user_id', () => {
    it('moet 200 retourneren en gevraagde user met stats tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: userId2,
        displayName: 'Paul Allen',
        email: 'paulallen@example.com',
      });
      expect(response.body).toHaveProperty('stats');
      expect(response.body).toHaveProperty('lastTen');
    });


    it('moet 404 retourneren wanneer user niet bestaat', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No user with this id exists');
    });

    it('moet 403 retourneren wanneer user andere user opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId1}`),
    );
  });

  describe('GET /api/users/:user_id/studosets', () => {
    it('moet 200 retourneren en alle studosets van user tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/studysets`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('studysets');
      expect(response.body).toHaveProperty('visualsets');
    });

    it('moet lege arrays retourneren voor user zonder sets', async () => {
      // Maak nieuwe user zonder sets
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Empty User',
        email: 'empty.sets@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'empty.sets@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${newUser!.id}/studysets`)
        .auth(newToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.studysets).toEqual([]);
      expect(response.body.visualsets).toEqual([]);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId1}/studysets`),
    );
  });

  describe('GET /api/users/:user_id/stats', () => {
    it('moet 200 retourneren en user statistieken tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/stats`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalsets');
      expect(response.body).toHaveProperty('timeLearned');
      expect(response.body).toHaveProperty('cardsLearned');
      expect(typeof response.body.totalsets).toBe('number');
      expect(typeof response.body.timeLearned).toBe('number');
      expect(typeof response.body.cardsLearned).toBe('number');
    });

    it('moet nul statistieken retourneren voor nieuwe user', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Stats User',
        email: 'stats.test@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'stats.test@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${newUser!.id}/stats`)
        .auth(newToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.totalsets).toBe(0);
      expect(response.body.timeLearned).toBe(0);
      expect(response.body.cardsLearned).toBe(0);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId1}/stats`),
    );
  });

  describe('GET /api/users/:user_id/classrooms', () => {
    it('moet 200 retourneren en alle classrooms van user tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/classrooms`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('classrooms');
      expect(Array.isArray(response.body.classrooms)).toBe(true);
    });

    it('moet lege array retourneren voor user zonder classrooms', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'No Class User',
        email: 'noclass@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'noclass@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${newUser!.id}/classrooms`)
        .auth(newToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.classrooms).toEqual([]);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId1}/classrooms`),
    );
  });

  describe('GET /api/users/:user_id/classrooms/:classroom_id', () => {
    it('moet 200 retourneren en specifieke classroom tonen', async () => {
      const classroomId = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/classrooms/${classroomId}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(classroomId);
    });

    it('moet 400 retourneren wanneer user geen lid is van classroom', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Not Member User',
        email: 'notmember@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'notmember@hogent.be'),
      });

      const classroomId = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${newUser!.id}/classrooms/${classroomId}`)
        .auth(newToken, { type: 'bearer' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('not a member');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(
        `${baseUrl}/${userId1}/classrooms/0e2b6da7-d82b-4be2-bf3e-4b320bfd497b`,
      ),
    );
  });

  describe('GET /api/users/:user_id/start', () => {
    it('moet 200 retourneren en startpagina data tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/start`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('lastTen');
      expect(response.body).toHaveProperty('courses');
      expect(response.body).toHaveProperty('class');
      expect(Array.isArray(response.body.lastTen)).toBe(true);
      expect(Array.isArray(response.body.courses)).toBe(true);
      expect(Array.isArray(response.body.class)).toBe(true);
    });

    it('moet 403 retourneren voor andere user', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}/start`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId2}/start`),
    );
  });

  describe('PUT /api/users/:user_id', () => {
    it('moet 200 retourneren en geüpdatete user tonen', async () => {
      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${userId2}`)
        .auth(userAuthToken, { type: 'bearer' })
        .send({
          displayName: 'Updated Name',
          email: 'updated@example.com',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        id: userId2,
        displayName: 'Updated Name',
        email: 'updated@example.com',
      });
    });

    it('moet password kunnen updaten', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Password User',
        email: 'password.test@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'password.test@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          password: 'newpassword123',
        });

      expect(response.statusCode).toBe(200);
    });

    it('moet streak data kunnen updaten', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Streak User',
        email: 'streak.test@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'streak.test@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          streak_started: '2024-01-01',
          streak_count: 10,
          streak_last_update: '2024-01-10',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.streak_count).toBe(10);
    });

    it('moet img_url kunnen updaten', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Image User',
        email: 'image.test@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'image.test@hogent.be'),
      });

      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          img_url: 'https://example.com/new-image.png',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.img_url).toBe('https://example.com/new-image.png');
    });

    it('moet last_login kunnen updaten', async () => {
      const authService = app.get(AuthService);
      const newToken = await authService.register({
        displayName: 'Login User',
        email: 'login.test@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'login.test@hogent.be'),
      });

      const loginTime = new Date().toISOString();
      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          last_login: loginTime,
        });

      expect(response.statusCode).toBe(200);
    });

    it('moet 409 retourneren bij duplicate email', async () => {
      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${userId2}`)
        .auth(userAuthToken, { type: 'bearer' })
        .send({
          email: 'charles@test.com',
        });

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toEqual(
        'There is already a user with this email address',
      );
    });

    it('moet 404 retourneren bij niet-bestaande user', async () => {
      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(adminAuthToken, { type: 'bearer' })
        .send({
          displayName: 'Test',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('User does not exist');
    });

    it('moet 403 retourneren wanneer user andere user probeert te updaten', async () => {
      const response = await request(app.getHttpServer())
        .put(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' })
        .send({
          displayName: 'Hacked Name',
        });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).put(`${baseUrl}/${userId1}`).send({
        displayName: 'Changed name',
      }),
    );
  });

  describe('DELETE /api/users/:user_id', () => {
    let deleteAuthToken: string;
    let deleteUserId: string;

    beforeAll(async () => {
      const authService = app.get(AuthService);
      deleteAuthToken = await authService.register({
        displayName: 'Delete User',
        email: 'delete.user@hogent.be',
        password: '12345678',
        role: 'teacher',
      });

      const deleteUser = await db.query.users.findFirst({
        where: eq(users.email, 'delete.user@hogent.be'),
      });

      deleteUserId = deleteUser!.id;
    });

    it('moet 403 retourneren wanneer user andere user probeert te verwijderen', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual('Not allowed to delete this user');
    });

    it('moet 404 retourneren bij niet-bestaande user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No user with this id exists');
    });

    it('moet 204 retourneren en user verwijderen', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${baseUrl}/${deleteUserId}`)
        .auth(deleteAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });


    testAuthHeader(() =>
      request(app.getHttpServer()).delete(`${baseUrl}/${userId1}`),
    );
  });

  describe('GET /api/users/:user_id/headers', () => {
    it('moet 200 retourneren en app_footer info tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/headers`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('displayName');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('streak_count');
      expect(response.body).toHaveProperty('pfp');
    });

    it('moet 404 retourneren wanneer andere user headers opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}/headers`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Header not found');
    });

    it('moet 200 retourneren wanneer admin headers opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}/headers`)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.displayName).toBe('Charles Degraeuwe');
    });

    it('moet 404 retourneren voor niet-bestaande user', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/00000000-0000-0000-0000-000000000000/headers`)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId2}/headers`),
    );
  });

  describe('GET /api/users/:user_id/course/:course_id', () => {
    it('moet 200 retourneren en course studosets tonen', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/course/Biology`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('studysets');
      expect(response.body).toHaveProperty('visualsets');
      expect(Array.isArray(response.body.studysets)).toBe(true);
      expect(Array.isArray(response.body.visualsets)).toBe(true);
    });

    it('moet alleen sets van opgegeven course retourneren', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/course/Math`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);

      // Alle sets moeten course "Math" hebben
      response.body.studysets.forEach((set: any) => {
        expect(set.course).toBe('Math');
      });

      response.body.visualsets.forEach((set: any) => {
        expect(set.course).toBe('Math');
      });
    });

    it('moet lege arrays retourneren voor niet-bestaande course', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId2}/course/NonExistentCourse`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.studysets).toEqual([]);
      expect(response.body.visualsets).toEqual([]);
    });

    it('moet 404 retourneren wanneer andere user course opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}/course/Biology`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Course not found');
    });

    it('moet 200 retourneren wanneer admin course opvraagt', async () => {
      const response = await request(app.getHttpServer())
        .get(`${baseUrl}/${userId1}/course/Biology`)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('studysets');
      expect(response.body).toHaveProperty('visualsets');
    });

    testAuthHeader(() =>
      request(app.getHttpServer()).get(`${baseUrl}/${userId2}/course/Biology`),
    );
  });

  describe('UserService - Additional Coverage', () => {
    it('existsById moet true retourneren voor bestaande user', async () => {
      const exists = await userService.existsById(userId1);
      expect(exists).toBe(true);
    });

    it('existsById moet false retourneren voor niet-bestaande user', async () => {
      const exists = await userService.existsById(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(exists).toBe(false);
    });

    it('hashPassword moet gehashte password retourneren', async () => {
      const hashed = await userService.hashPassword('testpassword123');
      expect(hashed).toBeTruthy();
      expect(hashed).not.toBe('testpassword123');
      expect(hashed.length).toBeGreaterThan(50);
    });

    it('getCourses moet unieke courses retourneren', async () => {
      const courses = await userService.getCourses(userId2);
      expect(Array.isArray(courses)).toBe(true);

      // Check voor duplicaten
      const uniqueCourses = [...new Set(courses)];
      expect(courses.length).toBe(uniqueCourses.length);

      // Geen lege strings
      courses.forEach(course => {
        expect(course.trim()).not.toBe('');
      });
    });

    it('getCourses moet lege array retourneren voor user zonder sets', async () => {
      const authService = app.get(AuthService);
      await authService.register({
        displayName: 'No Course User',
        email: 'nocourse@hogent.be',
        password: '12345678',
        role: 'student',
      });

      const newUser = await db.query.users.findFirst({
        where: eq(users.email, 'nocourse@hogent.be'),
      });

      const courses = await userService.getCourses(newUser!.id);
      expect(courses).toEqual([]);
    });

    it('getClassmateActivity moet alleen activiteit van anderen tonen', async () => {
      const activities = await userService.getClassmateActivity(userId2);

      expect(Array.isArray(activities)).toBe(true);

      // Geen activiteit van de user zelf
      activities.forEach(activity => {
        expect(activity.user_id).not.toBe(userId2);
      });
    });

    it('getClassmateActivity moet alleen recente activiteit tonen', async () => {
      const activities = await userService.getClassmateActivity(userId2);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      activities.forEach(activity => {
        const activityDate = new Date(activity.last_seen);
        expect(activityDate.getTime()).toBeGreaterThanOrEqual(twoDaysAgo.getTime());
      });
    });

    it('getLastTen moet maximaal 10 items retourneren', async () => {
      const lastTen = await userService.getLastTen(userId2);
      expect(lastTen.length).toBeLessThanOrEqual(10);
    });

    it('getLastTen moet gesorteerd zijn op datum (meest recent eerst)', async () => {
      const lastTen = await userService.getLastTen(userId2);

      if (lastTen.length > 1) {
        for (let i = 0; i < lastTen.length - 1; i++) {
          const current = new Date(lastTen[i].last_studied);
          const next = new Date(lastTen[i + 1].last_studied);
          expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
      }
    });

    it('getTotalStats moet correcte waardes berekenen', async () => {
      const stats = await userService.getTotalStats(userId2);

      expect(stats.totalsets).toBeGreaterThanOrEqual(0);
      expect(stats.timeLearned).toBeGreaterThanOrEqual(0);
      expect(stats.cardsLearned).toBeGreaterThanOrEqual(0);
    });
  });
});