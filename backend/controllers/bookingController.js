import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";
import Package from "../models/packageModel.js";
import Vehicle from "../models/vehicleModel.js";
import Hotel from "../models/hotelModel.js";

export const createBooking = async (req, res) => {
  try {
    const { type, itemId, startDate, endDate } = req.body;

    const allowedTypes = ["hotel", "driver", "package"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid booking type" });
    }

    if (!type || !itemId || !startDate || !endDate)
      return res.status(400).json({ message: "All fields required" });

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    if (isNaN(new Date(startDate)) || isNaN(new Date(endDate)))
      return res.status(400).json({ message: "Invalid date format" });

    if (new Date(startDate) > new Date(endDate))
      return res.status(400).json({ message: "Invalid date range" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();

    if (timeDiff < 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const durationInDays = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

    let price = 0;

    if (type === "package") {
      const pkg = await Package.findById(itemId);
      if (!pkg) return res.status(404).json({ message: "Package not found" });
      if (!pkg.isAvailable) {
        return res.status(400).json({ message: "Package is not available" });
      }
      price = pkg.price * durationInDays;
    }

    if (type === "driver") {
      const vehicle = await Vehicle.findById(itemId);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
      if (!vehicle.isAvailable) {
        return res.status(400).json({ message: "Vehicle is not available" });
      }
      price = vehicle.pricePerDay * durationInDays;
    }

    if (type === "hotel") {
      const hotel = await Hotel.findById(itemId);
      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      if (!hotel.isApproved || !hotel.isAvailable) {
        return res.status(400).json({ message: "Hotel is not available" });
      }
      price = hotel.pricePerNight * durationInDays;
    }

    const session = await Booking.startSession();
    let booking;
    let payment;

    try {
      await session.withTransaction(async () => {
        [booking] = await Booking.create([{
          user: req.user.id,
          type,
          itemId,
          startDate,
          endDate,
          totalPrice: price,
        }], { session });

        [payment] = await Payment.create([{
          user: req.user.id,
          booking: booking._id,
          amount: price,
        }], { session });
      });
    } finally {
      await session.endSession();
    }

    res.status(201).json({ booking, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
