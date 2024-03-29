import { SetupServer } from '@src/server';
import supertest from 'supertest';

const server = new SetupServer();

beforeAll(async () => {
  const server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
})
