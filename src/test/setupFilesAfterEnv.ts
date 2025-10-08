import mongoose from 'mongoose';

import { initDatabase } from '../db/init';

import { beforeAll, afterAll, afterEach } from '@jest/globals';
// connect database
beforeAll(async () => {
  await initDatabase();
});
// drop database
afterEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});
// disconnect database
afterAll(async () => {
  await mongoose.disconnect();
});
