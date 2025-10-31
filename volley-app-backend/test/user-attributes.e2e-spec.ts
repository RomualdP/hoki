import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'http';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface UserAttributeResponse {
  id: string;
  userId: string;
  attribute: string;
  value: number;
  notes?: string;
  assessedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

describe('User Attributes (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    server = app.getHttpServer() as Server;
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    // Créer un admin
    const admin = await databaseService.user.create({
      data: {
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        password: 'hashedPassword',
        role: 'ADMIN',
      },
    });
    adminId = admin.id;

    // Créer les attributs pour l'admin
    await databaseService.userAttribute.createMany({
      data: [
        { userId: adminId, attribute: 'FITNESS', value: 1.0 },
        { userId: adminId, attribute: 'LEADERSHIP', value: 1.0 },
      ],
    });

    // Créer un user normal
    const user = await databaseService.user.create({
      data: {
        email: 'user@test.com',
        firstName: 'Normal',
        lastName: 'User',
        password: 'hashedPassword',
        role: 'USER',
      },
    });
    userId = user.id;

    // Créer les attributs pour le user
    await databaseService.userAttribute.createMany({
      data: [
        { userId: userId, attribute: 'FITNESS', value: 1.0 },
        { userId: userId, attribute: 'LEADERSHIP', value: 1.0 },
      ],
    });

    // Simuler la connexion admin (dans un vrai test, passer par /auth/login)
    adminToken = 'fake-admin-token';
    userToken = 'fake-user-token';
  });

  afterAll(async () => {
    // Nettoyage
    await databaseService.userAttribute.deleteMany({
      where: { userId: { in: [adminId, userId] } },
    });
    await databaseService.user.deleteMany({
      where: { id: { in: [adminId, userId] } },
    });
    await app.close();
  });

  describe('GET /users/:id/attributes', () => {
    it('should return user attributes for authenticated user', async () => {
      const response = await request(server)
        .get(`/users/${userId}/attributes`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      const body = response.body as ApiResponse<UserAttributeResponse[]>;
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(body.data[0]).toHaveProperty('attribute');
      expect(body.data[0]).toHaveProperty('value');
    });

    it('should return 401 without authentication', async () => {
      await request(server).get(`/users/${userId}/attributes`).expect(401);
    });
  });

  describe('PATCH /users/:id/attributes', () => {
    it('should allow admin to update user attributes', async () => {
      const updateDto = {
        fitness: 1.5,
        leadership: 1.2,
        notes: 'Test update',
      };

      const response = await request(server)
        .patch(`/users/${userId}/attributes`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');

      const updatedAttributes = await databaseService.userAttribute.findMany({
        where: { userId },
      });

      const fitnessAttr = updatedAttributes.find(
        (a) => a.attribute === 'FITNESS',
      );
      const leadershipAttr = updatedAttributes.find(
        (a) => a.attribute === 'LEADERSHIP',
      );

      expect(fitnessAttr?.value).toBe(1.5);
      expect(leadershipAttr?.value).toBe(1.2);
      expect(fitnessAttr?.notes).toBe('Test update');
      expect(fitnessAttr?.assessedBy).toBe(adminId);
    });

    it('should reject update from non-admin user', async () => {
      const updateDto = {
        fitness: 1.8,
      };

      await request(server)
        .patch(`/users/${userId}/attributes`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateDto)
        .expect(403); // Forbidden
    });

    it('should validate attribute values (min/max)', async () => {
      const invalidDto = {
        fitness: 3.0, // > 2.0
      };

      await request(server)
        .patch(`/users/${userId}/attributes`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidDto)
        .expect(400); // Bad Request
    });

    it('should allow partial updates (only fitness)', async () => {
      const updateDto = {
        fitness: 0.8,
      };

      const response = await request(server)
        .patch(`/users/${userId}/attributes`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);

      const fitnessAttr = await databaseService.userAttribute.findUnique({
        where: {
          userId_attribute: {
            userId,
            attribute: 'FITNESS',
          },
        },
      });

      expect(fitnessAttr?.value).toBe(0.8);
    });

    it('should return 404 for non-existent user', async () => {
      const updateDto = {
        fitness: 1.0,
      };

      await request(server)
        .patch('/users/non-existent-id/attributes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateDto)
        .expect(404);
    });
  });
});
