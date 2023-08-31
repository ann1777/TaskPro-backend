export const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const HttpCode = {};

export const userFullDataString = `[
  {
    $match: {
      ownerId: 1,
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
];`;
