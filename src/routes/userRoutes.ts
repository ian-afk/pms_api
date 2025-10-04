import { Router } from 'express';
import { signup } from '../controllers/authController';
const router = Router();

router.get('/', async (req, res) => {
  // const { sortBy, sortOrder, name, email } = req.query;

  // const options = { sortBy, sortOrder };

  // try {
  //   if (name && email) {
  //     return res
  //       .status(400)
  //       .json({ error: 'query by either name or email, not both' });
  //   }
  // } catch (error) {}
  return res.status(200).json({
    status: 'success',
    message: 'all user',
  });
});

router.post('/signup', signup);

export default router;
