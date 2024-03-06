import { BaseModel, createKnexInstance} from "../shared/model";
import { Token } from "../utils/interfaces/token.interface";
import { TokenEnum } from "../utils/enum/token";

export class TokenModel extends BaseModel {
  static tableName = 'generated_token';
  static db = createKnexInstance<Token>(TokenModel.tableName);

  public static async create(data: Partial<Token>): Promise<Token> {
    const [id] = await TokenModel.db.insert(data).returning('id');
    return { id, ...data } as Token;
  }

  public static async findByToken(userId: string, token: string, type: TokenEnum, isRevoked = false): Promise<Token | undefined> {
    return TokenModel.db
    .where(userId)
    .where(token)
    .where(type)
    .where(isRevoked)
    .first();
  }

  public static async findToken(token: string, type: TokenEnum, isRevoked = false): Promise<Token | undefined> {
    return TokenModel.db
    .where(token)
    .where(type)
    .where(isRevoked)
    .first();
  }

  public static async revokeToken(id: string): Promise<number> {
    return TokenModel.db.where({ id }).update({ is_revoked: true });
  }
}


