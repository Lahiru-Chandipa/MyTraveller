import Driver from "../models/driverModel.js";
import Hotel from "../models/hotelModel.js";



// HOTEL ACCESS
export const requireHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ user: req.user.id });

    if (!hotel || !hotel.isApproved) {
      return res.status(403).json({ message: "Hotel access denied" });
    }

    req.hotel = hotel;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROVIDER (FIXED)
export const requireProvider = async (req, res, next) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });
    const hotel = await Hotel.findOne({ user: req.user.id });

    const approvedDriver = driver && driver.isApproved ? driver : null;
    const approvedHotel = hotel && hotel.isApproved ? hotel : null;

    if (!approvedDriver && !approvedHotel) {
      return res.status(403).json({ message: "Provider access denied" });
    }

    // ONLY APPROVED profiles
    req.driver = approvedDriver;
    req.hotel = approvedHotel;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};