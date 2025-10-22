import { beforeEach, describe, expect, test } from '@jest/globals';
import { Rights } from '../utils/common';
import { Role } from '../db/models/roles';
import { Project } from '../db/models/project';
import { createUser } from '../services/userService';

import {
  createTask,
  deleteTask,
  findTaskById,
  getTaskByName,
  listAllTask,
  updateTask,
} from '../services/taskService';

import mongoose from 'mongoose';
import { Task } from '../db/models/task';
beforeEach(async () => {
  await Task.deleteMany({});
});
describe('creating roles', () => {
  test('should succeed creating role with all parameters', async () => {
    const role = {
      role: 'Staff',
      description: 'Staff level only can view and limited access',
      rights: [Rights.COMMENTS.GET_ALL, Rights.COMMENTS.GET_DETAILS],
    };

    const newRole = await Role.create(role);

    const project = {
      name: 'Test Project',
      description: 'test project',
      startTime: new Date('10-25-2020'),
      endTime: new Date('10-25-2021'),
      status: 'In progress',
    };

    const newProject = await Project.create(project);

    const user = {
      email: 'test@email.com',
      name: 'ian rosa',
      username: 'test',
      password: 'testpass',
      passwordConfirm: 'testpass',
      photo: 'testphoto.png',
    };

    const newUser = await createUser({ ...user, role: newRole._id });
    const task = {
      task: 'Task og',
      description: 'Task 1 project',
      project: '',
      user: '',
      estStartTime: new Date('10-13-2025'),
      estEndTime: new Date('10-25-2025'),
      priority: 'High',
      status: 'New',
      suppFiles: 'test.docs',
    };

    const newTask = await createTask({
      ...task,
      project: newProject._id.toString(),
      user: newUser._id.toString(),
    });

    expect(newTask._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test('should succeed with partial parameters', async () => {
    const task = {
      task: 'Task 1',
      description: 'Task 1 project',
      estStartTime: new Date('10-13-2025'),
      estEndTime: new Date('10-25-2025'),
      priority: 'Low',
    };

    const createdTask = await Task.create(task);
    expect(createdTask._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test('should fail if required field is missing', async () => {
    const task = {
      description: 'Task 1 project',
      project: '',
      user: '',
      estStartTime: new Date('10-13-2025'),
      estEndTime: new Date('10-25-2025'),
      priority: 'Low',
      status: 'New',
      suppFiles: 'test.docs',
    };

    try {
      await Task.create(task);
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.message);
    }
  });
});

const sampleTask = [
  {
    task: 'Task 1',
    description: 'Task 1 project',
    estStartTime: new Date('10-13-2025'),
    estEndTime: new Date('10-25-2025'),
    priority: 'Low',
  },
  {
    task: 'Task 2',
    description: 'Task 2 project',
    estStartTime: new Date('10-13-2025'),
    estEndTime: new Date('10-25-2025'),
    priority: 'Low',
  },
];

type CreatedTaskT = {
  task: string;
  description: string;
  estStartTime: Date;
  estEndTime: Date;
  priority: string;
  _id: string;
};

let createdSampleTask: CreatedTaskT[] = [];

beforeEach(async () => {
  await Task.deleteMany({}).exec();
  const insertedTask = await Task.insertMany(sampleTask);

  createdSampleTask = insertedTask.map((t) => ({
    ...t.toObject(),
    _id: t._id.toString(),
  })) as CreatedTaskT[];
});

describe('listing task', () => {
  test('should return all task', async () => {
    const task = await listAllTask({});

    expect(task.length).toEqual(createdSampleTask.length);
  });

  test('should return task by name', async () => {
    const task = await getTaskByName('Task 1');

    expect(task.length).toBe(1);
  });
  test('should return task by id', async () => {
    const task = await findTaskById(createdSampleTask[0]._id);
    expect(task?._id.toString()).toBe(createdSampleTask[0]._id);
  });
  test('should fail if the id does not exist', async () => {
    const task = await Task.findById('000000000000000000000000');
    expect(task).toBeNull();
  });
});

describe('updating task', () => {
  test('should update the specified property', async () => {
    await updateTask(createdSampleTask[0]._id, {
      description: 'test2',
      task: 'im new now',
    });

    const updatedTask = await Task.findById(createdSampleTask[0]._id);
    expect(updatedTask?.task).toEqual('im new now');
  });
  test('should fail if the id does not exists', async () => {
    const project = await updateTask('000000000000000000000000', {
      description: 'test',
    });
    expect(project).toBeNull();
  });
});

describe('deleting task', () => {
  test('should delete task', async () => {
    const result = deleteTask(createdSampleTask[0]._id);

    expect((await result).deletedCount).toEqual(1);
    const deletedTask = await Role.findById(createdSampleTask[0]._id);
    expect(deletedTask).toEqual(null);
  });
  test('should fail if the id does not exists', async () => {
    const result = await deleteTask('000000000000000000000000');
    expect(result.deletedCount).toEqual(0);
  });
});
