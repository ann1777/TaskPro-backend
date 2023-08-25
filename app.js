import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import authRouter from './routes/api/auth-router.js';
import dashboardRouter from './routes/api/dashboard-router.js';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './routes/api/auth-router.js';
import dashboardRouter from './routes/api/dashboard-router.js';
import columnRouter from './routes/api/column-router.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/column/', columnRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
