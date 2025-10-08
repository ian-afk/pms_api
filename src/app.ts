import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import userRouter from './routes/userRoutes';
import roleRouter from './routes/roleRoutes';
import cors from 'cors';
import { AppError } from './utils/AppError';
import { globalErrorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('hello from express!');
});

// routes
// app.use('/api/users', userRouter);
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);

// new express way regex the app.all handler (before '*')
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} with the server`, 404));
});

app.use(globalErrorHandler);
export { app };
