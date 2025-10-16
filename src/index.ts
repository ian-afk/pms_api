import { app } from './app';
import { initDatabase } from './db/init';
import dotenv from 'dotenv';

dotenv.config();

void (async () => {
  try {
    await initDatabase();
    const PORT = process.env.PORT;
    app.listen(PORT, () =>
      console.info(`express server running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error('errors connecting to database:', err);
    process.exit(1);
  }
})();
