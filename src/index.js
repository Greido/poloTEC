import app from "./app.js";
import initDB from "./db.js";
import dotenv from "dotenv";
dotenv.config();

app.listen(process.env.PORT);
const connectToDB = initDB();

connectToDB();
console.log(`server on port ${process.env.PORT}`);
