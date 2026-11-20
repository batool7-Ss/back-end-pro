import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRE
        }
    );
};
const formatUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address
});
const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            address
        } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            email: normalizedEmail
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "client",
            phone,
            address
        });
        const token = generateToken(user);
        return res.status(201).json({
            success: true,
            message: "User registered",
            token,
            user: formatUser(user)
        });
    } catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = generateToken(user);
        return res.status(200).json({
            success: true,
            message: "Logged in",
            token,
            user: formatUser(user)
        });
    } catch (error) {
        next(error);
    }
};
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user: formatUser(user)
        });
    } catch (error) {
        next(error);
    }
};
export {
    register,
    login,
    getMe
};
