import { AuthService } from "./auth.service";
import { Request, Response } from "express";

export class AuthController {
    public authService: AuthService;

   
    public async create(req: Request, res: Response) {
        try {
            const {email, password, phone_number} = req.body;
            const user = await AuthService.register(email, password, phone_number);
            res.status(201).json({user});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }


    public async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const {token} = await AuthService.login(email, password);
            res.status(200).json({token});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.body.refreshToken;
            await AuthService.logout(refreshToken);
            res.status(200).json({message: "User logged out successfully"});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.body.refreshToken;
            const token = await AuthService.refreshToken(refreshToken);
            res.status(200).json({token});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async initiatePasswordReset(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const token = await AuthService.initiatePasswordReset(email);
            res.status(200).json({token});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }
}