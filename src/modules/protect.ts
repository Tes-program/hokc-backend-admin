/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { verifyToken } from "./auth";
import { UnauthorizedError } from "../shared/error";
import { env } from "../config/env";
import { TokenEnum } from "../utils/enum/token";
import { AuthModel } from "../api/auth/auth.model";

interface AuthenticatedRequest extends Request {
    user?: { userId: string };
    }

export const protectUser = (req: AuthenticatedRequest, res: Response, next: any) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer")) {
        throw new UnauthorizedError("Unauthorized, No token provided");
    }
    const token = bearer.split(" ")[1];
    try {
        const secret = env.JWT_SECRET;
        const payload = verifyToken(token, secret, TokenEnum.ACCESS);
        payload.then((data) => {
            const user = AuthModel.findById(data.id);
            if (!user) {
                throw new UnauthorizedError("Unauthorized, User not found");
            }
            req.user = { userId: data.id };
            next();
        });

    } catch (error) {
        throw new UnauthorizedError("Unauthorized, Invalid token");
    }
        next();
    }
