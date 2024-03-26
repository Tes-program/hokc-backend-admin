export interface IUser {
    id: string;
    email: string;
    password: string;
    google_oauth: boolean;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}
