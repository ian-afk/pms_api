import { Router } from 'express';
import { signin, signup } from '../controllers/authController';
import { getAllUser, getUser } from '../controllers/userController';
import { protect } from '../middlewares/protectRoute';
const router = Router();

router.route('/').get(protect, getAllUser);
router.route('/:id').get(protect, getUser);
// router.route('/me').get(getUser);

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
