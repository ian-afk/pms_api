import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ICatchAsync = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchAsync = (fn: ICatchAsync): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
