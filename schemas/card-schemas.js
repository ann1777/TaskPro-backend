import Joi from "joi";

export const cardAddSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  priority: Joi.string().required(),
  deadline: Joi.string(),
  columnId: Joi.string(),
});
export default {
  cardAddSchema,
};
