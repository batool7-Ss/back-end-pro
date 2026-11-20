import config from "./src/config/config.js";
import app from "./app.js";
import connectDB from "./src/config/database.js";

const startServer = async () => {
    try {
        await connectDB();

        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();