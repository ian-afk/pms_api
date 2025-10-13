import mongoose from 'mongoose';

import {
  createUser,
  deleteUser,
  emailUser,
  findUserById,
  listAllUsers,
  listUserByName,
  updateUser,
} from '../services/userService';
import { User } from '../db/models/users';

import { describe, test, expect, beforeEach } from '@jest/globals';
import { Rights } from '../utils/common';
import { createRole } from '../services/roleService';
import { Role } from '../db/models/roles';

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

beforeEach(async () => {
  await User.deleteMany();
  await Role.deleteMany();
});
describe('creating users', () => {
  test('with all parameters should succeed', async () => {
    const role = {
      role: 'Staff',
      description: 'Staff level only can view and limited access',
      rights: [Rights.COMMENTS.GET_ALL, Rights.COMMENTS.GET_DETAILS],
    };

    const createdRole = await Role.create(role);
    const user = {
      email: 'test@email.com',
      name: 'ian rosa',
      username: 'test',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'testphoto.png',
    };

    const createdUser = await createUser({ ...user, role: createdRole._id });

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
  test('without required fields should fail', async () => {
    const role = {
      role: 'Admin',
      description: 'Staff level only can view and limited access',
      rights: [Rights.COMMENTS.GET_ALL, Rights.COMMENTS.GET_DETAILS],
    };

    const createdRole = await createRole(role);

    const user = {
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'testphoto.png',
      role: createdRole._id,
    } as any;

    try {
      await createUser(user);
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.message);
    }
  });
  test('with invalid email should fail', async () => {
    const role = {
      role: 'Super Admin',
      description: 'Staff level only can view and limited access',
      rights: [Rights.COMMENTS.GET_ALL, Rights.COMMENTS.GET_DETAILS],
    };

    const createdRole = await createRole(role);
    const user = {
      email: 'test',
      name: 'ian rosa',
      username: 'ianrosa',
      password: 'testpass',
      passwordConfirm: 'testpass',
      role: createdRole._id,
    } as any;
    try {
      await createUser(user);
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.message);
    }
  });
});

const sampleUser = [
  {
    email: 'test1@email.com',
    name: 'ian rosa',
    username: 'test1',
    password: 'testpass',
    passwordConfirm: 'testpass',
    photo: 'test.png',
  },
  {
    email: 'test2@email.com',
    name: 'lec rosa',
    username: 'test2',
    password: 'testpass',
    passwordConfirm: 'testpass',
    photo: 'test.png',
  },
];

let createdSampleUser: CreatedUserT[] = [];

beforeEach(async () => {
  await User.deleteMany({});
  createdSampleUser = [];

  const role = {
    role: 'Visitor',
    description: 'Staff level only can view and limited access',
    rights: [Rights.COMMENTS.GET_ALL, Rights.COMMENTS.GET_DETAILS],
  };

  const createdRole = await createRole(role);
  for (const user of sampleUser) {
    const createdUser = await new User({
      ...user,
      role: createdRole._id,
    }).save();

    const fuser: CreatedUserT = {
      ...(createdUser.toObject() as any),
      _id: createdUser._id.toString(),
    };
    createdSampleUser.push(fuser);
  }
});

describe('listing users', () => {
  test('should return all users', async () => {
    const user = await listAllUsers({});
    expect(user.length).toEqual(createdSampleUser.length);
  });
  test('should return sorted user by creation date descending by default', async () => {
    const user = await listAllUsers({});
    const sortedSampleUsers = createdSampleUser.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    expect(
      user.map((user: { createdAt: Date }) => user.createdAt.getTime()),
    ).toEqual(sortedSampleUsers.map((user) => user.createdAt.getTime()));
  });
  test('should take into account provided sorting options', async () => {
    const user = await listAllUsers(
      {},
      {
        sortBy: 'updatedAt',
        sortOrder: 'ascending',
      },
    );
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
    const user = await emailUser('test1@email.com');
    expect(user.length).toBe(1);
  });
});

describe('getting a user', () => {
  test('should return the full user', async () => {
    const user = await findUserById(createdSampleUser[0]._id.toString());
    expect({
      ...user?.toObject(),
      _id: user?._id.toString(), // normalize ObjectId
    }).toEqual({
      ...createdSampleUser[0],
      password: undefined,
      passwordConfirm: undefined,
    });
  });

  test('should fail if the id does not exist', async () => {
    const user = await User.findById('000000000000000000000000');

    // expect(user).toEqual(null);
    expect(user).toBeNull();
  });
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
    expect(user).toBeNull();
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
