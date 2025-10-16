import { deleteTask } from '../services/taskService';
import {
  createTask,
  getTaskById,
  getTasks,
  updateTask,
} from '../controllers/taskController';
import { Router } from 'express';

const router = Router();

router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTaskById).patch(updateTask).delete(deleteTask);

export default router;
