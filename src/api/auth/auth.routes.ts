import { AuthController } from "./auth.controllers";
import express from "express";
import { createUserSchema, loginUserSchema } from "./validation/auth.validators";
import { validateBody } from "../../modules/validate";

const authRoute = express();
const authController = new AuthController();

authRoute.post("/register", validateBody(createUserSchema), authController.create);
authRoute.post("/login", validateBody(loginUserSchema), authController.login);
authRoute.post("/logout", authController.logout);
authRoute.post("/refresh-token", authController.refreshToken);

export default authRoute;