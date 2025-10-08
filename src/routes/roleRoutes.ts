import {
  createRoles,
  deleteRoles,
  getAllRoles,
  getRole,
  getRolesByName,
  updateRoles,
} from '../controllers/roleController';
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllRoles).post(createRoles);

router.route('/:id').get(getRole).patch(updateRoles).delete(deleteRoles);
router.route('/:name').get(getRolesByName);
export default router;
