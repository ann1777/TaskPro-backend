import { ctrlWrapper } from '../decorators/index.js';
import Dashboard from '../models/dashboard.js';
import { HttpError } from '../helpers/index.js';
import { google } from 'googleapis';

const { GMAIL_API_CLIENT_ID, BASE_URL } = process.env;

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Dashboard.find(
    { owner },
    '-createdAt -updatedAt'
  ).populate('owner', 'name email');
  res.json(result);
};

const add = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Dashboard.create({ ...req.body, owner });
  res.status(201).json(result);
};

const getById = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findById(dashboardId);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndDelete(dashboardId);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json({
    message: 'Delete success',
  });
};

const updateById = async (req, res) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndUpdate(dashboardId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json(result);
};

const helpMail = async (req, res) => {
  const { base64EncodedEmail, comment } = req.body;

  if (!base64EncodedEmail) {
    return res.status(400).json({ error: 'Email content is missing' });
  }

  try {
    const { token } = req.user;

    const oAuth2Client = new google.auth.OAuth2(
      GMAIL_API_CLIENT_ID,
      '',
      `${BASE_URL}/auth-callback`
    );

    oAuth2Client.setCredentials(token);

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
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  add: ctrlWrapper(add),
  helpMail: ctrlWrapper(helpMail),
};
