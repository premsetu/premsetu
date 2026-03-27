require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const matchRoutes = require("./routes/matches");
const chatRoutes = require("./routes/chat");
const { connectDatabase, stopDatabase } = require("./config/database");
const { seedDemoData } = require("./config/seedDemoData");
const { isOriginAllowed, runtimeConfig, validateRuntimeConfig } = require("./config/runtime");

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const startupErrors = validateRuntimeConfig();

if (startupErrors.length > 0) {
  throw new Error(`Invalid environment configuration: ${startupErrors.join(" ")}`);
}

app.set("trust proxy", 1);
app.disable("x-powered-by");

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin, runtimeConfig.allowedOrigins)) {
      callback(null, true);
      return;
    }

    const error = new Error("Origin not allowed by CORS.");
    error.statusCode = 403;
    callback(error);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again shortly."
  }
});

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(
  cors(corsOptions)
);
app.use(express.json({ limit: runtimeConfig.jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: runtimeConfig.jsonLimit }));
app.use(globalLimiter);

const io = new Server(httpServer, {
  cors: corsOptions
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    return next();
  } catch (error) {
    return next(new Error("Authentication failed."));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.userId}`);
});

app.set("io", io);

app.get("/", (_req, res) => {
  res.json({ message: "PremSetu API is running." });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/chat", chatRoutes);

app.use((_req, res) => {
  return res.status(404).json({ message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === "MulterError" ? 400 : 500);
  const message =
    statusCode >= 500 && runtimeConfig.isProduction
      ? "Unexpected server error."
      : err.message || "Unexpected server error.";

  return res.status(statusCode).json({
    message,
    ...(runtimeConfig.isDevelopment ? { error: err.message } : {})
  });
});

connectDatabase()
  .then(() => {
    console.log("MongoDB connected successfully.");
    return seedDemoData();
  })
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

const shutdown = async () => {
  await stopDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
