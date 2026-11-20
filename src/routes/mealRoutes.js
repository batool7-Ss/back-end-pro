import express from "express";
import {
    authMiddleware,
    authorize
} from "../middlewares/auth.js";
import validate from "../middlewares/validation.js";
import {
    mealSchema,
    updateMealSchema
} from "../validations/mealValidation.js";
import {
    getMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal
} from "../controllers/mealController.js";
const router = express.Router();
router.get("/", getMeals);
router.get("/:id", getMeal);
router.post(
    "/",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    validate(mealSchema),
    createMeal
);
router.put(
    "/:id",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    validate(updateMealSchema),
    updateMeal
);
router.delete(
    "/:id",
    authMiddleware,
    authorize("restaurant_owner", "admin"),
    deleteMeal
);
export default router;
