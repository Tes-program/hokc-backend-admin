import { AuthController } from "./auth.controllers";
import express from "express";
import {
  createUserSchema,
  loginUserSchema,
  initiatePasswordResetSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema,
  verifyEmailSchema,
  googleSignInSchema,
  googleSignUpSchema,
  verifyTokenSchema,
} from "./validation/auth.validators";
import { validateBody } from "../../modules/validate";

const authRoute = express();
const authController = new AuthController();

authRoute.post(
  "/register",
  validateBody(createUserSchema),
  authController.create
);
authRoute.post(
  "/verify-email",
  validateBody(verifyEmailSchema),
  authController.verifyEmail
);
authRoute.post("/login", validateBody(loginUserSchema), authController.login);
authRoute.post("/logout", validateBody(logoutSchema), authController.logout);
authRoute.post("/google-signup", validateBody(googleSignUpSchema), authController.googleSignUp);
authRoute.post("/google-signin", validateBody(googleSignInSchema), authController.googleSignIn);
authRoute.post(
  "/verify-token",
  validateBody(verifyTokenSchema),
  authController.verifyToken
);

authRoute.post(
  "/refresh-token",
  validateBody(refreshTokenSchema),
  authController.refreshToken
);
authRoute.post(
  "/initiate-reset",
  validateBody(initiatePasswordResetSchema),
  authController.initiatePasswordReset
);
authRoute.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

export default authRoute;
