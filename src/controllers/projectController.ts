import {
  createProject as createProjectService,
  findProjectById,
  listAllProject,
  updateProject,
  deleteProject as deleteProjectService,
} from 'services/projectService';
import { catchAsync } from 'utils/catchAsync';

export const createProject = catchAsync(async (req, res) => {
  const newProject = await createProjectService(req.body);

  res.status(201).json({
    status: 'success',
    newProject,
  });
});

export const getProjects = catchAsync(async (req, res) => {
  const { sortBy, sortOrder } = req.query as {
    sortBy?: string;
    sortOrder?: string;
    [key: string]: any;
  };
  const project = await listAllProject(req.query, { sortBy, sortOrder });

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

export const getProjectId = catchAsync(async (req, res) => {
  const project = await findProjectById(req.params.id);

  res.status(200).json({
    status: 'success',
    project,
  });
});

export const updateProjects = catchAsync(async (req, res) => {
  const projectId = req.params.id;
  const project = await updateProject(projectId, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Project updated successfully',
    project,
  });
});

export const deleteProject = catchAsync(async (req, res) => {
  const projectId = req.params.id;

  await deleteProjectService(projectId);

  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully',
  });
});
