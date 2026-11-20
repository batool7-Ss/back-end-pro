import express from "express";
import {
    register,
    login,
    getMe
} from "../controllers/authController.js";
import validate from "../middlewares/validation.js";
import {
    registerSchema,
    loginSchema
} from "../validations/userValidation.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, getMe);
export default router;
