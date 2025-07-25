import { Router } from "express";
import {
  getUser,
  loginHandler,
  logOut,
  signUpHandler,
  userAlreadySignedUp,
} from "../controllers/authControllers.js";
import { validateSignUp } from "../middlewares/validateSignUp.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { validateLogin } from "../middlewares/validateLogin.js";

const authRouter = Router();

// SIGN UP
authRouter.post(
  "/sign-up",
  validateSignUp,
  handleValidationErrors,
  signUpHandler
);

// LOGIN
authRouter.post("/login", validateLogin, handleValidationErrors, loginHandler);

// GET USER
authRouter.get("/me", getUser);

// CHECK IF USER / EMAIL ALREADY SIGNED UP
authRouter.post("/check-email", userAlreadySignedUp);

// LOGOUT
authRouter.get("/log-out", logOut);

export default authRouter;
