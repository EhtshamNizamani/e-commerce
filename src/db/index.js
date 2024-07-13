// f6lx6Zgfr9aIETel

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected ! ${connection.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection faild ! ${error}`);
    process.exit(1);
  }
};

export default connectDB;
