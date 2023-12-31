import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const card = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for card"],
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      required: [true, "Set priority for card"],
    },
    deadline: {
      type: String,
    },
    dashboardId: {
      type: Schema.Types.ObjectId,
      ref: "dashboard",
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "column",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

card.pre("findOneAndUpdate", runValidateAtUpdate);

card.post("save", handleSaveError);

card.post("findOneAndUpdate", handleSaveError);

const Card = model("card", card);

export default Card;
