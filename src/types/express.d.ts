import User from '../models/User'; // optional, if you have a User model

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        user: {
          username: string;
          fullName: string;
        };
      };
    }
  }
}
