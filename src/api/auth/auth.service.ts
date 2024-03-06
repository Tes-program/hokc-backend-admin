import { CreateUserDto } from "./dto/create-users.dto";
import { LoginUserDto } from "./dto/login-users.dto";
import { AuthModel } from "./auth.model";
import { TokenModel } from "../../models/token.model";
import { TokenEnum } from "../../utils/enum/token";
import { NotFoundError, ConflictError, UnauthorizedError } from "../../shared/error";
import { Logger } from "../../shared/logger";
import { generateAuthToken, verifyToken } from "../../modules/auth";
import { env } from "../../config/env";

export class AuthService {
  private logger = new Logger();

  public async create(data: CreateUserDto) {
    const user = await AuthModel.findByEmail(data.email);
    if (user) {
      throw new ConflictError("Email already exists");
    }
    this.logger.info(`User created successfully: ${data.email}`);
    return AuthModel.create(data);
  }

  public async login(data: LoginUserDto) {
    const user = await AuthModel.login(data);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    this.logger.info(`User logged in successfully: ${data.email}`);
    return user;
  }

  public async logout(refreshToken: string) {    
    const token = await TokenModel.findToken(refreshToken, TokenEnum.REFRESH, false);
    if (!token) {
      throw new NotFoundError("Token not found");
    }
    await TokenModel.revokeToken(token.id as string);
    this.logger.info(`User logged out successfully`);
  }

  public async refreshToken(refreshToken: string) {
    const secret = env.JWT_SECRET;
    const token = await verifyToken(refreshToken, secret, TokenEnum.REFRESH);
    try {
        const user = await AuthModel.findUserId(token.user_id as string);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const accessToken = generateAuthToken(user.id);
        return accessToken;
    } catch (error : unknown) {
        throw new UnauthorizedError("Unauthorized, please authenticate");
    }
  }
}
