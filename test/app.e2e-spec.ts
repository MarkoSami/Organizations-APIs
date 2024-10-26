import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let token: string; // To store access token for authorization

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/signup')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
      })
      .expect(201);

    expect(response.body.message).toBeDefined();
  });

  it('should sign in a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/signin')
      .send({
        email: 'john@example.com',
        password: 'Password123',
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
    token = response.body.access_token; // Store token for later requests
  });

  it('should refresh the token', async () => {
    const response = await request(app.getHttpServer())
      .post('/refresh-token')
      .send({
        refresh_token: 'your_refresh_token_here', // Use the refresh token obtained from the sign-in
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });

  it('should create an organization', async () => {
    const response = await request(app.getHttpServer())
      .post('/organization')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Organization',
        description: 'This is my organization',
      })
      .expect(201);

    expect(response.body.organization_id).toBeDefined();
  });

  it('should read an organization', async () => {
    const organizationId = 'your_organization_id_here'; // Replace with the actual organization ID
    const response = await request(app.getHttpServer())
      .get(`/organization/${organizationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.organization_id).toBe(organizationId);
    expect(response.body.name).toBeDefined();
    expect(response.body.description).toBeDefined();
  });

  it('should read all organizations', async () => {
    const response = await request(app.getHttpServer())
      .get('/organization')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update an organization', async () => {
    const organizationId = 'your_organization_id_here'; // Replace with the actual organization ID
    const response = await request(app.getHttpServer())
      .put(`/organization/${organizationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Organization',
        description: 'Updated description',
      })
      .expect(200);

    expect(response.body.organization_id).toBe(organizationId);
    expect(response.body.name).toBe('Updated Organization');
  });

  it('should delete an organization', async () => {
    const organizationId = 'your_organization_id_here'; // Replace with the actual organization ID
    const response = await request(app.getHttpServer())
      .delete(`/organization/${organizationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBeDefined();
  });

  it('should invite a user to the organization', async () => {
    const organizationId = 'your_organization_id_here'; // Replace with the actual organization ID
    const response = await request(app.getHttpServer())
      .post(`/organization/${organizationId}/invite`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_email: 'invitee@example.com',
      })
      .expect(200);

    expect(response.body.message).toBeDefined();
  });
});
