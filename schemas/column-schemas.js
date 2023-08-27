import Joi from 'joi';

export const columnAddSchema = Joi.object({
  title: Joi.string().required(),
  dashboardId: Joi.string(),
  cards: Joi.array(),
});

export const columnUpdateSchema = Joi.object({
  title: Joi.string().required(),
  dashboardId: Joi.string(),
  columnId: Joi.string(),
  cards: Joi.array(),
});

export default {
  columnAddSchema,
};
