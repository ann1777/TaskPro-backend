import Joi from 'joi';

export const columnAddSchema = Joi.object({
  title: Joi.string().required(),
  dashboardId: Joi.string(),
});

export const columnUpdateSchema = Joi.object({
  title: Joi.string().required(),
  dashboardId: Joi.string(),
  columnId: Joi.string().required(),
  cards: Joi.array(),
});

export default {
  columnAddSchema,
  columnUpdateSchema,
};
