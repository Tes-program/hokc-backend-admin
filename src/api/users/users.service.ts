import { supabase } from "src/shared/supabase";
import { CreateUserDto } from "./dto/create-users.dto";
import { LoginUserDto } from "./dto/login-users.dto";
import { UsersModel } from "./users.model";
import { NotFoundError, ConflictError } from "src/shared";
import { Logger } from "src/shared/logger";


export class UserService {
    private logger = new Logger();
    public async create(data: CreateUserDto) {
        if (await UsersModel.findByEmail(data.email)) {
            throw new ConflictError('This email already exists');
        }
        const { data: user, error} = await supabase.auth.signUp({
            email: data.email,
            password: data.password
        });
        if (error) {
            this.logger.warn(error.message);
            throw new Error(error.message);
        }
    UsersModel.create(data);
    return user;
    }
    public async login(data: LoginUserDto) {
        const { data: user, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        });
        if (error) {
            this.logger.warn(error.message);
            throw new Error(error.message);
        }
        return { user };
    }
    public async paginateUsers(page: number, limit: number) {
        return UsersModel.paginateUsers(page, limit);
    }

    public async findById(id: string) {
        const user = await UsersModel.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }
    public async verifyOtp(email: string, token: string) {
        const {data, error} = await supabase.auth.verifyOtp({ email, token, type: 'email'})
        if (error) {
            this.logger.warn(error.message);
            throw new Error(error.message);
        }
        return data;
    }
}
