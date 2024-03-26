import joi from 'joi';
import path from 'path';
import dotenv from 'dotenv';
import { Logger } from '../shared/logger';


dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});


const logger = new Logger();

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .valid('development', 'production', 'test')
    .required(),
  PORT: joi.number()
    .default(3000),
  DB_HOST: joi.string()
    .required(),
  DB_NAME: joi.string()
    .required(),
  DB_USER: joi.string()
    .required(),
  DB_PASSWORD: joi.string()
    .required(),
  USER_PASSWORD: joi.string() 
    .required(),
  JWT_SECRET: joi.string()
    .required(),
  JWT_EXPIRES_IN: joi.string()
    .required(),
  SUPABASE_URL: joi.string()
    .required(),
  SUPABASE_KEY: joi.string()
    .required(),
  JWT_REFRESH_EXPIRATION_DAYS: joi.string()
    .required(),
  JWT_ACCESS_EXPIRATION_MINUTES: joi.string()
    .required(),
  RESEND_API_KEY: joi.string()
    .required(),
  EMAIL_FROM: joi.string()
    .required(),
  FRONTEND_URL: joi.string()
    .required(),
  REDIS_URL: joi.string()
    .required()
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if ( error ) {
    logger.error(`Config validation error: ${error.message}`);
    process.exit(1);
}

export const env = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  DB_HOST: envVars.DB_HOST,
  DB_NAME: envVars.DB_NAME,
  DB_USER: envVars.DB_USER,
  DB_PASSWORD: envVars.DB_PASSWORD,
  USER_PASSWORD: envVars.USER_PASSWORD,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
  SUPBASE_URL: envVars.SUPBASE_URL,
  SUPABASE_KEY: envVars.SUPBASE_KEY,
  JWT_REFRESH_EXPIRATION_DAYS: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  JWT_ACCESS_EXPIRATION_MINUTES: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  RESEND_API_KEY: envVars.RESEND_API_KEY,
  EMAIL_FROM: envVars.EMAIL_FROM,
  FRONTEND_URL: envVars.FRONTEND_URL,
  REDIS_URL: envVars.REDIS_URL
};