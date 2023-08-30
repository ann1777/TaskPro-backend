import jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

import { ctrlWrapper } from '../decorators/index.js';
import User from '../models/user.js';
import { HttpError } from '../helpers/index.js';
import Dashboard from '../models/dashboard.js';
import { avatarsDir } from '../constants/user-constants.js';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
  // const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    // verificationCode,
  });

  // const verifyEmail = {
  //   to: email,
  //   subject: "Verify email",
  //   html: `<a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank">Click verify email</a>`,
  // };

  // await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name.required(),
    email: newUser.email.required(),
    avatar: newUser.avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  // console.log(user);
  // if (!user.verify) {
  //   throw HttpError(401, "Email not verify");
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const owner = user._id;
  const dashboards = await Dashboard.find({ owner });

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  res.json({
    token,
    user,
    dashboards,
    theme: user.theme,
    avatarURL: user.avatarURL,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'Signout success',
  });
};

const getCurrent = (req, res) => {
  const { name, theme, avatarURL } = req.user;
  res.json({
    name,
    theme,
    avatarURL,
  });
};

const updateTheme = async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;
  const result = await User.findByIdAndUpdate(_id, { theme }, { new: true });
  res.json(result);
};
export const avatarsDir = path.resolve('public', 'avatars');

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;
  const updatedData = {};
  if (name) {
    updatedData.name = name;
  }
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const image = await jimp.read(oldPath);
    await image.cover(250, 250).writeAsync(oldPath);

    const newName = `${Date.now()}-${filename}`;
    const newPath = path.join(avatarsDir, newName);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join('public', avatarName);
    const result = await User.findByIdAndUpdate(
      _id,
      { avatarURL, name },
      { new: true }
    );
    res.json(result);
  } else {
    const result = await User.findByIdAndUpdate(_id, { name }, { new: true });
    res.json(result);
  }
  const avatarURL = path.join('public', 'avatars', newName);
  updatedData.avatarURL = avatarURL;
};
console.log(updatedData);
const result = await User.findByIdAndUpdate(
  _id,
  { ...updatedData },
  {
    new: true,
  }
);
res.json(result);

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  updateTheme: ctrlWrapper(updateTheme),
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
};
