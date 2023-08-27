import { ctrlWrapper } from "../decorators/index.js";
import Column from "../models/column.js";
import { HttpError } from "../helpers/index.js";

const add = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Column.create({ ...req.body, dashboardId });
  res.status(201).json(result);
};

const getById = async (req, res, next) => {
  const { columnId } = req.params;
  const result = await Column.findById(columnId);
  if (!result) {
    throw HttpError(404, `Column with id=${columnId} not found`);
  }
  res.status(201).json(result);
};

const getAll = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Column.find(
    { dashboardId },
    "-createdAt -updatedAt"
  ).populate("dashboardId", "title");
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { columnId } = req.params;
  const result = await Column.findByIdAndUpdate(columnId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Column with id=${columnId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { columnId } = req.params;
  const result = await Column.findByIdAndDelete(columnId);
  if (!result) {
    throw HttpError(404, `Column with id=${columnId} not found`);
  }
  res.json({
    message: "Delete success",
  });
};
export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  add: ctrlWrapper(add),
};
