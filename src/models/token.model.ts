import { BaseModel} from "../shared/model";
import { Token } from "../utils/interfaces/token.interface";
import { TokenEnum } from "../utils/enum/token";

export class TokenModel extends BaseModel {
  static tableName = 'generated_token';

  public static create(data: Token) {
    return this.table.insert(data).returning("*")
  }

  public static findByToken(userId: string, token: string, type: TokenEnum, isRevoked: boolean) {
    return this.table.where({ userId, token, type, isRevoked}).first()
  }

  public static findToken(token: string, type: TokenEnum, isRevoked: boolean) {
    return this.table.where({ token, type, isRevoked}).first()
  }

  public static revokeToken(id: string) {
    return this.table.where({ id }).update({ isRevoked: true })
  }
}




