import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  basicData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BasicData', 
  },
});

export default mongoose.model("User", userSchema);
