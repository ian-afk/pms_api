import { describe, test, expect, beforeEach } from '@jest/globals';

import {
  createRole,
  listAllRoles,
  getRoleById,
  getRoleByName,
  deleteRole,
  updateRole,
} from '../services/roleService';
import { Rights } from '../utils/common';
import mongoose from 'mongoose';
import { Role } from '../db/models/roles';

type CreatedRoleT = {
  role: string;
  description: string;
  rights: string[];
  _id: string;
};

beforeEach(async () => {
  await Role.deleteMany({}).exec();
});

describe('create role', () => {
  test('should succeed with all required parameters', async () => {
    const roleData = {
      role: 'Super Admin',
      description: 'Have all access',
      rights: [
        ...Rights.ROLES.ALL,
        ...Rights.USERS.ALL,
        ...Rights.TASKS.ALL,
        ...Rights.PROJECTS.ALL,
        ...Rights.COMMENTS.ALL,
      ],
    };

    const createdRole = await createRole(roleData);

    expect(createdRole._id).toBeInstanceOf(mongoose.Types.ObjectId);

    const foundRole = await Role.findById(createdRole._id);

    expect(foundRole).toEqual(expect.objectContaining(roleData));
  });
  test('should succeed without not required field', async () => {
    const roleData = {
      role: 'Visitor',
      rights: ['add_role'],
    } as any;

    const createdRole = await createRole(roleData);
    const roleId = createdRole._id;

    expect(roleId).toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test('should fail with missing required field', async () => {
    const roleData = {
      role: 'User',
      description: 'Have all access',
    } as any;

    try {
      await createRole(roleData);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
    }
  });
});

const sampleRole = [
  {
    role: 'Visitor',
    description: 'Only view acces',
    rights: ['get_role'],
  },
  {
    role: 'Admin',
    description: 'Have all access',
    rights: [
      ...Rights.ROLES.ALL,
      ...Rights.USERS.ALL,
      ...Rights.TASKS.ALL,
      ...Rights.PROJECTS.ALL,
      ...Rights.COMMENTS.ALL,
    ],
  },
];

let createdSampleRole: CreatedRoleT[] = [];

beforeEach(async () => {
  await Role.deleteMany({}).exec();
  const insertedRole = (await Role.insertMany(sampleRole)) as any[];

  createdSampleRole = insertedRole.map((r) => ({
    ...r.toObject(),
    _id: r._id.toString(),
  })) as CreatedRoleT[];
});

describe('listing roles', () => {
  test('should return all roles', async () => {
    const roles = await listAllRoles();

    expect(sampleRole.length).toEqual(createdSampleRole.length);
  });
});

describe('getting role', () => {
  test('should get role by name', async () => {
    const role = await getRoleByName('Admin');

    expect(role.length).toBe(1);
  });

  test('should get role by id', async () => {
    const role = await getRoleById(createdSampleRole[0]._id);
    expect(role?._id.toString()).toBe(createdSampleRole[0]._id);
  });
  test('should fail if the id does not exist', async () => {
    const role = await Role.findById('000000000000000000000000');
    expect(role).toBeNull();
  });
});

describe('updating role', () => {
  test('should update the specified property', async () => {
    await updateRole(createdSampleRole[0]._id, {
      description: 'test2',
      role: 'im new now',
    });

    const updatedRole = await Role.findById(createdSampleRole[0]._id);
    expect(updatedRole?.role).toEqual('im new now');
  });
  test('should fail if the id does not exists', async () => {
    const role = await updateRole('000000000000000000000000', {
      role: 'test',
    });
    expect(role).toBeNull();
  });
});

describe('deleting role', () => {
  test('should delete role', async () => {
    const result = deleteRole(createdSampleRole[0]._id);

    expect((await result).deletedCount).toEqual(1);
    const deletedRole = await Role.findById(createdSampleRole[0]._id);
    expect(deletedRole).toEqual(null);
  });
  test('should fail if the id does not exists', async () => {
    const result = await deleteRole('000000000000000000000000');
    expect(result.deletedCount).toEqual(0);
  });
});
