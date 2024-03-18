export interface IOTP {
    id: string;
    user_id: string;
    otp: string;
    is_used: boolean;
    expires_at: Date;
}