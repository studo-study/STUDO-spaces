import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';

import { createTestApp } from '../helpers/create-app';
import { loginAdmin, loginAsUser } from '../helpers/login';
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
  let server: Server;
  let userAuthToken: string;
  let adminAuthToken: string;

  const baseUrl = '/api/users';
  const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
  const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    db = app.get(DrizzleAsyncProvider);
    userService = app.get(UserService);

    await seedUsers(app, db);
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
    await clearUsers(db);

    await app.close();
  });

  describe('POST /api/users', () => {
    it('moet 201 retourneren en token voor geregistreerde gebruiker', async () => {
      const response = await request(server).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeTruthy();
    });

    it('moet 409 retourneren bij duplicate email', async () => {
      const response = await request(server).post(baseUrl).send({
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
      const response = await request(server).post(baseUrl).send({
        email: 'register@hogent.be',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('displayName');
    });

    it('moet 400 retourneren wanneer email ontbreekt', async () => {
      const response = await request(server).post(baseUrl).send({
        displayName: 'Register User',
        password: '123456789101112',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('email');
    });

    it('moet 400 retourneren wanneer password ontbreekt', async () => {
      const response = await request(server).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('password');
    });

    it('moet 400 retourneren wanneer role ontbreekt', async () => {
      const response = await request(server).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: '123456789101112',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('role');
    });

    it('moet 400 retourneren wanneer password te kort is', async () => {
      const response = await request(server).post(baseUrl).send({
        displayName: 'Register User',
        email: 'register@hogent.be',
        password: 'short',
        role: 'student',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body).toHaveProperty('password');
    });

    it('moet 400 retourneren wanneer password te lang is', async () => {
      const response = await request(server)
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
      const response = await request(server)
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
      const response = await request(server)
        .get(baseUrl)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() => request(server).get(baseUrl));
  });

  describe('GET /api/users/:user_id', () => {
    it('moet 200 retourneren en gevraagde user met sets tonen', async () => {
      const response = await request(server)
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
      const response = await request(server)
        .get(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No user with this id exists');
    });

    it('moet 403 retourneren wanneer user andere user opvraagt', async () => {
      const response = await request(server)
        .get(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() => request(server).get(`${baseUrl}/${userId1}`));
  });

  // Classrooms van een user worden nu via de classrooms-controller opgehaald.
  describe('GET /api/classrooms/user/:id', () => {
    const classroomId = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';

    it('moet 200 retourneren en alle classrooms van user tonen', async () => {
      const response = await request(server)
        .get(`/api/classrooms/user/${userId2}`)
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

      const response = await request(server)
        .get(`/api/classrooms/user/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.classrooms).toEqual([]);
    });

    it('moet 200 retourneren en specifieke classroom tonen', async () => {
      const response = await request(server)
        .get(`/api/classrooms/${classroomId}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(classroomId);
    });

    testAuthHeader(() =>
      request(server).get(`/api/classrooms/user/${userId1}`),
    );
  });

  describe('PUT /api/users/:user_id', () => {
    it('moet 200 retourneren en geüpdatete user tonen', async () => {
      const response = await request(server)
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

      const response = await request(server)
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

      const response = await request(server)
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          streakStarted: '2024-01-01',
          streakCount: 10,
          streakLastUpdate: '2024-01-10',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.streakCount).toBe(10);
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

      const response = await request(server)
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          imgUrl: 'https://example.com/new-image.png',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.imgUrl).toBe('https://example.com/new-image.png');
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
      const response = await request(server)
        .put(`${baseUrl}/${newUser!.id}`)
        .auth(newToken, { type: 'bearer' })
        .send({
          last_login: loginTime,
        });

      expect(response.statusCode).toBe(200);
    });

    it('moet 409 retourneren bij duplicate email', async () => {
      const response = await request(server)
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
      const response = await request(server)
        .put(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(adminAuthToken, { type: 'bearer' })
        .send({
          displayName: 'Test',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('User does not exist');
    });

    it('moet 403 retourneren wanneer user andere user probeert te updaten', async () => {
      const response = await request(server)
        .put(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' })
        .send({
          displayName: 'Hacked Name',
        });

      expect(response.statusCode).toBe(403);
    });

    testAuthHeader(() =>
      request(server).put(`${baseUrl}/${userId1}`).send({
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
      const response = await request(server)
        .delete(`${baseUrl}/${userId1}`)
        .auth(userAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(
        'You are not allowed to access this user',
      );
    });

    it('moet 404 retourneren bij niet-bestaande user', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/00000000-0000-0000-0000-000000000000`)
        .auth(adminAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No user with this id exists');
    });

    it('moet 204 retourneren en user verwijderen', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/${deleteUserId}`)
        .auth(deleteAuthToken, { type: 'bearer' });

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    testAuthHeader(() => request(server).delete(`${baseUrl}/${userId1}`));
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

    it('getClassmateActivity moet alleen activiteit van anderen tonen', async () => {
      const activities = await userService.getClassmateActivity(userId2);

      expect(Array.isArray(activities)).toBe(true);

      // Geen activiteit van de user zelf
      activities.forEach((activity) => {
        expect(activity.userId).not.toBe(userId2);
      });
    });

    it('getClassmateActivity moet alleen recente activiteit tonen', async () => {
      const activities = await userService.getClassmateActivity(userId2);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      activities.forEach((activity) => {
        const activityDate = new Date(activity.lastSeen);
        expect(activityDate.getTime()).toBeGreaterThanOrEqual(
          twoDaysAgo.getTime(),
        );
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
          const current = new Date(lastTen[i].lastStudied);
          const next = new Date(lastTen[i + 1].lastStudied);
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
