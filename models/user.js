import { Schema, model } from "mongoose";
import { handleSaveError, runValidateAtUpdate } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    name: {
      type: String,
      minlength: 2,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    avatarURL: {
      type: String,
      required: [true, "Set avatarURL for user"],
    },
    theme: {
      type: String,
      enum: ["light", "color", "dark"],
      default: "light",
      required: [true, "Set theme for user"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", runValidateAtUpdate);

userSchema.post("save", handleSaveError);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
