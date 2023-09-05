import express from "express";
import userSchemas from "../../schemas/user-schemas.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth-controller.js";
import {
  asyncHandler,
  authenticate,
  isEmptyBody,
  upload,
} from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userRegistrationSchema);
const userSignInValidate = validateBody(userSchemas.userLogInSchema);
const userUpdateData = validateBody(userSchemas.userUpdateData);

authRouter.post("/signup", userSignUpValidate, authController.signup);

authRouter.post("/signin", userSignInValidate, authController.signin);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.put(
  "/updatedata",
  authenticate,
  isEmptyBody,
  userUpdateData,
  authController.updateData
);
authRouter.put(
  "/updatetheme",
  authenticate,
  isEmptyBody,
  authController.updateTheme
);

authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.put(
  "/update",
  authenticate,
  upload.single("avatar"),
  authController.updateUser
);

authRouter.post(
  "/help",
  isEmptyBody,
  authenticate,
  authController.sendHelpEmail
);

authRouter.get("/google", asyncHandler(authController.googleAuth));
authRouter.get("/google-redirect", asyncHandler(authController.googleRedirect));

export default authRouter;
