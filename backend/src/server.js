const app = require("./app");
const config = require("./config/env");
const connectDb = require("./config/db");

const startServer = async () => {
  try {
    await connectDb(config.mongoUri);

    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
