import Joi from 'joi';
import { emailRegexp } from '../constants/user-constants.js';

const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .description("User's email"),
  password: Joi.string().min(6).required().description("User's password"),
});

const userRegistrationResponse = Joi.object({
  uuId: Joi.number().integer().required().description("New user's id"),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .description("New user's email"),
  avatar: Joi.string().description("New user's id"),
});

const RegistrationResponse = Joi.array()
  .items(userRegistrationResponse)
  .example([
    { email: '1@gmail.com', userId: 1, avatar: '' },
    { email: '2@gmail.com', userId: 2, avatar: '' },
  ]);

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userSigninResponse = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  token: Joi.string().required(),
  dashboards: Joi.string().required(),
});

const updateProfileThemeSchema = Joi.object({
  theme: Joi.string().valid('Light', 'Dark', 'Violet').required(),
});

const userLogoutSchema = Joi.object({
  token: Joi.string().required(),
});

const userLogoutResponse = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export default {
  userRegistrationSchema,
  userRegistrationResponse,
  userSignInSchema,
  userSigninResponse,
  updateProfileThemeSchema,
  userLogoutSchema,
  userLogoutResponse,
};
