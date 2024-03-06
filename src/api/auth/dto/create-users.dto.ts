import { PartialInstantiable } from "src/utils/classes/partial-instantiable";

export class CreateUserDto extends PartialInstantiable<CreateUserDto>{
    email!: string;
    password!: string;
    phone_number!: string;
}