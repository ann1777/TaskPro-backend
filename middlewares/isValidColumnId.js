import { isValidObjectId } from "mongoose";
import { HttpCode } from "../constants/user-constants.js";
import { HttpError } from "../helpers/index.js";

const isValidColumnId = (req, res, next) => {
  const { columnId } = req.params;
  if (!isValidObjectId(columnId)) {
    return next(HttpError(HttpCode.NOT_FOUND, `${columnId} is not valid id`));
  }
  next();
};

export default isValidColumnId;
