import express, { Request, Response } from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import authRouter from './routes/api/auth-router.js';
import dashboardRouter from './routes/api/dashboard-router.js';
import columnRouter from './routes/api/column-router.js';
import swaggerDocument from '/swagger.json';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/column/', columnRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/privacy-policy.html'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
