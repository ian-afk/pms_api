import mongoose from 'mongoose';

import { createUser } from '../services/users';
import { User } from '../db/models/users';

type createdUserT = {
  _id: string;
  email: string;
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
  photo: string;
};
describe('creating users', () => {
  test('with all parameters should succeed', async () => {
    const user = {
      email: 'ian@email.com',
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'testphoto.png',
    };

    const createdUser = await createUser(user);

    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const foundUser = await User.findById(createdUser._id);

    expect(foundUser).toEqual(expect.objectContaining(user));
    expect(foundUser?.createdAt).toBeInstanceOf(Date);
    expect(foundUser?.updatedAt).toBeInstanceOf(Date);
  });
  test('without required fields should fail', async () => {
    const user = {
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'testphoto.png',
    } as any;

    try {
      await createUser(user);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
    }
  });
  test('with invalid email should fail', async () => {
    const user = {
      email: 'test',
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
    } as any;
    try {
      await createUser(user);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
    }
  });
});
