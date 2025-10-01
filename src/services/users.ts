import { User } from '../db/models/users';

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
