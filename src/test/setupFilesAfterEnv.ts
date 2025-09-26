import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";

import { initDatabase } from "../db/init";

// connect database
beforeAll(async () => {
  await initDatabase();
});
// disconnect database
afterAll(async () => {
  await mongoose.disconnect();
});
