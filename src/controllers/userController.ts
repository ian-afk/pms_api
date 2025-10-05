import { NextFunction, Request, Response } from 'express';
import { createUser, getUserById, listAllUsers } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';

export const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await listAllUsers();
    res.status(200).json({ status: 'success', data: users });
  },
);

export const getUser = catchAsync(async (req, res, next) => {
  const user = await getUserById(req.params.id);
  res.status(200).json({ status: 'success', user });
});
