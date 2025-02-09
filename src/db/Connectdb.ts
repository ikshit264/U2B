import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGO_DB_URI is not defined in environment variables.");
}

let isConnected = false; // Track connection status

const DbConnect = async () => {
  try {
    if (isConnected) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }

    const connect = await mongoose.connect(MONGODB_URI);

    isConnected = connect.connection.readyState === 1;

    if (isConnected) {
      console.log(`✅ MongoDB Connected: ${connect.connection.host}`);
    } else {
      console.log("⚠️ MongoDB connection failed.");
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit process on failure
  }
};

export default DbConnect;
