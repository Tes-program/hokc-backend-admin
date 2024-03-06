import { BaseModel, createKnexInstance } from "../../shared/model";
import { IUser } from "../../utils/interfaces/user.interface";

export class AuthModel extends BaseModel {
  static tableName = "users";
  static db = createKnexInstance<IUser>(AuthModel.tableName);

  public static async create(data: IUser): Promise<IUser> {
    await AuthModel.db.insert(data).returning("id");
    return { ...data};
  }

  public static async login(email: string, password: string): Promise<IUser | undefined> {
    return AuthModel.db.where({ email, password }).first();
  }

  public static async findByEmail(email: string): Promise<IUser | undefined> {
    return AuthModel.db.where({ email }).first();
  }

  public static async findById(id: string): Promise<IUser | undefined> {
    return AuthModel.db.where({ id }).first();
  }

  public static async paginateUsers(page: number, limit: number): Promise<IUser[]> {
    return AuthModel.db.limit(limit).offset((page - 1) * limit);
  }
}