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

const { GMAIL_API_CLIENT_ID, BASE_URL } = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GMAIL_API_CLIENT_ID,
  '',
  `${BASE_URL}/auth-callback`
);
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

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

dashboardRouter.post(
  '/helpMail',
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.helpMail
);

export default dashboardRouter;
