import { AuthModel } from "./auth.model";
import bcrypt from "bcrypt";
import { generateAuthToken, passwordResetToken, verifyToken } from "../../modules/auth";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../../shared/error";
import { TokenPayload } from "../../utils/interfaces/token.interface";
import { TokenModel } from "../../models/token.model";
import { TokenEnum } from "../../utils/enum/token";
import { env } from "../../config/env";
import { MailHandler } from "../../modules/mail/mail.handler";

export class AuthService {
  public static async register(
    email: string,
    password: string,
    phone_number: string
  ): Promise<{token: TokenPayload, message: string}> {
    console.log(email)
    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      throw new ForbiddenError("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await AuthModel.create({
      email,
      password: hashedPassword,
      phone_number,
    });
    const token = await generateAuthToken(user);
    return {message: "User created successfully", token };
  }

  public static async login(
    email: string,
    password: string
  ): Promise<{ token: TokenPayload }> {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = await generateAuthToken(user);
    return { token };
  }

  public static async logout(refreshToken: string): Promise<void> {
    const token = await TokenModel.findToken(refreshToken, TokenEnum.REFRESH, false);
    if (!token) {
        throw new NotFoundError("Token Not Found")
    } 
    await TokenModel.revokeToken(token.token)
  }

  public static async refreshToken(refreshToken: string): Promise<TokenPayload> {
    const secret: string = env.JWT_SECRET;
    const decoded = await verifyToken(refreshToken, secret, TokenEnum.REFRESH);
    const userId = decoded.user_id;

    const user = await AuthModel.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const token = await generateAuthToken(user);
    return token;
  }

  public static async initiatePasswordReset(email: string): Promise<void> {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const token = await passwordResetToken(user);
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await MailHandler.sendTemplateMail(
      {
        to: email,
        subject: "Password Reset Link",
      },
      "reset-password",
      { resetUrl }
    );
  }
}
