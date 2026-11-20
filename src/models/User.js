import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },

        role: {
            type: String,
            enum: ["admin", "restaurant_owner", "client"],
            default: "client"
        },

        phone: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
export default User;
