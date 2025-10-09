import mongoose from 'mongoose';

import { initDatabase } from '../db/init';

import { beforeAll, afterAll, afterEach } from '@jest/globals';
// connect database
beforeAll(async () => {
  await initDatabase();
  await mongoose.connection.syncIndexes();
});
// drop database
afterEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
    await new Promise((res) => setTimeout(res, 100));
  }
});
// disconnect database
afterAll(async () => {
  await mongoose.disconnect();
});
