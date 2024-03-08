import { IUser } from "../../utils/interfaces/user.interface";
import { db } from "../../database/index";

export class AuthModel{
  static tableName = "users";

  public static db = () => db<IUser>(AuthModel.tableName);

  public static async create(data: Partial<IUser>): Promise<IUser> {
    await AuthModel.db().insert(data).returning("id");
    return (data) as IUser;
  }

  public static async login(email: string, password: string): Promise<IUser | undefined> {
    return AuthModel.db().where({ email, password }).first();
  }

  public static async findByEmail(email: string): Promise<IUser | undefined> {
    return AuthModel.db().where({ email }).first();
  }

  public static async findById(id: string): Promise<IUser | undefined> {
    return AuthModel.db().where({ id: id }).first();
  }

  public static async paginateUsers(page: number, limit: number): Promise<IUser[]> {
    return AuthModel.db().limit(limit).offset((page - 1) * limit);
  }
}