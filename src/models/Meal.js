import mongoose from "mongoose";
const mealSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 500
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            enum: [
                "appetizer",
                "main course",
                "dessert",
                "beverage",
                "side dish"
            ]
        },
        ingredients: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length >= 1;
                },
                message: "At least one ingredient is required"
            }
        },
        calories: {
            type: Number,
            min: 0
        },
        isVegetarian: {
            type: Boolean,
            default: false
        },
        isVegan: {
            type: Boolean,
            default: false
        },
        isGlutenFree: {
            type: Boolean,
            default: false
        },
        isSpicy: {
            type: Boolean,
            default: false
        },
        preparationTime: {
            type: Number,
            required: true,
            min: 0
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        image: {
            type: String,
            default: "default-meal.jpg"
        }
    },
    {
        timestamps: true
    }
);
mealSchema.index({ restaurant: 1 });
mealSchema.index({ category: 1 });
mealSchema.index({ restaurant: 1, category: 1 });
const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
