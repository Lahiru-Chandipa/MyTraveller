import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";

export const createBooking = async (req, res) => {
  try {
    const { type, itemId, startDate, endDate, totalPrice } = req.body;

    if (!type || !itemId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      type,
      itemId,
      startDate,
      endDate,
      totalPrice,
    });

    const payment = await Payment.create({
      user: req.user.id,
      booking: booking._id,
      amount: booking.totalPrice,
    });

    res.json({ booking, payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.json(bookings);
};