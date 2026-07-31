import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';

import { createTestApp } from '../helpers/create-app';
import {
  DatabaseProvider,
  DrizzleAsyncProvider,
} from '../../src/drizzle/drizzle.provider';
import { seedStudysets, clearStudysets } from '../seeds/studysets';
import { seedSetlikes, clearSetlikes } from '../seeds/setlikes';
import { seedStudysessions, clearStudysessions } from '../seeds/studysessions';
import { clearSessioncards, seedSessioncards } from '../seeds/sessioncards';
import { login, loginAdmin } from '../helpers/login';
import { clearUsers, seedUsers } from '../seeds/users';
import { clearProfiles, seedProfiles } from '../seeds/profiles';
import { clearCards, seedCards } from '../seeds/cards';

describe('Studysets', () => {
  let app: INestApplication;
  let db: DatabaseProvider;
  let server: Server;
  let authToken: string; // paulallen@example.com - userId2
  let adminToken: string; // charles@test.com - userId1 (admin)

  const baseUrl = '/api/studysets';

  // studySetId1 belongs to userId1 (admin/charles)
  // studySetId2 belongs to userId2 (user/paulallen)
  const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
  const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb'; // paulallen (user)
  // sessionId1 belongs to userId1 (charles) and studySetId1
  const sessionId1 = 'f64a9f4c-53a5-4ce5-8c1a-86b3e4b26c8b';

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    db = app.get(DrizzleAsyncProvider);

    // Clear in reverse order of dependencies
    await clearSessioncards(db);
    await clearStudysessions(db);
    await clearSetlikes(db);
    await clearCards(db);
    await clearStudysets(db);
    await clearProfiles(db);
    await clearUsers(db);

    // Seed in correct order
    await seedUsers(app, db);
    await seedProfiles(db);
    await seedStudysets(db);
    await seedStudysessions(db);
    await seedCards(db);
    await seedSetlikes(db);
    await seedSessioncards(db);

    // Login - authToken is paulallen (user), adminToken is charles (admin)
    authToken = await login(app);
    adminToken = await loginAdmin(app);
  });

  afterAll(async () => {
    // Clear in reverse order
    await clearSessioncards(db);
    await clearStudysessions(db);
    await clearSetlikes(db);
    await clearCards(db);
    await clearStudysets(db);
    await clearProfiles(db);
    await clearUsers(db);
    await app.close();
  });

  // ============================================================
  // GET /api/studysets - Get all studosets (admin only)
  // ============================================================
  describe('GET /api/studysets', () => {
    it('zou alle studosets moeten retourneren voor admin', async () => {
      const response = await request(server)
        .get(baseUrl)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sets');
      expect(Array.isArray(response.body.sets)).toBe(true);
      expect(response.body.sets.length).toBeGreaterThanOrEqual(2);
    });

    it('niet-admins zouden 403 moeten krijgen', async () => {
      await request(server)
        .get(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server).get(baseUrl).expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // GET /api/studysets/me - Get studosets of logged-in user
  // ============================================================
  describe('GET /api/studysets/me', () => {
    it('zou de studosets van de ingelogde user moeten retourneren', async () => {
      const response = await request(server)
        .get(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('sets');
      expect(response.body).toHaveProperty('visualsets');
      expect(Array.isArray(response.body.sets)).toBe(true);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server).get(`${baseUrl}/me`).expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // GET /api/studysets/:set_id - Get studoset by ID
  // ============================================================
  describe('GET /api/studysets/:set_id', () => {
    it('zou een specifieke studoset met alle details moeten retourneren', async () => {
      const response = await request(server)
        .get(`${baseUrl}/${studySetId1}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', studySetId1);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('cards');
      expect(response.body).toHaveProperty('likes');
      expect(response.body).toHaveProperty('session');
      expect(response.body).toHaveProperty('classrooms');
      expect(Array.isArray(response.body.cards)).toBe(true);
    });

    it('zou 404 moeten retourneren voor een niet-bestaande studoset', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(server)
        .get(`${baseUrl}/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('zou UUID format moeten valideren', async () => {
      const response = await request(server)
        .get(`${baseUrl}/invalid-uuid`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .get(`${baseUrl}/${studySetId1}`)
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // GET /api/studysessions/:session_id - Get studysession by ID
  // ============================================================
  describe('GET /api/studysessions/:session_id', () => {
    it('zou een specifieke studysession moeten retourneren', async () => {
      const response = await request(server)
        .get(`/api/studysessions/${sessionId1}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', sessionId1);
      expect(response.body).toHaveProperty('setId', studySetId1);
      expect(response.body).toHaveProperty('cards');
      expect(Array.isArray(response.body.cards)).toBe(true);
    });

    it('zou 404 moeten retourneren voor een niet-bestaande session', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(server)
        .get(`/api/studysessions/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('zou UUID format moeten valideren', async () => {
      await request(server)
        .get('/api/studysessions/not-a-uuid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .get(`/api/studysessions/${sessionId1}`)
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // POST /api/studysets - Create studoset
  // ============================================================
  describe('POST /api/studysets', () => {
    it('zou een nieuwe studoset moeten aanmaken', async () => {
      const newStudyset = {
        title: 'New Test Set',
        global_term_language: 'en',
        global_definition_language: 'nl',
        cardlist: [
          {
            term: 'Test Term 1',
            definition: 'Test Definition 1',
            number: 1,
          },
          {
            term: 'Test Term 2',
            definition: 'Test Definition 2',
            number: 2,
          },
        ],
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStudyset)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Test Set');
      expect(response.body).toHaveProperty('userId', userId2);
      expect(response.body).toHaveProperty('globalTermLanguage', 'en');
      expect(response.body).toHaveProperty('globalDefinitionLanguage', 'nl');
      expect(response.body.publicSet).toBe(true);

      // Cleanup - delete the created set
      if (response.body.id) {
        await request(server)
          .delete(`${baseUrl}/${response.body.id}`)
          .set('Authorization', `Bearer ${authToken}`);
      }
    });

    it('zou required fields moeten valideren', async () => {
      const invalidStudyset = {
        title: 'Incomplete Set',
        // Missing: global_term_language, global_definition_language, cardlist
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudyset)
        .expect(400);

      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toHaveProperty('body');
    });

    it('zou lege cardlist moeten rejecten', async () => {
      const invalidStudyset = {
        title: 'Test Set',
        global_term_language: 'en',
        global_definition_language: 'nl',
        cardlist: [],
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidStudyset)
        .expect(400);

      expect(response.body).toHaveProperty('details');
    });

    it('zou unknown fields moeten rejecten', async () => {
      const studysetWithUnknownField = {
        title: 'Test Set',
        global_term_language: 'en',
        global_definition_language: 'nl',
        unknownField: 'should be rejected',
        cardlist: [
          {
            term: 'Test',
            definition: 'Test',
            number: 1,
          },
        ],
      };

      await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(studysetWithUnknownField)
        .expect(400);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server).post(baseUrl).send({}).expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // POST /api/studysets/:set_id/likes - Like a studoset
  // ============================================================
  describe('POST /api/studysets/:set_id/likes', () => {
    it('zou een studoset moeten kunnen liken', async () => {
      const response = await request(server)
        .post(`${baseUrl}/${studySetId1}/likes`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('setId', studySetId1);
      expect(response.body).toHaveProperty('userId', userId2);
      expect(response.body).toHaveProperty('setType', 'studyset');
      expect(response.body).toHaveProperty('createdAt');

      // Cleanup - remove the like
      await request(server)
        .delete(`${baseUrl}/${studySetId1}/likes`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .post(`${baseUrl}/${studySetId1}/likes`)
        .send({ set_id: studySetId1 })
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // DELETE /api/studysets/:set_id/likes - Remove like from studoset
  // ============================================================
  describe('DELETE /api/studysets/:set_id/likes', () => {
    it('zou een like moeten kunnen verwijderen', async () => {
      // First like the set
      await request(server)
        .post(`${baseUrl}/${studySetId1}/likes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ set_id: studySetId1 })
        .expect(201);

      // Then remove the like
      await request(server)
        .delete(`${baseUrl}/${studySetId1}/likes`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });

    it('zou 404 moeten retourneren als like niet bestaat', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(server)
        .delete(`${baseUrl}/${fakeId}/likes`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/${studySetId1}/likes`)
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // PUT /api/studysets/:set_id - Update studoset
  // ============================================================
  describe('PUT /api/studysets/:set_id', () => {
    it('zou een studoset moeten kunnen updaten (owner)', async () => {
      const updateDto = {
        title: 'Updated Title',
        global_term_language: 'nl',
        global_definition_language: 'de',
        public_set: true,
      };

      const response = await request(server)
        .put(`${baseUrl}/${studySetId1}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('globalTermLanguage', 'nl');
      expect(response.body).toHaveProperty('globalDefinitionLanguage', 'de');
      expect(response.body).toHaveProperty('publicSet', true);
    });

    it('zou cards binnen een studoset moeten kunnen updaten', async () => {
      // First get the set to get card IDs
      const getResponse = await request(server)
        .get(`${baseUrl}/${studySetId1}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const cardId = getResponse.body.cards[0]?.id;

      if (cardId) {
        const updateDto = {
          cards: [
            {
              id: cardId,
              term: 'Updated Term',
              definition: 'Updated Definition',
              number: 1,
            },
          ],
        };

        const response = await request(server)
          .put(`${baseUrl}/${studySetId1}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateDto)
          .expect(200);

        const updatedCard = response.body.cards.find(
          (c: any) => c.id === cardId,
        );
        expect(updatedCard).toHaveProperty('term', 'Updated Term');
        expect(updatedCard).toHaveProperty('definition', 'Updated Definition');
      }
    });

    it('zou 403 moeten retourneren bij update van studoset van andere user', async () => {
      // authToken (paulallen/userId2) tries to update studySetId1 (owned by charles/userId1)
      const updateDto = {
        title: 'Hacked Title',
      };

      await request(server)
        .put(`${baseUrl}/${studySetId1}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(403);
    });

    it('zou 404 moeten retourneren voor niet-bestaande studoset', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(server)
        .put(`${baseUrl}/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test' })
        .expect(404);
    });

    it('zou UUID format moeten valideren', async () => {
      await request(server)
        .put(`${baseUrl}/invalid-uuid`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test' })
        .expect(404);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .put(`${baseUrl}/${studySetId1}`)
        .send({ title: 'Test' })
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // DELETE /api/studysets/:set_id - Delete studoset
  // ============================================================
  describe('DELETE /api/studysets/:set_id', () => {
    it('zou een studoset moeten kunnen verwijderen (owner)', async () => {
      // Create a temporary studoset as authToken user (paulallen)
      const tempSet = {
        title: 'Temporary Set To Delete',
        global_term_language: 'en',
        global_definition_language: 'en',
        cardlist: [
          {
            term: 'Temp',
            definition: 'Temp',
            number: 1,
          },
        ],
      };

      const createResponse = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(tempSet)
        .expect(201);

      const tempSetId = createResponse.body.id;

      // Delete as the owner
      await request(server)
        .delete(`${baseUrl}/${tempSetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify it's deleted
      await request(server)
        .get(`${baseUrl}/${tempSetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('zou 404 moeten retourneren voor niet-bestaande studoset', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(server)
        .delete(`${baseUrl}/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('zou UUID format moeten valideren', async () => {
      await request(server)
        .delete(`${baseUrl}/not-a-uuid`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('zou 401 moeten retourneren zonder authenticatie', async () => {
      const response = await request(server)
        .delete(`${baseUrl}/${studySetId1}`)
        .expect(401);

      expect(response.body.message).toBe('You need to be signed in');
    });
  });

  // ============================================================
  // Edge cases
  // ============================================================
  describe('Edge cases', () => {
    it('zou special characters in title moeten kunnen handelen', async () => {
      const specialSet = {
        title: 'Test & <Special> "Characters"',
        global_term_language: 'en',
        global_definition_language: 'nl',
        cardlist: [
          {
            term: 'Test',
            definition: 'Test',
            number: 1,
          },
        ],
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(specialSet)
        .expect(201);

      expect(response.body.title).toBe(specialSet.title);

      // Cleanup
      await request(server)
        .delete(`${baseUrl}/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('zou unicode in card content moeten kunnen handelen', async () => {
      const unicodeSet = {
        title: 'Unicode Test',
        global_term_language: 'en',
        global_definition_language: 'en',
        cardlist: [
          {
            term: 'Japanese',
            definition: 'Nihongo',
            number: 1,
          },
          {
            term: 'Greek',
            definition: 'Ellinika',
            number: 2,
          },
        ],
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(unicodeSet)
        .expect(201);

      const getResponse = await request(server)
        .get(`${baseUrl}/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.cards.length).toBe(2);

      // Cleanup
      await request(server)
        .delete(`${baseUrl}/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('zou card volgorde moeten behouden', async () => {
      const orderedSet = {
        title: 'Ordered Set',
        global_term_language: 'en',
        global_definition_language: 'en',
        cardlist: [
          { term: 'First', definition: 'First def', number: 1 },
          { term: 'Second', definition: 'Second def', number: 2 },
          { term: 'Third', definition: 'Third def', number: 3 },
        ],
      };

      const response = await request(server)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(orderedSet)
        .expect(201);

      const getResponse = await request(server)
        .get(`${baseUrl}/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const sortedCards = [...getResponse.body.cards].sort(
        (a: any, b: any) => a.number - b.number,
      );
      expect(sortedCards[0].term).toBe('First');
      expect(sortedCards[1].term).toBe('Second');
      expect(sortedCards[2].term).toBe('Third');

      // Cleanup
      await request(server)
        .delete(`${baseUrl}/${response.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });
  });
});
