import { ctrlWrapper } from "../decorators/index.js";
import Card from "../models/card.js";
import Column from "../models/column.js";
import { HttpError } from "../helpers/index.js";

const add = async (req, res, next) => {
  const { columnId } = req.params;
  const column = await Column.findById(columnId);
  const dashboardId = column.dashboardId;
  const result = await Card.create({ ...req.body, columnId, dashboardId });
  res.status(201).json(result);
};

const getById = async (req, res, next) => {
  const { cardId } = req.params;
  const result = await Card.findById(cardId);
  if (!result) {
    throw HttpError(404, `Card with id=${cardId} not found`);
  }
  res.status(201).json(result);
};

const getAll = async (req, res, next) => {
  const { columnId } = req.params;
  const result = await Card.find({ columnId }, "-createdAt -updatedAt");
  if (!result) {
    throw HttpError(404, `Column with id=${columnId} not found`);
  }
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { cardId } = req.params;
  const result = await Card.findByIdAndUpdate(cardId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Card with id=${cardId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { cardId } = req.params;
  const result = await Card.findByIdAndDelete(cardId);
  if (!result) {
    throw HttpError(404, `Card with id=${cardId} not found`);
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
