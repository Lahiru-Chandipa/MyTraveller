import mongoose from "mongoose";
import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";

export const payBooking = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment id" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment || payment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized payment" });

    if (payment.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    const booking = await Booking.findById(payment.booking);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    payment.status = "paid";
    booking.status = "confirmed";

    await payment.save();
    await booking.save();

    res.json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};