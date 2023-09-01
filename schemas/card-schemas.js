import Joi from "joi";

export const cardAddSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  priority: Joi.string().required(),
  deadline: Joi.string(),
});

export const cardUpdateSchema = Joi.object({
  cardId: Joi.string().required(),
  title: Joi.string(),
  dashboardId: Joi.string(),
  description: Joi.string(),
  priority: Joi.string().required(),
  deadline: Joi.string(),
  columnId: Joi.string(),
});

export default {
  cardAddSchema,
  cardUpdateSchema,
};
