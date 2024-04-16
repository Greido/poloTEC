import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
});
export default mongoose.model("UserData", userDataSchema);
