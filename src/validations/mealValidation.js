import Joi from "joi";
const mealSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(5).max(500).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid(
        "appetizer",
        "main course",
        "dessert",
        "beverage",
        "side dish"
    ).required(),
    ingredients: Joi.array()
        .items(Joi.string().trim().min(1).required())
        .min(1)
        .required(),
    calories: Joi.number().min(0).optional(),
    isVegetarian: Joi.boolean().optional(),
    isVegan: Joi.boolean().optional(),
    isGlutenFree: Joi.boolean().optional(),
    isSpicy: Joi.boolean().optional(),
    preparationTime: Joi.number().min(0).required(),
    isAvailable: Joi.boolean().optional(),
    image: Joi.string().allow("").optional(),
    restaurant: Joi.string().hex().length(24).required()
});
const updateMealSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(5).max(500),
    price: Joi.number().min(0),
    category: Joi.string().valid(
        "appetizer",
        "main course",
        "dessert",
        "beverage",
        "side dish"
    ),
    ingredients: Joi.array()
        .items(Joi.string().trim().min(1).required())
        .min(1),
    calories: Joi.number().min(0),
    isVegetarian: Joi.boolean(),
    isVegan: Joi.boolean(),
    isGlutenFree: Joi.boolean(),
    isSpicy: Joi.boolean(),
    preparationTime: Joi.number().min(0),
    isAvailable: Joi.boolean(),
    image: Joi.string().allow(""),
    restaurant: Joi.string().hex().length(24)
}).min(1);
export {
    mealSchema,
    updateMealSchema
};
