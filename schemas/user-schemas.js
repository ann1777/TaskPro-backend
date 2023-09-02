import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userLogInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
const userUpdateData = Joi.object({
  name: Joi.string(),
  avatarURL: Joi.string(),
});

export default { userRegistrationSchema, userLogInSchema, userUpdateData };
