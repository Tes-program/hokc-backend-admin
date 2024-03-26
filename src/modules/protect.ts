/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UnauthorizedError } from "../shared/error";
import { env } from "../config/env";
import { AuthModel } from "../api/auth/auth.model";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: { userId: string };
    }

export const protectUser = (req: AuthenticatedRequest, res: Response, next: any) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer")) {
        res.status(401).json({ error: "Unauthorized, No token provided" });
        throw new UnauthorizedError("Unauthorized, No token provided");
    }
    const token = bearer.split(" ")[1];
    try {
        const secret = env.JWT_SECRET;
        const payload = jwt.verify(token, secret);
        const user = AuthModel.findById(payload.sub as string);
        if (!user) {
            res.status(401).json({ error: "Unauthorized, User not found" });
            throw new UnauthorizedError("Unauthorized, User not found");
        }
        req.user = { userId: payload.sub as string };
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized, Invalid token" });
        throw new UnauthorizedError("Unauthorized, Invalid token");
    }
    }
