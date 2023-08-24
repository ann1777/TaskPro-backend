import express from "express";
import dashboardSchema from "../../schemas/dashboard-schemas.js";
import dashboardController from "../../controllers/dashboard-controller.js";
import { validateBody } from "../../decorators/index.js";

import {
  isEmptyBody,
  isValidDashboardId,
  authenticate,
  upload,
} from "../../middlewares/index.js";

const dashboardRouter = express.Router();

const dashboardAddValidate = validateBody(dashboardSchema.dashboardAddSchema);

dashboardRouter.use(authenticate);

dashboardRouter.get("/", dashboardController.getAll);
dashboardRouter.get(
  "/:dashboardId",
  isValidDashboardId,
  dashboardController.getById
);
dashboardRouter.post(
  "/",
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.add
);
dashboardRouter.delete(
  "/:dashboardId",
  isValidDashboardId,
  dashboardController.deleteById
);

dashboardRouter.put(
  "/:dashboardId",
  isValidDashboardId,
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.updateById
);

export default dashboardRouter;
