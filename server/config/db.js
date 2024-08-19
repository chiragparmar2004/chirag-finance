import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    console.log("Connecting to", process.env.DB_URL);
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default dbConnection;
