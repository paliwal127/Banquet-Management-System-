require("dotenv").config();
const env = require("./config/env");
const initDb = require("./config/initDb");

require("./jobs/releaseTentativeBookings");
require("./jobs/sendReminders");

const app = require("./app");

const PORT = env.PORT || process.env.PORT || 5000;

initDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });

    process.on("unhandledRejection", (reason) => {
      console.error("UNHANDLED REJECTION:", reason);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("UNCAUGHT EXCEPTION:", err);
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully.");
      server.close(() => {
        console.log("Process terminated");
      });
    });
  })
  .catch((error) => {
    console.error("Failed to start server due to DB init error:", error);
    process.exit(1);
  });