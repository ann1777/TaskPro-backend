// import express from 'express';
// import dashboardSchema from '../../schemas/dashboard-schemas.js';
// import dashboardController from '../../controllers/dashboard-controller.js';

// import {
//   isEmptyBody,
//   isValidId,
//   authenticate,
//   upload,
// } from '../../middlewares/index.js';
// import validateBody from '../../decorators/validateBody.js';
// console.log(
//   `upload :`,
//   upload,
//   `\nisValidId :`,
//   isValidId,
//   `\nisEmptyBody :`,
//   isEmptyBody,
//   `\nauthenticate :`,
//   authenticate
// );

// const dashboardRouter = express.Router();

// const dashboardAddValidate = validateBody(dashboardSchema.dashboardAddSchema);

// dashboardRouter.use(authenticate);

// dashboardRouter.get('/', dashboardController.getAll);
// dashboardRouter.get('/:dashboardId', isValidId, dashboardController.getById);
// dashboardRouter.post(
//   '/',
//   isEmptyBody,
//   dashboardAddValidate,
//   dashboardController.add
// );

// dashboardRouter.post('/helpMail', async (req, res) => {
//   const { comment, userEmail } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'bc52node@gmail.com',
//       pass: 'justdo1t',
//     },
//   });

// const mailOptions = {
//   from: 'bc52node@gmail.com',
//   to: 'taskpro.project@gmail.com',
//   subject: 'Help Request',
//   text: `User Email: ${userEmail}\nComment: ${comment}`,
// };
//   console.log(
//     `mailOptions :`,
//     mailOptions,
//     `\nuserEmail :`,
//     userEmail,
//     `\ncomment :`,
//     comment
//   );

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully!');
//     res.status(200).send('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send('Error sending email.');
//   }
// });

// dashboardRouter.delete(
//   '/:dashboardId',
//   isValidId,
//   dashboardController.deleteById
// );

// dashboardRouter.put(
//   '/:dashboardId',
//   isValidId,
//   isEmptyBody,
//   dashboardAddValidate,
//   dashboardController.updateById
// );
// export default dashboardRouter;

import express from 'express';
const router = express.Router();
import User from '../../models/user.js';
import { google } from 'googleapis';
const credentials = process.env; // Replace with the actual path to your credentials JSON file

const dashboardRouter = express.Router();
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Load credentials and other configuration from environment variables
const { GMAIL_API_CLIENT_ID, JWT_SECRET, BASE_URL } = process.env;

// Create a new OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_API_CLIENT_ID,
  '', // Replace this with your client secret
  `${BASE_URL}/auth-callback` // Replace with your OAuth2 redirect URL
);

// const TOKEN_PATH = 'token.json'; // Replace with your token file path
// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw new HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || !user.token) {
      throw new HttpError(401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new HttpError(401, error.message);
  }
};

// Check if we have previously stored a token.
// fs.readFile(TOKEN_PATH, (err, token) => {
//   if (err) {
//     // If token doesn't exist, get new token by following the OAuth2 flow
//     getAccessToken(oAuth2Client);
//   } else {
//     oAuth2Client.setCredentials(JSON.parse(token));
//   }
// });

// Function to get an access token
const getAccessToken = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
};

// Route to send an email
dashboardRouter.post('/send-email', authenticate, async (req, res) => {
  const { base64EncodedEmail } = req.body;

  if (!base64EncodedEmail) {
    return res.status(400).json({ error: 'Email content is missing' });
  }

  try {
    oAuth2Client.setCredentials(req.user.token);

    const mailOptions = {
      from: 'bc52node@gmail.com',
      to: 'taskpro.project@gmail.com',
      subject: 'Help Request',
      text: `User Email: bc52node@gmail.com\nComment: ${comment}`,
    };
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    const response = await gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: base64EncodedEmail,
        mailOptions,
      },
    });
    console.log('Email sent:', response.data);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default dashboardRouter;
