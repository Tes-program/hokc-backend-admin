import { Gender } from "../../utils/enum/gender";
import { db } from "../../database/index";
import { IUserInformation } from "../../utils/interfaces/userInfo.interface";


export class UserModel {
    static tableName = "users_information";

    public static db = () => db<IUserInformation>(this.tableName)

    public static async getAll() {
        return this.db().select();
    }

    public static async getById(user_id: string) {
        return this.db().where({ user_id }).first();
    }

    // 
    public static async create(user: Partial<IUserInformation>, userId: string) {
        const userInformationData: IUserInformation = {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            matric_number: user.matric_number || '',
            phone_number: user.phone_number || '',
            hall_of_residence: user.hall_of_residence || '',
            gender: user.gender || Gender.Other, // Assign a default value for gender
            department: user.department || '',
            date_of_birth: user.date_of_birth || new Date(),
            profile_picture: user.profile_picture || '',
            user_id: userId,
        };
      
        return this.db()
          .insert(userInformationData)
          .into('users_information')
          .returning('*');
      }

    public static async update(id: string, user: Partial<IUserInformation>) {
        return this.db().where({ id }).update(user);
    }

    public static async delete(id: string) {
        return this.db().where({ id }).delete();
    }

    public static async paginateUsers(page: number, limit: number) {
        return this.db().limit(limit).offset((page - 1) * limit);
    }
}