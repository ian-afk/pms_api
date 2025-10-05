import { promisify } from 'util';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/userService';
import { User } from '../db/models/users';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
export const protect = catchAsync(async (req, res, next) => {
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError(`You're not logged in! Please login.`, 401));
  }

  const decoded = await new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as JwtPayload);
    });
  });

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user does not exists', 401));
  }

  if ((currentUser as any).changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Please login again.', 401));
  }

  //   req.user = currentUser;
  next();
});
