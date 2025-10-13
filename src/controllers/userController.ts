import { findUserById, listAllUsers } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';

export const getUsers = catchAsync(async (req, res) => {
  const users = await listAllUsers();
  res.status(200).json({ status: 'success', data: users });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await findUserById(req.params.id);
  res.status(200).json({ status: 'success', user });
});
