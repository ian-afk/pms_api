import { User } from '../db/models/users';
import { createUser } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '5m',
    },
  );

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
