import ctrlWrapper from "../decorators/ctrlWrapper.js";
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
  const { dashboardId } = req.params;
  const result = await Dashboard.findById(dashboardId);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res, next) => {
  const { dashboardId } = req.params;
  const result = await Contact.findByIdAndDelete(dashboardId);
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json({
    message: "Delete success",
  });
};

const updateById = async (req, res) => {
  const { dashboardId } = req.params;
  const result = await Contact.findByIdAndUpdate(dashboardId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Movie with id=${dashboardId} not found`);
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
