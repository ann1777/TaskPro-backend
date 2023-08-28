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
  avatar: Joi.string().required(),
  theme: Joi.string().required().default('Light'),
});

const RegistrationResponseExample = Joi.array()
  .items(userRegistrationResponse)
  .example([
    {
      email: '1@gmail.com',
      userId: '64e62dfb1e7e9fe71a3812c1',
      avatar:
        '//www.gravatar.com/avatar/245cf079454dc9a3374a7c076de247cc?s=200&r=pg&…',
    },
    {
      email: '2@gmail.com',
      userId: '64e62e2a1e7e9fe71a3812c4',
      avatar:
        '//www.gravatar.com/avatar/245cf079454dc9a3374a7c076de247cc?s=200&r=pg&…',
    },
  ]);

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userSigninResponse = Joi.object({
  token: Joi.string().required(),
  dashboards: Joi.string().required(),
  user: Joi.object(),
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
  RegistrationResponseExample,
  userSignInSchema,
  userSigninResponse,
  updateProfileThemeSchema,
  userLogoutSchema,
  userLogoutResponse,
};
