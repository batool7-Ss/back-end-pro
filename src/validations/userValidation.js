import Joi from "joi";
const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    role: Joi.string()
        .valid("admin", "restaurant_owner", "client")
        .default("client"),
    phone: Joi.string()
        .allow("")
        .optional(),
    address: Joi.string()
        .allow("")
        .optional()
});
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),
    password: Joi.string()
        .required()
});
export {
    registerSchema,
    loginSchema
};
