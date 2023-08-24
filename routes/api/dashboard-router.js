import express from "express";
import dashboardSchema from "../../schemas/dashboard-schemas.js";
import dashboardController from "../../controlers/dashboard-controller.js";

import {
  isEmptyBody,
  isValidId,
  authenticate,
  upload,
} from "../../middlewares/index.js";

const dashboardRouter = express.Router();

const dashboardAddValidate = validateBody(dashboardSchema.dashboardAddSchema);

dashboardRouter.use(authenticate);

dashboardRouter.get("/", dashboardController.getAll);
dashboardRouter.get("/:dashboardId", isValidId, dashboardController.getById);
dashboardRouter.post(
  "/",
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.add
);
dashboardRouter.delete(
  "/:dashboardId",
  isValidId,
  dashboardController.deleteById
);

dashboardRouter.put(
  "/:dashboardId",
  isValidId,
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.updateById
);
