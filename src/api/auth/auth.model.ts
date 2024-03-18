import { IUser } from "../../utils/interfaces/user.interface";
import { db } from "../../database/index";
import { UnprocessableEntityError} from "../../shared/error";

export class AuthModel{
  static tableName = "users";

  public static db = () => db<IUser>(AuthModel.tableName);

  public static async create(data: Partial<IUser>): Promise<IUser> {
    try {
     return await AuthModel.db().insert(data).returning("id");
    }
    catch (error) {
      throw new UnprocessableEntityError('Error creating user');
    }
  }

  public static async login(email: string, password: string): Promise<IUser | undefined> {
    try {
    return AuthModel.db().where({ email, password }).first();
    } catch (error) {
      throw new UnprocessableEntityError('This data can not be processed due to an error in the database');
    }
  }

  public static async findByEmail(email: string): Promise<IUser | undefined> {
    try {
    return AuthModel.db().where({ email }).first();
    } catch (error) {
      throw new UnprocessableEntityError('This data can not be processed due to an error in the database');
    }
  }

  public static async findById(id: string): Promise<IUser | undefined> {
    return AuthModel.db().where({ id: id }).first();
  }

  public static async paginateUsers(page: number, limit: number): Promise<IUser[]> {
    return AuthModel.db().limit(limit).offset((page - 1) * limit);
  }

  public static async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    await AuthModel.db().where({ id }).update(data);
    return data as IUser;
  }
}