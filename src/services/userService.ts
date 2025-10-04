import { User } from '../db/models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface OptionType {
  sortBy: string;
  sortOrder: string;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password!');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  return token;
}

export async function createUser({
  email,
  name,
  username,
  password,
  passwordConfirm,
  photo,
}) {
  const user = new User({
    email,
    name,
    username,
    password,
    passwordConfirm,
    photo,
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
  return await User.findById(userId).lean();
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
