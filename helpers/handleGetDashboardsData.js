import Dashboard from "../models/dashboard.js";

const handleGetDashboardsData = async (owner) => {
  const result = await Dashboard.aggregate([
    {
      $match: {
        owner: owner,
      },
    },
    {
      $lookup: {
        from: "columns",
        localField: "_id",
        foreignField: "dashboardId",
        pipeline: [
          {
            $lookup: {
              from: "cards",
              localField: "_id",
              foreignField: "columnId",
              as: "cards",
            },
          },
        ],
        as: "columns",
      },
    },
  ]);
  return result;
};

export default handleGetDashboardsData;
