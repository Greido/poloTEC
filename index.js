import app from "./app.js";
import { connectDb } from "./db.js";
import "dotenv/config";

connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
