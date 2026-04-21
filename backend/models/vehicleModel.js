import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },

    type: String,
    model: String,
    capacity: Number,
    pricePerDay: Number,

    images: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);