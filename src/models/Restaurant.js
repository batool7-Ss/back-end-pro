import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        zipCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
);
const contactSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    },
    { _id: false }
);

const hoursSchema = new mongoose.Schema(
    {
        open: {
            type: String,
            match: /^([01]\d|2[0-3]):[0-5]\d$/
        },
        close: {
            type: String,
            match: /^([01]\d|2[0-3]):[0-5]\d$/
        }
    },
    { _id: false }
);
const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500
        },

        cuisine: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length >= 1;
                },
                message: "At least one cuisine is required"
            }
        },

        address: {
            type: addressSchema,
            required: true
        },

        contact: {
            type: contactSchema,
            required: true
        },

        openingHours: {
            type: Map,
            of: hoursSchema,
            default: undefined
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        image: {
            type: String,
            default: "default-restaurant.jpg"
        }
    },
    {
        timestamps: true
    }
);
restaurantSchema.index({ owner: 1 });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
