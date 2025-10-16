import { catchAsync } from '../utils/catchAsync';
import {
  createTask as createTaskService,
  findTaskById,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from '../services/taskService';
import { listAllProject } from '../services/projectService';

export const createTask = catchAsync(async (req, res) => {
  const newTask = await createTaskService(req.body);

  res.status(201).json({
    status: 'success',
    newTask,
  });
});

export const getTasks = catchAsync(async (req, res) => {
  const { sortBy, sortOrder } = req.query as {
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
  };

  const task = await listAllProject(req.query, { sortBy, sortOrder });

  res.status(200).json({
    status: 'success',
    data: task,
  });
});

export const getTaskById = catchAsync(async (req, res) => {
  const task = await findTaskById(req.params.id);

  res.status(200).json({
    status: 'success',
    task,
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const task = await updateTaskService(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Task updated successfully',
    task,
  });
});

export const deleteTask = catchAsync(async (req, res) => {
  const taskId = req.params.id;
  await deleteTaskService(taskId);

  res.status(200).json({
    status: 'success',
    message: 'Task deleted successfully',
  });
});
