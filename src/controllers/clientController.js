import Restaurant from "../models/Restaurant.js";
import Meal from "../models/Meal.js";
const MEAL_CATEGORIES = [
    "appetizer",
    "main course",
    "dessert",
    "beverage",
    "side dish"
];
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const isValidText = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};
const getClientRestaurants = async (req, res, next) => {
    try {
        const { city, cuisine } = req.query;
        if (
            (city !== undefined && !isValidText(city)) ||
            (cuisine !== undefined && !isValidText(cuisine))
        ) {
            return res.status(400).json({
                success: false,
                message: "City and cuisine must not be empty"
            });
        }
        const filter = {
            isActive: true
        };
        if (city) {
            filter["address.city"] = {
                $regex: escapeRegex(city.trim()),
                $options: "i"
            };
        }
        if (cuisine) {
            filter.cuisine = {
                $regex: escapeRegex(cuisine.trim()),
                $options: "i"
            };
        }
        const restaurants = await Restaurant.find(filter);
        return res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });
    } catch (error) {
        next(error);
    }
};
const getClientMeals = async (req, res, next) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            restaurant,
            isVegetarian,
            isVegan,
            search
        } = req.query;
        if (
            (category !== undefined && !isValidText(category)) ||
            (search !== undefined && !isValidText(search))
        ) {
            return res.status(400).json({
                success: false,
                message: "Category and search must not be empty"
            });
        }
        if (
            category &&
            !MEAL_CATEGORIES.includes(category.trim().toLowerCase())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal category"
            });
        }
        if (
            restaurant !== undefined &&
            (
                typeof restaurant !== "string" ||
                !/^[0-9a-fA-F]{24}$/.test(restaurant)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }
        const min = minPrice === undefined ? undefined : Number(minPrice);
        const max = maxPrice === undefined ? undefined : Number(maxPrice);
        if (
            (minPrice !== undefined &&
                (minPrice.trim() === "" || !Number.isFinite(min) || min < 0)) ||
            (maxPrice !== undefined &&
                (maxPrice.trim() === "" || !Number.isFinite(max) || max < 0))
        ) {
            return res.status(400).json({
                success: false,
                message: "Prices must be numbers and not negative"
            });
        }
        if (min !== undefined && max !== undefined && min > max) {
            return res.status(400).json({
                success: false,
                message: "minPrice is bigger than maxPrice"
            });
        }
        if (
            (isVegetarian !== undefined &&
                !["true", "false"].includes(isVegetarian)) ||
            (isVegan !== undefined &&
                !["true", "false"].includes(isVegan))
        ) {
            return res.status(400).json({
                success: false,
                message: "isVegetarian and isVegan must be true or false"
            });
        }
        const activeRestaurants = await Restaurant.distinct("_id", {
            isActive: true
        });
        const filter = {
            isAvailable: true,
            restaurant: {
                $in: activeRestaurants
            }
        };
        if (category) {
            filter.category = category.trim().toLowerCase();
        }
        if (restaurant) {
            filter.restaurant.$in = activeRestaurants.filter(
                (id) => id.toString() === restaurant
            );
        }
        if (isVegetarian !== undefined) {
            filter.isVegetarian = isVegetarian === "true";
        }
        if (isVegan !== undefined) {
            filter.isVegan = isVegan === "true";
        }
        if (search) {
            const searchRegex = {
                $regex: escapeRegex(search.trim()),
                $options: "i"
            };
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex }
            ];
        }
        if (min !== undefined || max !== undefined) {
            filter.price = {};

            if (min !== undefined) {
                filter.price.$gte = min;
            }

            if (max !== undefined) {
                filter.price.$lte = max;
            }
        }
        const meals = await Meal.find(filter)
            .populate("restaurant", "name address");

        return res.status(200).json({
            success: true,
            count: meals.length,
            meals
        });
    } catch (error) {
        next(error);
    }
};
const getClientMealDetails = async (req, res, next) => {
    try {
        const activeRestaurants = await Restaurant.distinct("_id", {
            isActive: true
        });
        const meal = await Meal.findOne({
            _id: req.params.id,
            isAvailable: true,
            restaurant: {
                $in: activeRestaurants
            }
        }).populate("restaurant", "name address");

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }
        return res.status(200).json({
            success: true,
            meal
        });

    } catch (error) {
        next(error);
    }
};
const getClientRestaurantDetails = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            isActive: true
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        const meals = await Meal.find({
            restaurant: restaurant._id,
            isAvailable: true
        });
        return res.status(200).json({
            success: true,
            restaurant,
            count: meals.length,
            meals
        });
    } catch (error) {
        next(error);
    }
};
const getClientCategories = async (req, res, next) => {
    try {
        const activeRestaurants = await Restaurant.distinct("_id", {
            isActive: true
        });
        const categories = await Meal.distinct("category", {
            isAvailable: true,
            restaurant: {
                $in: activeRestaurants
            }
        });
        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        next(error);
    }
};
export {
    getClientRestaurants,
    getClientMeals,
    getClientMealDetails,
    getClientRestaurantDetails,
    getClientCategories
};
