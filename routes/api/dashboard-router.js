import express from "express";
import dashboardSchema from "../../schemas/dashboard-schemas.js";
import dashboardController from "../../controllers/dashboard-controller.js";
import { validateBody } from "../../decorators/index.js";

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
dashboardRouter.get("/:id", isValidId, dashboardController.getById);
dashboardRouter.post(
  "/",
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.add
);
dashboardRouter.delete("/:id", isValidId, dashboardController.deleteById);

dashboardRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  dashboardAddValidate,
  dashboardController.updateById
);

export default dashboardRouter;
