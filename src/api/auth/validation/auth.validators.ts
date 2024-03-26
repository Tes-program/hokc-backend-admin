import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const verifyEmailSchema = Joi.object({
  otp: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const googleSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const googleSignInSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyTokenSchema = Joi.object({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const initiatePasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
