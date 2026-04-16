const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/env");
const swaggerSpec = require("./config/swagger");
const sanitizeInput = require("./middleware/sanitize.middleware");
const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/not-found.middleware");
const v1Routes = require("./routes/v1");

const app = express();
const defaultDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];
const envOrigins = config.frontendUrl.split(",").map((entry) => entry.trim());
const allowedOrigins = Array.from(new Set([...defaultDevOrigins, ...envOrigins]));

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(sanitizeInput);
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later",
    },
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", v1Routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
