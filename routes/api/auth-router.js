import express from "express";
import userSchemas from "../../schemas/user-schemas.js";
import validateBody from "../../decorators/validateBody.js";
import authController from "../../controllers/auth-controller.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSignUpValidate = validateBody(userSchemas.userRegistrationSchema);
const userSignInValidate = validateBody(userSchemas.userLogInSchema);

export default authRouter;

authRouter.post("/signup", userSignUpValidate, authController.signup);

authRouter.post("/signin", userSignInValidate, authController.signin);

authRouter.post("/signout", authenticate, authController.signout);
