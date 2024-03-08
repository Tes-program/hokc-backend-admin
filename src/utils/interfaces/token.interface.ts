import { TokenEnum } from "../enum/token";

export interface Token {
    id: string;
    user_id: string;
    token: string;
    type: TokenEnum;
    is_revoked: boolean;
    expires_at: Date;
    created_at: Date;
}

export interface TokenPayload {
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  }