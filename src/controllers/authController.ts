import { AppError } from '../utils/AppError';
import { loginUser, signupUser } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';

export const signup = catchAsync(async (req, res) => {
  const { name, username, email, password, passwordConfirm } = req.body;
  const newUser = await signupUser({
    name,
    username,
    email,
    password,
    passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    ...newUser,
  });
});

export const signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }
  const token = await loginUser({ email, password });
  res.status(200).json({
    status: 'success',
    token,
  });
});
