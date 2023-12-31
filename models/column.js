import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const column = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for column"],
    },
    dashboardId: {
      type: Schema.Types.ObjectId,
      ref: "dashboard",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

column.pre("findOneAndUpdate", runValidateAtUpdate);

column.post("save", handleSaveError);

column.post("findOneAndUpdate", handleSaveError);

const Column = model("column", column);

export default Column;
