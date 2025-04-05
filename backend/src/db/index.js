import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../../constants.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
    .then(() => {
      console.log("DATABASE CONNECTED"); 
    })
    .catch((err) => console.log("SOME ERROR OCCURED:",err));
  } catch (error) {
    console.error("Failed to connect to database:", error); 
  }
};

export default connectDB;