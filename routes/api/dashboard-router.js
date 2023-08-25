import express from 'express';
import dashboardSchema from '../../schemas/dashboard-schemas.js';
import dashboardController from '../../controllers/dashboard-controller.js';
import { validateBody } from '../../decorators/index.js';

import User from '../../models/user.js';
import {
  isEmptyBody,
  isValidDashboardId,
  authenticate,
  upload,
} from '../../middlewares/index.js';
import { google } from 'googleapis';

const dashboardRouter = express.Router();

const dashboardAddValidate = validateBody(dashboardSchema.dashboardAddSchema);

// Create a new OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_API_CLIENT_ID,
  '', // Replace this with your client secret
  `${BASE_URL}/auth-callback` // Replace with your OAuth2 redirect URL
);
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Load credentials and other configuration from environment variables
const { GMAIL_API_CLIENT_ID, JWT_SECRET, BASE_URL } = process.env;

dashboardRouter.use(authenticate);

dashboardRouter.get('/', dashboardController.getAll);

dashboardRouter.get(
  '/:dashboardId',
  isValidDashboardId,
  dashboardController.getById
);

dashboardRouter.post(
  '/',
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.add
);

dashboardRouter.delete(
  '/:dashboardId',
  isValidDashboardId,
  dashboardController.deleteById
);
dashboardRouter.put(
  '/:dashboardId',
  isValidDashboardId,
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.updateById
);

// Function to get an access token
const getAccessToken = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
};

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
fs.readFile(TOKEN_PATH, (err, token) => {
  if (err) {
    // If token doesn't exist, get new token by following the OAuth2 flow
    getAccessToken(oAuth2Client);
  } else {
    oAuth2Client.setCredentials(JSON.parse(token));
  }
});

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
