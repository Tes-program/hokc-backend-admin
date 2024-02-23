import { PartialInstantiable } from "src/utils/classes/partial-instantiable";


export class LoginUserDto extends PartialInstantiable<LoginUserDto>{
    email!: string;
    password!: string;
}