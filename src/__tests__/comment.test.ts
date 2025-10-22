import { describe, test, expect, beforeEach } from '@jest/globals';

import { Comment } from '../db/models/comment';
import { Role } from '../db/models/roles';
import { createUser } from '../services/userService';
import { createTask } from '../services/taskService';
import {
  createComment,
  deleteComment,
  listAllComment,
  updateComment,
} from '../services/commentService';
import mongoose from 'mongoose';
import { Task } from '../db/models/task';

beforeEach(async () => {
  await Comment.deleteMany({});
  await Role.deleteMany({});
  await Task.deleteMany({});
});

describe('creating comment', () => {
  test('should succeed creating comment with all parameters', async () => {
    const role = {
      role: 'Staff',
      description: 'Staff level only can view and limited access',
      rights: ['get_all_comments'],
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

    const newUser = await createUser({ ...user, role: createdRole._id });
    const task = {
      task: 'Task og',
      description: 'Task 1 project',
      estStartTime: new Date('10-13-2025'),
      estEndTime: new Date('10-25-2025'),
      priority: 'Low',
      status: 'New',
      suppFiles: 'test.docs',
    };

    const newTask = await createTask({
      ...task,
      user: newUser._id.toString(),
    });

    const comment = {
      comment: 'test comment',
      suppFiles: ['testfiles'],
      task: newTask._id.toString(),
      user: newUser._id.toString(),
    };

    const newComment = await createComment(comment);

    expect(newComment._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test('should succeed with partial parameters', async () => {
    const role = {
      role: 'Staff',
      description: 'Staff level only can view and limited access',
      rights: ['get_all_comments'],
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

    const newUser = await createUser({ ...user, role: createdRole._id });
    const task = {
      task: 'Task og',
      description: 'Task 1 project',
      estStartTime: new Date('10-13-2025'),
      estEndTime: new Date('10-25-2025'),
      priority: 'Low',
      status: 'New',
      suppFiles: 'test.docs',
    };

    const newTask = await createTask({
      ...task,
      user: newUser._id.toString(),
    });
    const comment = {
      comment: 'test comment',
    };

    const newComment = await Comment.create({
      ...comment,
      user: newUser._id,
      task: newTask._id,
    });

    expect(newComment._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
  test('should fail if missing required fields', async () => {
    const comment = {
      comment: 'test comment',
    };

    try {
      await Comment.create(comment);
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.message);
    }
  });
});

const sampleComment = [
  {
    comment: 'test comment 1',
    description: 'test comment 2',
    suppFiles: ['testfile'],
    estStartTime: new Date('10-25-2025'),
    estEndTime: new Date('10-25-2025'),
  },
  {
    comment: 'test comment 2',
    description: 'test comment 2',
    suppFiles: ['testfile'],
    estStartTime: new Date('10-26-2025'),
    estEndTime: new Date('10-26-2025'),
  },
];

type CreatedCommentT = {
  comment: string;
  description: string;
  suppFiles: string[];
  estStartTime: Date;
  estEndTime: Date;
  _id: string;
};

let createdSampleComment: CreatedCommentT[] = [];

beforeEach(async () => {
  await Comment.deleteMany({}).exec();

  const role = {
    role: 'Visitor',
    description: 'Visitor level only can view and limited access',
    rights: ['get_all_comments'],
  };

  const createdRole = await Role.create(role);
  const user = {
    email: 'test2@email.com',
    name: 'ian rosa',
    username: 'testcomment',
    password: 'testpass',
    passwordConfirm: 'testpass',
    photo: 'testphoto.png',
  };

  const newUser = await createUser({ ...user, role: createdRole._id });
  const task = {
    task: 'Task return comment',
    description: 'Task 1 project',
    estStartTime: new Date('10-13-2025'),
    estEndTime: new Date('10-25-2025'),
    priority: 'Low',
    status: 'New',
    suppFiles: 'test.docs',
  };

  const newTask = await createTask({
    ...task,
    user: newUser._id.toString(),
  });
  createdSampleComment = [];
  for (const comment of sampleComment) {
    const createdComment = await new Comment({
      ...comment,
      user: newUser._id,
      task: newTask._id,
    }).save();

    const fcomment: CreatedCommentT = {
      ...(createdComment.toObject() as any),
      _id: createdComment._id.toString(),
    };
    createdSampleComment.push(fcomment);
  }
});

describe('listing comments', () => {
  test('should return all comment', async () => {
    const comment = await listAllComment({});

    expect(comment.length).toEqual(createdSampleComment.length);
  });
  test('should fail if the id does not exist', async () => {
    const comment = await Comment.findById('000000000000000000000000');

    expect(comment).toBeNull();
  });
});

describe('updating comment', () => {
  test('should update the specified property', async () => {
    await updateComment(createdSampleComment[0]._id, {
      comment: 'test now',
    });

    const updatedComment = await Comment.findById(createdSampleComment[0]._id);
    expect(updatedComment?.comment).toEqual('test now');
  });
  test('should fail if the id does not exists', async () => {
    const comment = await updateComment('000000000000000000000000', {
      comment: 'test new',
    });
    expect(comment).toBeNull();
  });
});

describe('deleting comment', () => {
  test('should delete comment', async () => {
    const result = deleteComment(createdSampleComment[0]._id);

    expect((await result).deletedCount).toEqual(1);
    const deletedComment = await Comment.findById(createdSampleComment[0]._id);
    expect(deletedComment).toEqual(null);
  });
  test('should fail if the id does not exists', async () => {
    const result = await deleteComment('000000000000000000000000');
    expect(result.deletedCount).toEqual(0);
  });
});
