import { ctrlWrapper } from "../decorators/index.js";
import Dashboard from "../models/dashboard.js";
import Column from "../models/column.js";
import Card from "../models/cards.js";
import { HttpError, handleGetDashboardsData } from "../helpers/index.js";
import { google } from "googleapis";

const { GMAIL_API_CLIENT_ID, BASE_URL } = process.env;

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  // const result = await Dashboard.find(
  //   { owner },
  //   '-createdAt -updatedAt'
  // ).populate('owner', 'name email');
  const result = await handleGetDashboardsData(owner);
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
  const result = await Dashboard.findByIdAndDelete(dashboardId);
  await Column.deleteMany({ dashboardId });
  await Card.deleteMany({ dashboardId });
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json({
    message: "Delete success",
  });
};

const updateById = async (req, res) => {
  const { dashboardId } = req.params;
  const result = await Dashboard.findByIdAndUpdate(dashboardId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Dashboard with id=${dashboardId} not found`);
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  add: ctrlWrapper(add),
};
