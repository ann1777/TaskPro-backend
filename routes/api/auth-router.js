import express from "express";
import userSchemas from "../../schemas/user-schemas.js";
import { validateBody } from "../../decorators/index.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userRegistrationSchema);
const userSignInValidate = validateBody(userSchemas.userLogInSchema);

authRouter.post("/signup", userSignUpValidate, authController.signup);

authRouter.post("/signin", userSignInValidate, authController.signin);

authRouter.post("/signout", authenticate, authController.signout);

authRouter.put(
  "/updateTheme",
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

export default authRouter;
