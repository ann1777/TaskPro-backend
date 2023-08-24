import { ctrlWrapper } from "../decorators/index.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import Dashboard from "../models/dashboard.js";

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
  // console.log(user);
  // if (!user.verify) {
  //   throw HttpError(401, "Email not verify");
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const owner = user._id;
  const dashboards = await Dashboard.find({ owner });

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  res.json({
    token,
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

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
};
