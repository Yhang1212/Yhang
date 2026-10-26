import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import contactsRouter from './routes/contacts.js';
import settingsRouter from './routes/settings.js';
import dashboardRouter from './routes/dashboard.js';
import { getUsers } from './services/userService.js';
import { authenticateToken, requireAdmin } from './middleware/auth.js';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET || !process.env.CORS_ORIGIN)) {
  throw new Error('JWT_SECRET, REFRESH_SECRET, and CORS_ORIGIN must be set in production');
}

const app = express();
const port = Number(process.env.PORT) || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));

app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/contacts', contactsRouter);
app.use('/settings', settingsRouter);
app.use('/dashboard', dashboardRouter);

app.get('/users-old', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await getUsers();
  res.json(users);
});

app.post('/validate-demo', body('email').isEmail(), body('name').isString().isLength({ min: 2 }), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.json({ message: 'Validation passed' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


