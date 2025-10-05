import { promisify } from 'util';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
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

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
  console.log(decoded);
  next();
});
