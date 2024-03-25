import app from "./app.js";
import initDB from "./db.js";

app.listen(3000);
const connectToDB = initDB();

connectToDB();
console.log(`server on port ${3000}`);
