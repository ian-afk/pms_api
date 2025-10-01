import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    name: { type: String, required: [true, 'Please provide name'] },
    username: {
      type: String,
      required: [true, 'Please provide username'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
    },
    photo: String,
    // roleId: { type: String, required: Number },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('user', userSchema);
