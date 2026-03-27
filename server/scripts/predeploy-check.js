require("dotenv").config();

const mongoose = require("mongoose");
const { validateRuntimeConfig } = require("../config/runtime");

const run = async () => {
  const errors = validateRuntimeConfig();

  if (errors.length > 0) {
    console.error("Predeploy validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log("MongoDB connection check passed.");
  } catch (error) {
    console.error("MongoDB connection check failed.");
    console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => null);
  }

  console.log("Environment validation passed.");
};

run().catch((error) => {
  console.error("Predeploy check crashed.");
  console.error(error.message);
  process.exit(1);
});
