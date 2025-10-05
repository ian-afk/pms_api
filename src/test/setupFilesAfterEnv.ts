import mongoose from 'mongoose';

import { initDatabase } from '../db/init';

import { beforeAll, afterAll } from '@jest/globals';
// connect database
beforeAll(async () => {
  await initDatabase();
});
// disconnect database
afterAll(async () => {
  await mongoose.disconnect();
});
