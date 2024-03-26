import { Router } from "express";
import type { Request, Response } from "express";
import authRoute from "../api/auth/auth.routes";
import { protectUser } from "../modules/protect";
import userRoute from "../api/users/user.routes";


export const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});


router.use('/auth', authRoute);
router.use('/user', protectUser, userRoute);

