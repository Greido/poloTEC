import app from "./app.js";
import initDB from "./db.js";
import dotenv from "dotenv";
import path from "path";
import express from "express";
dotenv.config();

app.listen(process.env.PORT);

const connectToDB = initDB();

const publicPath = new URL("../public", import.meta.url).pathname;
const publcDirectoryPath = path.join(publicPath, "public");

app.use(express.static(publcDirectoryPath));

connectToDB();

console.log(`server on port ${process.env.PORT}`);
