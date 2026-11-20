import Joi from "joi";
const addressSchema = Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zipCode: Joi.string().trim().required(),
    country: Joi.string().trim().required()
});
const contactSchema = Joi.object({
    phone: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .required(),
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
});
const hoursSchema = Joi.object({
    open: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .required(),
    close: Joi.string()
        .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
        .required()
});
const openingHoursSchema = Joi.object().pattern(
    Joi.string(),
    hoursSchema
);
const restaurantSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).max(500).required(),
    cuisine: Joi.array()
        .items(Joi.string().trim().min(1).required())
        .min(1)
        .required(),
    address: addressSchema.required(),
    contact: contactSchema.required(),
    openingHours: openingHoursSchema.optional(),
    image: Joi.string().allow("").optional()
});
const updateRestaurantSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(10).max(500),
    cuisine: Joi.array()
        .items(Joi.string().trim().min(1).required())
        .min(1),
    address: addressSchema,
    contact: contactSchema,
    openingHours: openingHoursSchema,
    image: Joi.string().allow("")
}).min(1);
export {
    restaurantSchema,
    updateRestaurantSchema
};
