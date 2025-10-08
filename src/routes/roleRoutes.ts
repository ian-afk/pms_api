import {
  createRoles,
  deleteRoles,
  getAllRoles,
  getRole,
  getRoleByName,
  updateRoles,
} from '../controllers/roleController';
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllRoles).post(createRoles);

router.route('/:id').get(getRole).patch(updateRoles).delete(deleteRoles);
router.route('/:name').get(getRoleByName);
export default router;
