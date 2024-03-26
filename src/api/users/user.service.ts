import { UserModel } from "./user.model";
import { IUserInformation } from "../../utils/interfaces/userInfo.interface";
import { ConflictError, NotFoundError } from "../../shared/error";


export class UserService {
    public static async createUser (userId : string, user: Partial<IUserInformation>) {
        const existingUser = await UserModel.getById(userId);
        if (existingUser) {
            throw new ConflictError("User already exists");
        }
        return UserModel.create(user, userId);
    }
    public static async getUserById (userId: string) {
        const user = await UserModel.getById(userId);
        if (!user) {
            throw new NotFoundError("User information not found");
        }
        return user;
    }
}