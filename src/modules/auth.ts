import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { OTPModel } from "../models/otp.model";
import moment from "moment";
import { TokenModel } from "../models/token.model";
import { TokenEnum } from "../utils/enum/token";
import { env } from "../config/env";
import { NotFoundError } from "../shared/error";
import { IUser } from "../utils/interfaces/user.interface";

export const generateToken = (
  userId: string,
  expires: Date,
  type: TokenEnum,
  secret = env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment(expires).unix(),
    type,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

export const saveToken = async (
  userId: string,
  token: string,
  expires: Date,
  type: TokenEnum
) => {
  return TokenModel.create({
    user_id: userId,
    token,
    expires_at: expires,
    type,
    is_revoked: false,
  });
};

export const verifyToken = async (
  token: string,
  secret = env.JWT_SECRET,
  type: TokenEnum
) => {
  const payload = jwt.verify(token, secret);
  const verifyToken = await TokenModel.findByToken( payload.sub as string, token, type, false);
  if (!verifyToken) {
    throw new NotFoundError("Token not found");
  }
  return verifyToken;
};

export const generateAuthToken = async (user: IUser) => {
  const accessTokenExpires = moment()
    .add(env.JWT_ACCESS_EXPIRATION_MINUTES, "minutes")
    .toDate();
  const accessToken = generateToken(user.id, accessTokenExpires, TokenEnum.ACCESS);
  const refreshTokenExpires = moment()
    .add(env.JWT_REFRESH_EXPIRATION_DAYS, "days")
    .toDate();
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TokenEnum.REFRESH
  );

  await saveToken(user.id, refreshToken, refreshTokenExpires, TokenEnum.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

export const passwordResetToken = async (user: IUser) => {
  const expires = moment().add(1, "hour").toDate();
  const token = generateToken(user.id, expires, TokenEnum.PASSWORD_RESET);
  await saveToken(user.id, token, expires, TokenEnum.PASSWORD_RESET);
  return token;
};

export const generateOTP = async (userId: string)=> {
  try {
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  const expires = moment().add(2, "minutes").toDate();
  await OTPModel.create({
    user_id: userId,
    otp,
    expires_at: expires,
    is_used: false,
  });
  return otp;
} catch (error) {
  throw new Error("Error generating OTP");
}
}
