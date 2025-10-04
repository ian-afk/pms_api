import { NextFunction, Request, Response } from 'express';
import { createUser } from '../services/userService';
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {}
};
