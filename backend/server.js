import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";

let server;

const start = async () => {
    try {
        // Connect to mongoDB first
        await connectDB();

        // Start the server express
        server = app.listen(env.port, () => { console.log(`Server running on port ${env.port}`) });
    } catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
}

const shutdown = async (signal) => {
    console.log(`${signal}: shutting down`);
    if(server) {
        await server.close(async () => {
            await disconnectDB();
        })
    }
    process.exit(0); // 0 -> terminates the node process successfully
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION', error);
    shutdown('uncaughtException');
});

process.on('unhandledRejection', (error) => {
    console.log('UNCAUGHT EXCEPTION', error);
    shutdown('unhandledRejection');
});

start().catch((error) => {
    console.log("Startup failed", error);
    process.exit(1);    // 1 -> terminates the node process with Error / Failure
});