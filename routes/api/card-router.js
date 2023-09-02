import express from "express";
import cardSchema from "../../schemas/card-schemas.js";
import { validateBody } from "../../decorators/index.js";
import cardController from "../../controllers/card-controller.js";
import {
  isEmptyBody,
  authenticate,
  isValidColumnId,
  isValidCardId,
} from "../../middlewares/index.js";

const cardRouter = express.Router();

const cardAddValidate = validateBody(cardSchema.cardAddSchema);

cardRouter.use(authenticate);

cardRouter.post(
  "/:columnId",
  isEmptyBody,
  cardAddValidate,
  isValidColumnId,
  cardController.add
);
cardRouter.get("/:columnId", isValidColumnId, cardController.getAll);
cardRouter.get(
  "/:columnId/:cardId",
  isValidColumnId,
  isValidCardId,
  cardController.getById
);
cardRouter.put(
  "/:columnId/:cardId",
  isEmptyBody,
  isValidColumnId,
  isValidCardId,
  cardAddValidate,
  cardController.updateById
);
cardRouter.delete(
  "/:columnId/:cardId",
  isValidColumnId,
  isValidCardId,
  cardController.deleteById
);

export default cardRouter;
