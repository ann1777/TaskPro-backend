import express from "express";
import columnSchema from "../../schemas/column-schemas.js";
import { validateBody } from "../../decorators/index.js";
import colunmController from "../../controllers/column-controller.js";

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
  colunmController.add
);
columnRouter.get("/:dashboardId", isValidDashboardId, colunmController.getAll);
columnRouter.get(
  "/:dashboardId/:columnId",
  isValidColumnId,
  colunmController.getById
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
  colunmController.deleteById
);

export default columnRouter;
