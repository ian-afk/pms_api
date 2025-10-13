import { Router } from 'express';
import { signin, signup } from '../controllers/authController';
import { getUsers, getUserById } from '../controllers/userController';
import { protect } from '../middlewares/protectRoute';
const router = Router();

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUserById);
// router.route('/me').get(getUser);

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
