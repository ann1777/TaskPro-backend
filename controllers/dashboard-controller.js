import { ctrlWrapper } from "../decorators/index.js";
import Dashboard from "../models/dashboard.js";
import { HttpError } from "../helpers/index.js";

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  //   const { page = 1, limit = 10 } = req.query;
  //   const skip = (page - 1) * limit;
  const result = await Dashboard.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner", "name email");
  res.json(result);
};
const add = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Dashboard.create({ ...req.body, owner });
  res.status(201).json(result);
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Dashboard.findById(id);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${id} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Dashboard.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${id} not found`);
  }
  res.json({
    message: "Delete success",
  });
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Dashboard.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Dashboard with id=${id} not found`);
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updateById: ctrlWrapper(updateById),
  //   updateFavorite: ctrlWrapper(updateFavorite),
  deleteById: ctrlWrapper(deleteById),
  add: ctrlWrapper(add),
};
