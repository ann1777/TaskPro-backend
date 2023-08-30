import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const dashboard = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set name for dashboard"],
    },
    icon: {
      type: String,
    },
    background: {
      type: String,
    },
    // columns: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "column",
    // },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

dashboard.pre("findOneAndUpdate", runValidateAtUpdate);

dashboard.post("save", handleSaveError);

dashboard.post("findOneAndUpdate", handleSaveError);

const Dashboard = model("dashboard", dashboard);

export default Dashboard;
