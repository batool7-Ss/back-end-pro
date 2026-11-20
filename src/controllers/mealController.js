import Meal from "../models/Meal.js";
import Restaurant from "../models/Restaurant.js";
const MEAL_CATEGORIES = [
    "appetizer",
    "main course",
    "dessert",
    "beverage",
    "side dish"
];
const canManageRestaurant = (restaurant, user) => {
    if (!restaurant || !user || !restaurant.owner) {
        return false;
    }
    return (
        user.role === "admin" ||
        restaurant.owner.toString() === user.id
    );
};
const validatePriceFilters = (minPrice, maxPrice) => {
    if (
        (minPrice !== undefined &&
            (minPrice.trim() === "" || !Number.isFinite(Number(minPrice)))) ||
        (maxPrice !== undefined &&
            (maxPrice.trim() === "" || !Number.isFinite(Number(maxPrice))))
    ) {
        return {
            valid: false,
            message: "Prices must be numbers"
        };
    }
    const min = minPrice === undefined ? undefined : Number(minPrice);
    const max = maxPrice === undefined ? undefined : Number(maxPrice);
    if (
        (min !== undefined && min < 0) ||
        (max !== undefined && max < 0)
    ) {
        return {
            valid: false,
            message: "Prices cannot be negative"
        };
    }
    if (min !== undefined && max !== undefined && min > max) {
        return {
            valid: false,
            message: "minPrice is bigger than maxPrice"
        };
    }
    return { valid: true, min, max };
};
const validateBooleanFilters = (isVegetarian, isVegan) => {
    return (
        (isVegetarian === undefined ||
            ["true", "false"].includes(isVegetarian)) &&
        (isVegan === undefined ||
            ["true", "false"].includes(isVegan))
    );
};
const isValidObjectId = (id) => {
    return (
        typeof id === "string" &&
        /^[0-9a-fA-F]{24}$/.test(id)
    );
};
const getMeals = async (req, res, next) => {
    try {
        const {
            category,
            restaurant,
            minPrice,
            maxPrice,
            isVegetarian,
            isVegan
        } = req.query;
        if (
            category !== undefined &&
            !MEAL_CATEGORIES.includes(category.trim().toLowerCase())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal category"
            });
        }
        if (
            restaurant !== undefined &&
            !isValidObjectId(restaurant)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }
        const priceValidation = validatePriceFilters(
            minPrice,
            maxPrice
        );

        if (!priceValidation.valid) {
            return res.status(400).json({
                success: false,
                message: priceValidation.message
            });
        }
        if (!validateBooleanFilters(isVegetarian, isVegan)) {
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
        if (
            priceValidation.min !== undefined ||
            priceValidation.max !== undefined
        ) {
            filter.price = {};
            if (priceValidation.min !== undefined) {
                filter.price.$gte = priceValidation.min;
            }

            if (priceValidation.max !== undefined) {
                filter.price.$lte = priceValidation.max;
            }
        }
        if (isVegetarian !== undefined) {
            filter.isVegetarian = isVegetarian === "true";
        }
        if (isVegan !== undefined) {
            filter.isVegan = isVegan === "true";
        }
        const meals = await Meal.find(filter)
            .populate("restaurant", "name");

        return res.status(200).json({
            success: true,
            count: meals.length,
            meals
        });
    } catch (error) {
        next(error);
    }
};
const getMeal = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal ID"
            });
        }
        const activeRestaurants = await Restaurant.distinct("_id", {
            isActive: true
        });
        const meal = await Meal.findOne({
            _id: req.params.id,
            isAvailable: true,
            restaurant: {
                $in: activeRestaurants
            }
        }).populate("restaurant", "name");

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
const createMeal = async (req, res, next) => {
    try {
        const { restaurant: restaurantId } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        if (!restaurant.isActive) {
            return res.status(400).json({
                success: false,
                message: "This restaurant is not active"
            });
        }
        if (!canManageRestaurant(restaurant, req.user)) {
            return res.status(403).json({
                success: false,
                message: "This restaurant is not yours"
            });
        }
        const meal = await Meal.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Meal created",
            meal
        });
    } catch (error) {
        next(error);
    }
};
const updateMeal = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal ID"
            });
        }
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }
        const currentRestaurant = await Restaurant.findById(
            meal.restaurant
        );
        if (!currentRestaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        if (!canManageRestaurant(currentRestaurant, req.user)) {
            return res.status(403).json({
                success: false,
                message: "This meal is not yours"
            });
        }
        if (
            req.body.restaurant &&
            req.body.restaurant.toString() !== meal.restaurant.toString()
        ) {
            const newRestaurant = await Restaurant.findById(
                req.body.restaurant
            );
            if (!newRestaurant) {
                return res.status(404).json({
                    success: false,
                    message: "New restaurant not found"
                });
            }
            if (!newRestaurant.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "The new restaurant is not active"
                });
            }
            if (!canManageRestaurant(newRestaurant, req.user)) {
                return res.status(403).json({
                    success: false,
                    message: "The new restaurant is not yours"
                });
            }
        }
        Object.assign(meal, req.body);
        await meal.save();
        return res.status(200).json({
            success: true,
            message: "Meal updated",
            meal
        });
    } catch (error) {
        next(error);
    }
};
const deleteMeal = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid meal ID"
            });
        }
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({
                success: false,
                message: "Meal not found"
            });
        }
        const restaurant = await Restaurant.findById(meal.restaurant);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        if (!canManageRestaurant(restaurant, req.user)) {
            return res.status(403).json({
                success: false,
                message: "This meal is not yours"
            });
        }
        await meal.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Meal deleted"
        });
    } catch (error) {
        next(error);
    }
};
export {
    getMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal
};
