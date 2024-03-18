export interface IUser {
    id: string;
    email: string;
    password: string;
    phone_number: string;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}
