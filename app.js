import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./src/routes/authRoutes.js";
import restaurantRoutes from "./src/routes/restaurantRoutes.js";
import mealRoutes from "./src/routes/mealRoutes.js";
import clientRoutes from "./src/routes/clientRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";
const app = express();
app.use(express.json());
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, try again later"
    }
});
app.use(limiter);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Restaurant Management API is running"
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/client", clientRoutes);
app.use((req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
});
app.use(errorHandler);
export default app;
