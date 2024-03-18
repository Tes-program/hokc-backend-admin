import { db } from "../../database/index";
import { IUserInformation } from "../../utils/interfaces/userInfo.interface";


export class UserModel {
    static tableName = "users_information";

    public static db = () => db<IUserInformation>(this.tableName)

    public static async getAll() {
        return this.db().select();
    }

    public static async getById(id: string) {
        return this.db().where({ id }).first();
    }

    public static async create(user: Partial<IUserInformation>) {
        return this.db().insert(user);
    }

    public static async update(id: string, user: Partial<IUserInformation>) {
        return this.db().where({ id }).update(user);
    }

    public static async delete(id: string) {
        return this.db().where({ id }).delete();
    }
}