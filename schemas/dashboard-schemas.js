import Joi from "joi";

const dashboardAddSchema = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string(),
  columns: Joi.array(),
});

// const contactUpdateFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });

export default {
  dashboardAddSchema,
};
