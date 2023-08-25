import { isValidObjectId } from "mongoose";
import { HttpCode } from "../constants/user-constants.js";
import { HttpError } from "../helpers/index.js";

const isValidCardId = (req, res, next) => {
  const { cardId } = req.params;
  if (!isValidObjectId(cardId)) {
    return next(HttpError(HttpCode.NOT_FOUND, `${cardId} is not valid id`));
  }
  next();
};

export default isValidCardId;
