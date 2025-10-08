import mongoose, { Schema } from "mongoose";

const rolesSchema = new Schema(
  {
    role: { type: String, required: true, unique: true },
    description: String,
    rights: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model("role", rolesSchema);
