import { TokenEnum } from "../enum/token";

export interface TokenDto{
    id?: string;
    user_id?: string;
    token: string;
    type?: TokenEnum;
    is_revoked?: boolean;
    expires_at?: Date;
}