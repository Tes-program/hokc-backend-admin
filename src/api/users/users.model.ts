import { BaseModel } from "src/shared/model";
import { CreateUserDto } from "./dto/create-users.dto";
import { LoginUserDto } from "./dto/login-users.dto";

export class UsersModel extends BaseModel {
  static tableName = "users";

  public static async create(data: CreateUserDto) {
    return this.insert(data);
  }

  public static async login(data: LoginUserDto) {
    return this.findBy(data);
  }

  public static async findByEmail(email: string) {
    return this.findBy({ email });
  }

  public static async paginateUsers(page: number, limit: number) {
    return this.paginate(page, limit);
  }

}
