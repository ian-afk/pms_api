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
