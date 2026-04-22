import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["hotel", "driver", "full"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    images: [String],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
