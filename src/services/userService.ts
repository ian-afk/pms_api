import { User } from '../db/models/users';

interface OptionType {
  sortBy: string;
  sortOrder: string;
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
