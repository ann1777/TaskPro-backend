import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { HttpError, handleGetDashboardsData } from "../helpers/index.js";
import Dashboard from "../models/dashboard.js";
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
  const { name, theme, avatarURL, _id: owner } = req.user;
  const dashboards = await handleGetDashboardsData(owner);
  res.json({
    name,
    theme,
    avatarURL,
    dashboards,
  });
};

const updateTheme = async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;
  const result = await User.findByIdAndUpdate(_id, { theme }, { new: true });
  res.json(result);
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
  res.json(result);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  updateTheme: ctrlWrapper(updateTheme),
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
};
