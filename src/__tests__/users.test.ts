import mongoose from 'mongoose';

import {
  createUser,
  deleteUser,
  emailUser,
  getUserById,
  listAllUsers,
  listUserByName,
  updateUser,
} from '../services/userService';
import { User } from '../db/models/users';

import { describe, test, expect, beforeEach } from '@jest/globals';

type CreatedUserT = {
  _id: string;
  email: string;
  name: string;
  username: string;
  password: string;
  passwordConfirm?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
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

const sampleUser = [
  {
    email: 'ianrosa@email.com',
    name: 'ian rosa',
    username: 'ianrosa1',
    password: 'testpass',
    passwordConfirm: 'testpass',
    photo: 'test.png',
  },
  {
    email: 'lecrosa@email.com',
    name: 'lec rosa',
    username: 'lecrosa',
    password: 'testpass',
    passwordConfirm: 'testpass',
    photo: 'test.png',
  },
];

let createdSampleUser: CreatedUserT[] = [];

beforeEach(async () => {
  await User.deleteMany({});
  createdSampleUser = [];
  for (const user of sampleUser) {
    const createdUser = await new User(user).save();

    const fuser: CreatedUserT = {
      ...(createdUser.toObject() as any),
      _id: createdUser._id.toString(),
    };
    createdSampleUser.push(fuser);
  }
});

describe('listing users', () => {
  test('should return all users', async () => {
    const user = await listAllUsers();
    expect(user.length).toEqual(createdSampleUser.length);
  });
  test('should return sorted user by creation date descending by default', async () => {
    const user = await listAllUsers();
    const sortedSampleUsers = createdSampleUser.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    expect(
      user.map((user: { createdAt: Date }) => user.createdAt.getTime()),
    ).toEqual(sortedSampleUsers.map((user) => user.createdAt.getTime()));
  });
  test('should take into account provided sorting options', async () => {
    const user = await listAllUsers({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    });
    const sortedSampleUsers = createdSampleUser.sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    );
    expect(
      user.map((user: { updatedAt: Date }) => user.updatedAt.getTime()),
    ).toEqual(sortedSampleUsers.map((user) => user.updatedAt.getTime()));
  });
  test('should filter user by name', async () => {
    const user = await listUserByName('ian rosa');
    expect(user.length).toBe(1);
  });
  test('should filter user by email', async () => {
    const user = await emailUser('ianrosa@email.com');
    expect(user.length).toBe(1);
  });
});

describe('getting a user', () => {
  test('should return the full user', async () => {
    const user = await getUserById(createdSampleUser[0]._id.toString());
    expect({
      ...user,
      _id: user?._id.toString(), // normalize ObjectId
    }).toEqual(createdSampleUser[0]);
  });

  test('should fail if the id does not exist', async () => {
    const user = await getUserById('000000000000000000000000');

    expect(user).toEqual(null);
  });

  describe('updating user', () => {
    test('should update the specified property', async () => {
      await updateUser(createdSampleUser[0]._id, {
        photo: 'test2.png',
        name: 'im new now',
      });

      const updatedUser = await User.findById(createdSampleUser[0]._id);
      expect(updatedUser?.name).toEqual('im new now');
    });
    test('should fail if the id does not exists', async () => {
      const user = await updateUser('000000000000000000000000', {
        photo: 'test2.png',
        name: 'test',
      });
      expect(user).toEqual(null);
    });
  });
});

describe('deleting user', () => {
  test('should delete user', async () => {
    const result = deleteUser(createdSampleUser[0]._id);

    expect((await result).deletedCount).toEqual(1);
    const deletedUser = await User.findById(createdSampleUser[0]._id);
    expect(deletedUser).toEqual(null);
  });
  test('should fail if the id does not exists', async () => {
    const result = await deleteUser('000000000000000000000000');
    expect(result.deletedCount).toEqual(0);
  });
});
