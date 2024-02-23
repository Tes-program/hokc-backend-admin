import { PartialInstantiable } from "src/utils/classes/partial-instantiable";
import { Gender } from "src/utils/enum/gender";

export class CreateUserDto extends PartialInstantiable<CreateUserDto>{
    email!: string;
    password!: string;
    first_name!: string;
    last_name!: string;
    matric_number!: string;
    phone_number!: string;
    hall_of_residence!: string;
    gender!: Gender;
    department!: string;
    date_of_birth!: Date;
    profile_picture!: string;
}