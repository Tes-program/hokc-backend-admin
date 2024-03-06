import { AuthService } from "./auth.service";
import { Request, Response } from "express";
// import { User } from "./users.model";


export class AuthController {
  constructor(private userService: AuthService) {}

    // Create a new user
    public async create(req: Request, res: Response) {
        try {
            const user = await this.userService.create(req.body);
            return res.status(201).json(user);
        } catch (error : unknown) {
            return res.status(400).json({ message: error });
        }
    }

    // Login user
    public async login(req: Request, res: Response) {
        try {
            const user = await this.userService.login(req.body);
            return res.status(200).json(user);
        } catch (error : unknown) {
            return res.status(400).json({ message: error });
        }
    }

    // Logout user
    public async logout(req: Request, res: Response) {
        try {
            await this.userService.logout(req.body.refreshToken);
            return res.status(200).json({ message: "User logged out successfully" });
        } catch (error : unknown) {
            return res.status(400).json({ message: error });
        }
    }

    // Refresh token
    public async refreshToken(req: Request, res: Response) {
        try {
            const accessToken = await this.userService.refreshToken(req.body.refreshToken);
            return res.status(200).json({ accessToken });
        } catch (error : unknown) {
            return res.status(400).json({ message: error });
        }
    }
}