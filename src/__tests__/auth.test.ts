import { describe, test, expect, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';

import { User } from '../db/models/users';
import { createUser } from '../services/userService';

import jwt from 'jsonwebtoken';

describe('signing up user', () => {
  test('should signup', async () => {
    const user = {
      email: 'ian@email.com',
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'test.png',
    };

    const createdUser = await createUser(user);

    const token = jwt.sign({ id: createdUser._id }, 'testsecret' as string, {
      expiresIn: '5m',
    });
    const decoded = jwt.verify(token, 'testsecret' as string);

    expect(decoded).toHaveProperty('id');
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const foundUser = await User.findById(createdUser._id);

    expect(foundUser).toEqual(
      expect.objectContaining({
        ...user,
        password: undefined,
        passwordConfirm: undefined,
      }),
    );
    expect(foundUser?.createdAt).toBeInstanceOf(Date);
    expect(foundUser?.updatedAt).toBeInstanceOf(Date);
  });
  test('should fail invalid email', async () => {
    const user = {
      email: 'xemail',
      name: 'test name',
      username: 'testname',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'test.png',
    };

    try {
      await createUser(user);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
    }
  });
  test('should fail without required fields', async () => {
    const user = {
      name: 'test name',
      username: 'testname',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'test.png',
    } as any;

    try {
      await createUser(user);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
    }
  });
});
