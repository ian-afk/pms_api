import mongoose from "mongoose";

export async function initDatabase() {
  const DATABASE_URL = "mongodb://localhost:27017/pms";

  try {
    await mongoose.connect(DATABASE_URL);
    console.info("succesfully connected to database:", DATABASE_URL);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    console.error("Coult not connect to MongoDB:", error);
    process.exit(1);
  }
}
