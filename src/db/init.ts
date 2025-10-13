import mongoose from 'mongoose';

export async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;

  try {
    await mongoose.connect(DATABASE_URL);
    console.info('succesfully connected to database:', DATABASE_URL);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    console.error('Coult not connect to MongoDB:', error);
    process.exit(1);
  }
}
