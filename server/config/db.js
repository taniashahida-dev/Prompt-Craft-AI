const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${process.env.MONGO_URI}...`);
    
    // Attempt connection to the configured MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // Fast fail-over timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`External/Local MongoDB connection failed: ${error.message}`);
    console.log("Spinning up an in-memory MongoDB Server for zero-configuration local testing...");
    
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      console.log(`In-memory MongoDB instance generated: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    } catch (innerError) {
      console.error(`Failed to launch in-memory MongoDB: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
