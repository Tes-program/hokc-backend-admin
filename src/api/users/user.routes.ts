import express from "express";
import { UserController } from "./user.controllers";
import { createUserValidator } from "./validation/user.validators";
import { validateBody } from "../../modules/validate";


const userRoute = express();
const userController = new UserController();

userRoute.post("/user-information", validateBody(createUserValidator) ,userController.createUser.bind(userController));
userRoute.get("/me", userController.getUserById.bind(userController));

export default userRoute;