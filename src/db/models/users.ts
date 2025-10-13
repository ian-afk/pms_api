import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el: string) {
          return el === this.password;
        },
        message: 'Password are not the same',
      },
    },
    photo: String,
    passwordChangedAt: Date,
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'User role is required'],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
export const User = mongoose.model('User', userSchema);
