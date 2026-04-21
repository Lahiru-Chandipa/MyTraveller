import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";

export const payBooking = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment || payment.status === "paid") {
      return res.status(400).json({ message: "Invalid payment" });
    }

    payment.status = "paid";
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Payment successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};