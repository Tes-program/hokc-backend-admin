import Joi from "joi"

export const createUserValidator = Joi.object({
    user_id: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    matric_number: Joi.string().required().min(7).max(7),
    hall_of_residence: Joi.string().required(),
    gender: Joi.string().required(),
    department: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    profile_picture: Joi.string().required(),  
})

export const updateUserValidator = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    phone_number: Joi.string().optional(),
    matric_number: Joi.string().optional().min(7).max(7),
    hall_of_residence: Joi.string().optional(),
    gender: Joi.string().optional(),
    department: Joi.string().optional(),
    date_of_birth: Joi.date().optional(),
    profile_picture: Joi.string().optional(),
})

export const userIdParamValidator = Joi.object({
    user_id: Joi.string().required()
})

export const paginationQueryValidator = Joi.object({
    page: Joi.number().required(),
    limit: Joi.number().required()
})