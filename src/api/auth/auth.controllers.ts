import { AuthService } from "./auth.service";
import { Request, Response } from "express";

export class AuthController {
    public authService: AuthService;

   
    public async create(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            await AuthService.register(email, password);
            res.status(201).json({message: "Check your email to verify your account"});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async verifyEmail(req: Request, res: Response) {
        try {
            const {otp, email} = req.body;
            await AuthService.verifyEmail(otp, email);
            res.status(200).json({message: "Email verified successfully"});
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

    public async googleSignUp(req: Request, res: Response) {
        try {
            const {email} = req.body;
            const token = await AuthService.googleSignUp(email);
            res.status(200).json({token});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async googleSignIn(req: Request, res: Response) {
        try {
            const {email} = req.body;
            const token = await AuthService.googleSignIn(email);
            res.status(200).json({token});
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

    public async verifyToken(req: Request, res: Response) {
        try {
            const {accessToken, refreshToken} = req.body;
            const decoded = await AuthService.verifyToken(accessToken, refreshToken);
            res.status(200).json(decoded);
        } catch (error) {
            res.status(error.httpCode || 500).json(false);
        }
    }

    public async initiatePasswordReset(req: Request, res: Response) {
        try {
            const email = req.body.email;
            const token = await AuthService.initiatePasswordReset(email);
            res.status(200).json({message: "Mail sent successfully", token});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }

    public async resetPassword(req: Request, res: Response) {
        try {
            const {token, password} = req.body;
            await AuthService.resetPassword(password, token);
            res.status(200).json({message: "Password reset successfully"});
        } catch (error) {
            res.status(error.httpCode || 500).json({error: error.message});
        }
    }
}