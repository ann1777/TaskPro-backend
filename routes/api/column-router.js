import express from "express";
import columnSchema from "../../schemas/column-schemas.js";
import { validateBody } from "../../decorators/index.js";
import {
  isEmptyBody,
  isValidDashboardId,
  authenticate,
  isValidColumnId,
} from "../../middlewares/index.js";
import columnController from "../../controllers/column-controller.js";

const columnRouter = express.Router();

const colunmAddValidate = validateBody(columnSchema.columnAddSchema);

columnRouter.use(authenticate);

columnRouter.post(
  "/:dashboardId",
  isEmptyBody,
  colunmAddValidate,
  isValidDashboardId,
  columnController.add
);
columnRouter.get("/:dashboardId", isValidDashboardId, columnController.getAll);
columnRouter.get(
  "/:dashboardId/:columnId",
  isValidColumnId,
  columnController.getById
);
columnRouter.put(
  "/:dashboardId/:columnId",
  isEmptyBody,
  isValidColumnId,
  colunmAddValidate,
  columnController.updateById
);
columnRouter.delete(
  "/:dashboardId/:columnId",
  isValidColumnId,
  columnController.deleteById
);

export default columnRouter;
