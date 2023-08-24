import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import 'dotenv/config';
import authRouter from './routes/api/auth-router.js';
import todoRouter from './routes/api/todo-router.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/dashboard', todoRouter);
app.post('send-email', async (req, res) => {
  const { comment, sendEmail } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bc52node@gmail.com',
      pass: 'justdo1t',
    },
  });

  const mailOptions = {
    from: 'YOUR_EMAIL@gmail.com',
    to: 'taskpro.project@gmail.com',
    subject: 'Help Request',
    text: `User Email: ${userEmail}\nComment: ${comment}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email.');
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
