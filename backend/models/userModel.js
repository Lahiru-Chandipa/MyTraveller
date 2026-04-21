import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,

    role: {
      type: String,
      enum: ["user", "admin", "hotel", "driver"],
      default: "user",
    },

    isApproved: {
      type: Boolean,
      default: true, // for admin approval later
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);