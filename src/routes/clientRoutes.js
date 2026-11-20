import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
    getClientRestaurants,
    getClientMeals,
    getClientMealDetails,
    getClientRestaurantDetails,
    getClientCategories
} from "../controllers/clientController.js";
const router = express.Router();
router.use(authMiddleware);
router.use(authorize("client"));
router.get("/restaurants", getClientRestaurants);
router.get("/restaurants/:id", getClientRestaurantDetails);
router.get("/categories", getClientCategories);
router.get("/meals", getClientMeals);
router.get("/meals/:id", getClientMealDetails);
export default router;
