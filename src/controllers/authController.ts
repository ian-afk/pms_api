import { createUser } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await createUser(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
