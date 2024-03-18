import { Token } from "../utils/interfaces/token.interface";
import { TokenEnum } from "../utils/enum/token";
import { db } from "../database/index";

export class TokenModel{
  static tableName = 'generated_token';

  public static db = () => db<Token>(TokenModel.tableName);


  public static async create(data: Partial<Token>): Promise<Token> {
    const [id] = await TokenModel.db().insert(data).returning('id');
    return { id, ...data } as Token;
  }

  public static async findByToken(userId: string, token: string, type: TokenEnum, isRevoked = false): Promise<Token | undefined> {
    return TokenModel.db()
    .where("user_id", userId)
    .where("token", token)
    .where("type", type)
    .where("is_revoked", isRevoked)
    .first();
  }

  public static async findToken(token: string, type: TokenEnum, isRevoked = false) {
    return TokenModel.db()
      .where({token: token, type: type, is_revoked: isRevoked})
      .first();
  }

  public static async revokeToken(refreshToken: string): Promise<number> {
    return TokenModel.db().where('token', refreshToken).update({ is_revoked: true });
  }

  // Delete the token
  public static async deleteToken(data: Token[]): Promise<number> {
    if (data.length === 0) {
      return 0; // No tokens to delete
    }
    
  
    const tokenValues = data.map(token => token.token);
    const typeValues = data.map(token => token.type);
    const isRevokedValues = data.map(token => token.is_revoked);
  
    return await TokenModel.db()
      .whereIn('token', tokenValues)
      .whereIn('type', typeValues)
      .whereIn('is_revoked', isRevokedValues)
      .del();
  }
}


