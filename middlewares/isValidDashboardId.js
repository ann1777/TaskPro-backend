import { isValidObjectId } from "mongoose";
import { HttpCode } from "../constants/user-constants.js";
import { HttpError } from "../helpers/index.js";

const isValidDashboardId = (req, res, next) => {
  const { dashboardId } = req.params;
  console.log(req.params);
  if (!isValidObjectId(dashboardId)) {
    return next(
      HttpError(HttpCode.NOT_FOUND, `${dashboardId} is not valid id`)
    );
  }
  next();
};

export default isValidDashboardId;
