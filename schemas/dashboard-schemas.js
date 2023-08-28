import Joi from 'joi';

const dashboardAddSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string(),
  columns: Joi.array(),
});

export default {
  dashboardAddSchema,
};
