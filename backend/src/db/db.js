import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Database Connected Successfully !! \nDB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("mongoDB connection FAIL ", error);
    process.exit(1);
  }
};

export default connectDB;
