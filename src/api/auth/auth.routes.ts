import { AuthController } from "./auth.controllers";
import { Router } from "express";
import { createUserSchema, loginUserSchema } from "./validation/auth.validators";
import { validateBody } from "../../modules/validate";

export class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor(controller: AuthController) {
    this.router = Router();
    this.controller = controller;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", validateBody(createUserSchema), this.controller.create);
    this.router.post("/login", validateBody(loginUserSchema), this.controller.login);
    this.router.post("/logout", this.controller.logout);
    this.router.post("/refresh-token", this.controller.refreshToken);
  }
}