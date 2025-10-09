import { Request } from 'express';
import {
  createProject,
  getProjectById,
  getProjectByName,
  listAllProject,
  updateProject,
} from 'services/projectService';
import { catchAsync } from 'utils/catchAsync';

interface ProjectQuery {
  projName?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const addProject = catchAsync(async (req, res, next) => {
  const newProject = await createProject(req.body);

  res.status(201).json({
    status: 'success',
    newProject,
  });
});

export const getAllProject = catchAsync(async (req, res, next) => {
  const project = await listAllProject();

  res.status(200).json({
    status: 'success',
    data: project,
  });
});

export const getProjectId = catchAsync(async (req, res, next) => {
  const project = await getProjectById(req.params.id);

  res.status(200).json({
    status: 'success',
    project,
  });
});

export const getProjectName = catchAsync(
  async (req: Request<{}, {}, {}, ProjectQuery>, res, next) => {
    const { projName, sortBy, sortOrder } = req.query;

    const project = await getProjectByName(projName, { sortBy, sortOrder });

    res.status(200).json({
      status: 'success',
      project,
    });
  },
);

export const updateProjects = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const project = await updateProject(projectId, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Project updated successfully',
    project,
  });
});
