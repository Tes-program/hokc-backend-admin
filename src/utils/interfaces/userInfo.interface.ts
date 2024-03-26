import { Gender } from "../enum/gender";

export interface IUserInformation {
    id?: string;
    user_id?: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    matric_number: string;
    hall_of_residence: string;
    gender: Gender;
    department: string
    date_of_birth: Date;
    profile_picture?: string
}