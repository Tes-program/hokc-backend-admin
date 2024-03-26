/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { UserService } from "./user.service";

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}
export class UserController {
  public async createUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId as string;
    try {
      const {
        first_name,
        last_name,
        matric_number,
        hall_of_residence,
        gender,
        department,
        date_of_birth,
        profile_picture,
      } = req.body;
    //   console.log(req.body);
        const user = await UserService.createUser(userId, {
            first_name,
            last_name,
            matric_number,
            hall_of_residence,
            gender,
            department,
            date_of_birth,
            profile_picture,
        });
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(error.httpCode || 500).json({ error: error.message });
    }
  }
    public async getUserById(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId as string;
        try {
        const user = await UserService.getUserById(userId);
        res.status(200).json(user);
        } catch (error) {
        res.status(error.httpCode || 500).json({ error: error.message });
        }
    }
}
