import Joi from "joi";

export const cardAddSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  priority: Joi.string(),
  deadline: Joi.string(),
  dashboardId: Joi.string(),
  columnId: Joi.string(),
  cards: Joi.array(),
});
export default {
  cardAddSchema,
};
