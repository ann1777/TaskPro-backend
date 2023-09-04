import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import {
  HttpError,
  handleGetDashboardsData,
  sendEmail,
} from "../helpers/index.js";
import jimp from "jimp";
import fs from "fs/promises";
import path from "path";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "identicon" });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatarURL,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  // if (!user.verify) {
  //   throw HttpError(401, "Email not verify");
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const owner = user._id;
  const dashboards = await handleGetDashboardsData(owner);
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  const { name, theme, avatarURL } = user;
  res.json({
    token,
    name,
    email,
    theme,
    avatarURL,
    dashboards,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};

const getCurrent = async (req, res) => {
  const { name, theme, avatarURL, _id: owner, email } = req.user;
  const dashboards = await handleGetDashboardsData(owner);
  res.json({
    name,
    email,
    theme,
    avatarURL,
    dashboards,
  });
};

const updateTheme = async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;
  const result = await User.findByIdAndUpdate(_id, { theme }, { new: true });
  res.json(theme);
};

const updateData = async (req, res) => {
  const { _id } = req.user;
  const { avatarURL, name } = req.body;
  const newData = {};
  if (avatarURL) {
    newData.avatarURL = avatarURL;
  }
  if (name) {
    newData.name = name;
  }
  const result = await User.findByIdAndUpdate(
    _id,
    { ...newData },
    { new: true }
  );
  res.json({ name, email, avatarURL });
};

export const avatarsDir = path.resolve("public", "avatars");

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
    const avatarURL = path.join("public", "avatars", newName);
    updatedData.avatarURL = avatarURL;
  }
  if (!name && !req.file) {
    throw HttpError(400, "Updated data is required");
  }
  const result = await User.findByIdAndUpdate(
    _id,
    { ...updatedData },
    {
      new: true,
    }
  );
  res.json({ name, email, avatarURL });
};

const sendHelpEmail = async (req, res) => {
  const { comment, email } = req.body;
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  const userMail = email ? email : user.email;
  const mail = {
    to: "taskpro.project@gmail.com",
    subject: `User ${_id} needs help`,
    html: `<h5>userName: ${user.name} , userEmail: ${userMail} </h5>
    <p>userComment: ${comment}</p>`,
  };
  await sendEmail(mail);

  res.json({
    message: "Your mail has been sent",
  });
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  updateTheme: ctrlWrapper(updateTheme),
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  sendHelpEmail: ctrlWrapper(sendHelpEmail),
  updateData: ctrlWrapper(updateData),
};
