import { Router } from "express";
import type { Request, Response } from "express";
import authRoute from "../api/auth/auth.routes";


export const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});


router.use('/auth', authRoute);




