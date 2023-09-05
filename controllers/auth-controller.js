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
const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  HOSTING_URL,
  BASE_URL,
  FRONTEND_LOGIN_PAGE,
  LOCAL_FRONTEND_LOGIN_PAGE,
} = process.env;

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
  res.json({ theme: result.theme });
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
  res.json({ name: result.name, avatarURL: result.avatarURL });
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
  res.json({ name: result.name, avatarURL: result.avatarURL });
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

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    responce_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://account.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const serverHOST =
    req.get("host") === "localhost:3007" ? BASE_URL : HOSTING_URL;
  const frontendHOST =
    req.get("host") === "localhost:3007"
      ? LOCAL_FRONTEND_LOGIN_PAGE
      : FRONTEND_LOGIN_PAGE;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${serverHOST}/api/users/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    uri: "https://www.googledapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const user = await User.findOne({ email });
  if (!user) {
    const result = await User.create({
      name,
      email,
      password: id,
    });

    const accessToken = result.signToken();
    await User.findOneAndUpdate({ email }, { accessToken });

    return res.redirect(
      `${frontendHOST}/${accessToken}?name=${result.name}&email=${result.email}&theme=${result.theme}&avatarURL=${result.avatarURL}`
    );
  }
  if (user) {
    const accessToken = user.signToken();
    await User.findOneAndUpdate({ email }, { accessToken });
    return res.redirect(
      `${frontendHOST}/${accessToken}?name=${user.name}&email=${user.email}&theme=${user.theme}&avatarURL=${user.avatarURL}`
    );
  }
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
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
