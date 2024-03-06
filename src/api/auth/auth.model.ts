import { BaseModel } from "../../shared/model";
import { CreateUserDto } from "./dto/create-users.dto";
import { LoginUserDto } from "./dto/login-users.dto";

export class AuthModel extends BaseModel {
  static tableName = "users";

  public static async create(data: CreateUserDto) {
    return this.table.insert(data).returning("*");
  }

  public static async login(data: LoginUserDto) {
    return this.table.where({ email: data.email, password: data.password }).first();
  }

  public static async findByEmail(email: string) {
    return this.table.where({ email }).first();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async findUserId(id: string) : Promise<any> {
    return this.table.where({ id }).first();
  }

  public static async paginateUsers(page: number, limit: number) {
    return this.table.limit(limit).offset((page - 1) * limit);
  }

}
