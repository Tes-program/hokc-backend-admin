export interface Token {
    id?: string;
    user_id?: string;
    token?: string;
    type?: string;
    is_revoked?: boolean;
    expires_at?: Date;
}