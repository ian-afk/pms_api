import type { OptionType } from '../types/commonType';
import { Project } from '../db/models/project';
import { AppError } from '../utils/AppError';

export async function createProject({
  name,
  description,
  user,
  startTime,
  endTime,
  status,
}) {
  const newProject = new Project({
    name,
    description,
    user,
    startTime,
    endTime,
    status,
  });

  return await newProject.save();
}

export async function listProject(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'desc' } = {},
) {
  const order = sortOrder === 'desc' ? -1 : 1;

  const sortField = sortBy || 'createdAt';

  const filter: Record<string, any> = {};

  for (const key in query) {
    if (key !== 'sortBy' && key !== 'sortOrder') {
      filter[key] = { $regex: query[key], $options: 'i' };
    }
  }

  const project = await Project.find(filter).sort({ [sortField]: order });
  return project;
}

export async function listAllProject(query, options?: OptionType) {
  return await listProject(query, options);
}

export async function findProjectById(projectId: string) {
  const project = await Project.findById({ _id: projectId }).lean();

  if (!project)
    throw new AppError(`Project ID ${projectId} doesn't exists`, 404);

  return project;
}
export async function getProjectByName(name: string, options?: OptionType) {
  return await listProject({ name }, options);
}

type UpdateProjectT = {
  name?: string;
  description?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  user?: string;
};
export async function updateProject(
  projectId: string,
  { name, description, status, startTime, endTime, user }: UpdateProjectT,
) {
  const columnUpdate = Object.fromEntries(
    Object.entries({
      name,
      description,
      status,
      startTime,
      endTime,
      user,
    }).filter(([, v]) => v !== undefined),
  );

  return await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $set: columnUpdate,
    },
    { new: true },
  );
}
export async function deleteProject(projectId: string) {
  return await Project.deleteOne({
    _id: projectId,
  });
}
