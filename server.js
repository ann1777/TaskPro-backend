import mongoose from 'mongoose';
import 'dotenv/config.js';

import app from './app.js';

const { DB_HOST1, PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST1)
  .then(() => {
    app.post('/send-email', async (req, res) => {
      const { comment, userEmail } = req.body;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bc52node@gmail.com', // Replace with your real email
          pass: 'justdo1t', // Replace with your real password
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
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
