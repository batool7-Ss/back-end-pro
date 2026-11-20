import Restaurant from "../models/Restaurant.js";
import Meal from "../models/Meal.js";
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const isValidText = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};
const isValidObjectId = (id) => {
    return (
        typeof id === "string" &&
        /^[0-9a-fA-F]{24}$/.test(id)
    );
};
const canManageRestaurant = (restaurant, user) => {
    if (!restaurant || !user || !restaurant.owner) {
        return false;
    }
    return (
        user.role === "admin" ||
        restaurant.owner.toString() === user.id
    );
};
const getRestaurants = async (req, res, next) => {
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
        const restaurants = await Restaurant.find(filter)
            .populate("owner", "name email");

        return res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });
    } catch (error) {
        next(error);
    }
};
const getRestaurant = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            isActive: true
        }).populate("owner", "name email");

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            restaurant
        });

    } catch (error) {
        next(error);
    }
};
const getRestaurantMeals = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }

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
            count: meals.length,
            meals
        });

    } catch (error) {
        next(error);
    }
};
const getMyRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find({
            owner: req.user.id
        });

        return res.status(200).json({
            success: true,
            count: restaurants.length,
            restaurants
        });

    } catch (error) {
        next(error);
    }
};
const createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create({
            ...req.body,
            owner: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Restaurant created",
            restaurant
        });

    } catch (error) {
        next(error);
    }
};
const updateRestaurant = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        if (!canManageRestaurant(restaurant, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own restaurants"
            });
        }
        const updateData = { ...req.body };

        delete updateData.owner;
        delete updateData._id;

        Object.assign(restaurant, updateData);

        await restaurant.save();

        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        });

    } catch (error) {
        next(error);
    }
};
const deleteRestaurant = async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID"
            });
        }

        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        if (!canManageRestaurant(restaurant, req.user)) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own restaurants"
            });
        }
        await Meal.deleteMany({
            restaurant: restaurant._id
        });

        await restaurant.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Restaurant and its meals deleted"
        });

    } catch (error) {
        next(error);
    }
};

export {
    getRestaurants,
    getRestaurant,
    getRestaurantMeals,
    getMyRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};
