import { Task } from '../db/models/task';
import { OptionType } from '../types/commonType';
import { AppError } from '../utils/AppError';

type CreateTaskT = {
  task: string;
  description?: string;
  project?: string;
  user?: string;
  estStartTime?: Date;
  estEndTime?: Date;
  priority?: string;
  status?: string;
  suppFiles?: string;
};
export async function createTask({
  task,
  description,
  project,
  user,
  estStartTime,
  estEndTime,
  priority,
  status,
  suppFiles,
}: CreateTaskT) {
  const newTask = new Task({
    task,
    description,
    project,
    user,
    estStartTime,
    estEndTime,
    priority,
    status,
    suppFiles,
  });

  return await newTask.save();
}
export async function listTask(
  query = {},
  { sortBy = 'created', sortOrder = 'desc' } = {},
) {
  const order = sortOrder === 'desc' ? -1 : 1;

  const sortField = sortBy || 'createdAt';

  const filter: Record<string, any> = {};

  for (const key in query) {
    if (key !== 'sortBy' && key !== 'sortOrder') {
      filter[key] = { $regex: query[key], $options: 'i' };
    }
  }

  return await Task.find(filter).sort({ [sortField]: order });
}

export async function listAllTask(query, options?: OptionType) {
  return await listTask(query, options);
}

export async function findTaskById(taskId: string) {
  const task = await Task.findById({ _id: taskId }).lean();

  if (!task) throw new AppError(`Task ID ${taskId} doesn't exists`, 404);

  return task;
}

export async function getTaskByName(taskName: string, options?: OptionType) {
  const task = await listTask({ task: taskName }, options);

  return task;
}

type UpdateTaskT = {
  task?: string;
  description?: string;
  project?: string;
  user?: string;
  estStartTime?: Date;
  estEndTime?: Date;
  priority?: boolean;
  status?: string;
  suppFiles?: string;
};

export async function updateTask(
  taskId: string,
  {
    task,
    description,
    estStartTime,
    estEndTime,
    priority,
    project,
    status,
    suppFiles,
    user,
  }: UpdateTaskT,
) {
  const columnUpdate = Object.fromEntries(
    Object.entries({
      task,
      description,
      estStartTime,
      estEndTime,
      priority,
      project,
      status,
      suppFiles,
      user,
    }).filter(([, v]) => v !== undefined),
  );

  return await Task.findOneAndUpdate(
    {
      _id: taskId,
    },
    { $set: columnUpdate },
    { new: true },
  );
}

export async function deleteTask(taskId: string) {
  return await Task.deleteOne({
    _id: taskId,
  });
}
