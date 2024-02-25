import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("admin", "user").required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  matric_number: Joi.string().alphanum().length(7).required(),
  phone_number: Joi.string().required(),
  hall_of_residence: Joi.string().required(),
  gender: Joi.string().valid('male', 'female', 'others').required(),
  department: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  profile_picture: Joi.string()
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
