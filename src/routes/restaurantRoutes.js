import express from "express";
import {
    authMiddleware,
    authorize
} from "../middlewares/auth.js";
import validate from "../middlewares/validation.js";
import {
    restaurantSchema,
    updateRestaurantSchema
} from "../validations/restaurantValidation.js";
import {
    getRestaurants,
    getRestaurant,
    getRestaurantMeals,
    getMyRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from "../controllers/restaurantController.js";
const router = express.Router();
router.get("/", getRestaurants);
router.get("/:id/meals", getRestaurantMeals);
router.get("/:id", getRestaurant);
router.get(
    "/owner/my-restaurants",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    getMyRestaurants
);
router.post(
    "/",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    validate(restaurantSchema),
    createRestaurant
);
router.put(
    "/:id",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    validate(updateRestaurantSchema),
    updateRestaurant
);
router.delete(
    "/:id",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    deleteRestaurant
);
export default router;
