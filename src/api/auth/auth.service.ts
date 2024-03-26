import { AuthModel } from "./auth.model";
import bcrypt from "bcrypt";
import { generateAuthToken, passwordResetToken, verifyToken, generateOTP } from "../../modules/auth";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "../../shared/error";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../../utils/interfaces/token.interface";
import { TokenModel } from "../../models/token.model";
import { redisClient } from "../../server";
import { TokenEnum } from "../../utils/enum/token";
import { env } from "../../config/env";
import { MailHandler } from "../../modules/mail/mail.handler";

export class AuthService {
  public static async register(
    email: string,
    password: string,
  ): Promise<{message: string}> {
    const existingUser = await AuthModel.findByEmail(email);
    if (existingUser) {
      throw new ForbiddenError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await AuthModel.create({
      email,
      password: hashedPassword,
    });
    const otp = await generateOTP(user[0].id);
    const otpCode = otp;

    await MailHandler.sendTemplateMail(
      {
        to: email,
        subject: "Email Verification",
      },
      "email-verification",
      { otpCode }
    );
    return {message: "Check your email to verify your account"};
  }

  public static async verifyEmail(otp: string, email: string): Promise<void> {
    const user = await AuthModel.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const otpData = await redisClient.get(`otp:${user.id}`);

    if (!otpData || otpData !== otp) {
      throw new NotFoundError("Invalid OTP or OTP has expired");
    }

    await AuthModel.updateUser(user.id, { is_verified: true });

    await redisClient.del(`otp:${user.id}`);
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

    if (!user.is_verified) {
      throw new UnauthorizedError("Verify your email to login");
    }

    const token = await generateAuthToken(user);
    return { token };
  }

  public static async googleSignUp (email: string): Promise<{ token: TokenPayload }> {
    const user = await AuthModel.findByEmail(email);
    if (user) {
      throw new ConflictError("User already exists")
    }

    const newUser = await AuthModel.create({
      email,
      google_oauth: true,
      is_verified: true
    });
    
    const token = await generateAuthToken(newUser[0]);
    return { token };
  }

  public static async googleSignIn (email: string): Promise<{ token: TokenPayload }> {
    const user = await AuthModel.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found")
    }

    if (!user.google_oauth) {
      throw new UnauthorizedError("You are not authorized to login with google, sign up instead")
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

  public static async verifyToken(accessToken: string, refreshToken: string): Promise<boolean> {
    const secret: string = env.JWT_SECRET;
    const payload = jwt.verify(accessToken, secret);
    const userId = payload.sub as string;

    const user = await AuthModel.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const token = await TokenModel.findByToken(userId ,refreshToken, TokenEnum.REFRESH, false);
    if (!token) {
      throw new NotFoundError("Token not found");
    }

    return true;
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


  public static async resetPassword(password: string, token: string): Promise<void> {
    const secret: string = env.JWT_SECRET;
    const decoded = await verifyToken(token, secret, TokenEnum.PASSWORD_RESET);
    if (!decoded) {
      throw new NotFoundError("This token has expired or can not be found")
    } else {
      const userId = decoded.user_id;
      const user = await TokenModel.findToken(token, TokenEnum.PASSWORD_RESET, false);
      if (!user) {
        throw new NotFoundError("Token not found");
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await AuthModel.updateUser(userId, { password: hashedPassword });

      await TokenModel.revokeToken(token);
    }
  }
}
