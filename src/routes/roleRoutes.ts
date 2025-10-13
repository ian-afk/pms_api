import {
  createRole,
  deleteRoles,
  getRoles,
  getRoleById,
  updateRoles,
} from '../controllers/roleController';
import { Router } from 'express';

const router = Router();

router.route('/').get(getRoles).post(createRole);

router.route('/:id').get(getRoleById).patch(updateRoles).delete(deleteRoles);
export default router;
