import { User } from '../db/models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { Types } from 'mongoose';

import { OptionType } from '../types/commonType';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '5m',
  });
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password!', 400);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password!', 400);
  }

  const token = signToken(user._id.toString());

  return token;
}

export async function signupUser({
  name,
  username,
  email,
  password,
  passwordConfirm,
}) {
  const newUser = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirm,
  });

  const token = signToken(newUser._id.toString());
  return { token, user: { ...newUser.toObject(), password: undefined } };
}
export async function createUser({
  email,
  name,
  username,
  password,
  passwordConfirm,
  photo,
  role,
}) {
  const user = new User({
    email,
    name,
    username,
    password,
    passwordConfirm,
    photo,
    role,
  });

  return await user.save();
}

async function listUsers(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const order = sortOrder === 'descending' ? -1 : 1;
  return await User.find(query).sort({ [sortBy]: order });
}

export async function listAllUsers(options?: OptionType) {
  return await listUsers({}, options);
}

export async function listUserByName(name: string, options?: OptionType) {
  return await listUsers({ name }, options);
}

export async function emailUser(email: string) {
  return await listUsers({ email });
}

export async function getUserById(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid userId', 400);
  }

  const user = await User.findById({ _id: userId });
  if (!user) throw new AppError(`User ID doesn't exists`, 404);
  return user;
}

export async function updateUser(userId: string, { name, photo }) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
    },
    { $set: { name, photo } },
    { new: true },
  );
}

export async function deleteUser(userId: string) {
  return await User.deleteOne({ _id: userId });
}
