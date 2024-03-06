import { Router } from "express";
import type { Request, Response } from "express";
import { AuthRoutes } from "../api/auth/auth.routes";
import { AuthController } from "../api/auth/auth.controllers";
import { AuthService } from "../api/auth/auth.service";



export const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});

const authService = new AuthService();
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(authController);

router.use('/auth', authRoutes.router);




