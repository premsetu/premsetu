const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { runtimeConfig } = require("./runtime");

let memoryServer;

const connectDatabase = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (!runtimeConfig.allowInMemoryDb) {
      throw new Error("MONGO_URI is required when ALLOW_IN_MEMORY_DB is disabled.");
    }

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "premsetu"
      }
    });
    mongoUri = memoryServer.getUri();
    console.log("Using in-memory MongoDB because MONGO_URI was not provided.");
  }

  await mongoose.connect(mongoUri);
};

const stopDatabase = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = {
  connectDatabase,
  stopDatabase
};
