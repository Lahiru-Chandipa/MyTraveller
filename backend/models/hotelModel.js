import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    name: String,
    location: String,
    description: String,
    contact: String,

    images: [String],

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Hotel', hotelSchema);