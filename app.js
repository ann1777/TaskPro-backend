import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui';
import 'dotenv/config';
import authRouter from './routes/api/auth-router.js';
import dashboardRouter from './routes/api/dashboard-router.js';
import columnRouter from './routes/api/column-router.js';
import cardRouter from './routes/api/card-router.js';


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
app.use('/api/card/', cardRouter);

// import('./swagger.json')
//   .then((specs) => {
//     app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
//   })
//   .catch((error) => {
//     console.error('Error loading Swagger specs:', error);
//   });

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
