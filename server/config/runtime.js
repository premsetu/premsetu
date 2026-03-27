const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "true";
};

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin || allowedOrigins.length === 0) {
    return true;
  }

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === origin) {
      return true;
    }

    if (allowedOrigin.includes("*")) {
      const pattern = new RegExp(
        `^${allowedOrigin
          .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\*/g, ".*")}$`
      );

      return pattern.test(origin);
    }

    return false;
  });
};

const runtimeConfig = {
  isProduction,
  isDevelopment,
  allowedOrigins: getAllowedOrigins(),
  allowInMemoryDb: parseBoolean(process.env.ALLOW_IN_MEMORY_DB, isDevelopment),
  enableDemoSeed: parseBoolean(process.env.ENABLE_DEMO_SEED, false),
  allowLocalUploadFallback: parseBoolean(process.env.ALLOW_LOCAL_UPLOAD_FALLBACK, isDevelopment),
  jsonLimit: process.env.JSON_LIMIT || "1mb"
};

const validateRuntimeConfig = () => {
  const errors = [];

  if (!process.env.JWT_SECRET) {
    errors.push("JWT_SECRET is required.");
  }

  if (runtimeConfig.isProduction) {
    if (!process.env.MONGO_URI) {
      errors.push("MONGO_URI is required in production.");
    }

    if (runtimeConfig.allowedOrigins.length === 0) {
      errors.push("CLIENT_URL or CLIENT_URLS must be set in production.");
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      errors.push("Cloudinary credentials are required in production.");
    }

    if (runtimeConfig.allowInMemoryDb) {
      errors.push("ALLOW_IN_MEMORY_DB must be false in production.");
    }

    if (runtimeConfig.enableDemoSeed) {
      errors.push("ENABLE_DEMO_SEED must be false in production.");
    }
  }

  return errors;
};

module.exports = {
  parseBoolean,
  isOriginAllowed,
  runtimeConfig,
  validateRuntimeConfig
};
