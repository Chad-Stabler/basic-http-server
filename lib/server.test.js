import request from 'supertest';
import { serve } from './server.js';

describe('The TCP server', () => {
  let server = null;

  beforeEach(() => {
    // Deliberately omit the port so we get an available one.
    server = serve('localhost', undefined);
  });

  afterEach(() => {
    server.close();
  });

  // This test will fail initially since the project doesn't start with a
  // working HTTP server.
  it('connects on the default port', async () => {
    await request(server)
      .get('/')
      .expect(200);
  });

  it('GET / should return small blog page', async () => {
    await request(server)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'text/html');
  });

  it('GEt /posts should return JSON', async () => {
    await request(server)
    .get('/posts')
    .expect(200)
    .expect('Content-Type', 'application/json');
  });

  it('POST /mail should return 204 No Content', async () => {
    await request(server)
    .post('/mail')
    .expect(204)
    .expect('Content-Type', 'application/json');
  });

  it('receives a 404 when requesting an unknown resource/method', async () => {
    await request(server)
      .put('/fictitious')
      .expect(404);
  });
});
