import Joi from 'joi';

const dashboardAddSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string().required(),
  background: Joi.string().required(),
});

export default {
  dashboardAddSchema,
};
