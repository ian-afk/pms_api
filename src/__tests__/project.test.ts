import { describe, test, expect, beforeEach } from '@jest/globals';
import { Role } from '../db/models/roles';
import { Rights } from '../utils/common';
import { User } from '../db/models/users';

import { Project } from '../db/models/project';

import {
  deleteProject,
  getProjectById,
  getProjectByName,
  listAllProject,
  updateProject,
} from '../services/projectService';
import mongoose from 'mongoose';

describe('creating project', () => {
  test('should succeed creating project', async () => {
    const project = {
      name: 'Test Project',
      description: 'test project',
      startTime: new Date('10-25-2020'),
      endTime: new Date('10-25-2021'),
      status: 'In progress',
    };

    const newProject = await Project.create(project);

    const foundProject = await Project.findById(newProject._id);

    expect(foundProject).toEqual(expect.objectContaining({ ...project }));
  });
  test('should succeed creating project with user', async () => {
    const role = {
      role: 'Admin',
      description: 'Test admin',
      rights: [Rights.COMMENTS.GET_DETAILS],
    };
    const newRole = await Role.create(role);
    const user = {
      email: 'testadmin@email.com',
      username: 'testadmin',
      name: 'test admin',
      password: 'testadmin',
      passwordConfirm: 'testadmin',
      photo: 'test.png',
    };
    const newUser = await User.create({ ...user, role: newRole._id });

    const project = {
      name: 'Test Project 2',
      description: 'test project',
      startTime: new Date('10-25-2020'),
      endTime: new Date('10-25-2021'),
      status: 'In progress',
    };

    const newProject = await Project.create({ ...project, user: newUser._id });

    const foundProject = await Project.findById(newProject._id);

    expect(foundProject).toEqual(expect.objectContaining({ ...project }));
  });
  test('should fail if required field is missing', async () => {
    const project = {
      description: 'test admin fail',
      startTime: new Date('10-20-2020'),
      endTime: new Date('10-20-2020'),
      status: 'New',
    };

    try {
      await Project.create(project);
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.message);
      console.log(error.message);
    }
  });
});

const sampleProject = [
  {
    name: 'test admin3',
    description: 'test admin3',
    startTime: new Date('10-20-2020'),
    endTime: new Date('10-20-2020'),
    status: 'New',
  },
  {
    name: 'test admin4',
    description: 'test admin4',
    startTime: new Date('10-20-2020'),
    endTime: new Date('10-20-2020'),
    status: 'New',
  },
];
type CreatedProjectT = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  _id: string;
};
let createdSampleProject: CreatedProjectT[] = [];

beforeEach(async () => {
  await Project.deleteMany({}).exec();
  const insertedProject = (await Project.insertMany(sampleProject)) as any[];

  createdSampleProject = insertedProject.map((p) => ({
    ...p.toObject(),
    _id: p._id.toString(),
  })) as CreatedProjectT[];
});

describe('listing project', () => {
  test('should return all project', async () => {
    const project = await listAllProject();

    expect(project.length).toEqual(createdSampleProject.length);
  });
  test('should return project by name', async () => {
    const project = await getProjectByName('test admin4');

    expect(project.length).toBe(1);
  });
  test('should return project by id', async () => {
    const project = await getProjectById(createdSampleProject[0]._id);
    expect(project?._id.toString()).toBe(createdSampleProject[0]._id);
  });
  test('should fail if the id does not exist', async () => {
    const project = await Project.findById('000000000000000000000000');
    expect(project).toBeNull();
  });
});

describe('updating project', () => {
  test('should update the specified property', async () => {
    await updateProject(createdSampleProject[0]._id, {
      description: 'test2',
      name: 'im new now',
    });

    const updatedProject = await Project.findById(createdSampleProject[0]._id);
    expect(updatedProject?.name).toEqual('im new now');
  });
  test('should fail if the id does not exists', async () => {
    const project = await updateProject('000000000000000000000000', {
      description: 'test',
    });
    expect(project).toBeNull();
  });
});

describe('deleting project', () => {
  test('should delete project', async () => {
    const result = deleteProject(createdSampleProject[0]._id);

    expect((await result).deletedCount).toEqual(1);
    const deletedProject = await Role.findById(createdSampleProject[0]._id);
    expect(deletedProject).toEqual(null);
  });
  test('should fail if the id does not exists', async () => {
    const result = await deleteProject('000000000000000000000000');
    expect(result.deletedCount).toEqual(0);
  });
});
