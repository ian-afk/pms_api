import { Router } from 'express';

import {
  createProject,
  getProjectId,
  getProjects,
  updateProjects,
} from '../controllers/projectController';
import { deleteProject } from 'services/projectService';

const router = Router();

router.route('/').get(getProjects).post(createProject);

router
  .route('/:id')
  .get(getProjectId)
  .patch(updateProjects)
  .delete(deleteProject);
export default router;
