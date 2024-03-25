import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI = process.env.URI;

const connect = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB: CONECTADA!");
  } catch (error) {
    console.error("DB: ERROR!", error);
  }
};

export default () => {
  return connect;
};
