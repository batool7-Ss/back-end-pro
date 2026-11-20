import dotenv from "dotenv";
dotenv.config();
const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || "7d"
};
if (!config.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from environment variables");
}
if (!config.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
}
export default config;
