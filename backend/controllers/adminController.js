import User from "../models/userModel.js";
import Hotel from "../models/hotelModel.js";
import Driver from "../models/driverModel.js";
import Booking from "../models/bookingModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin")
      return res.status(401).json({ message: "Not an admin" });

    if (!admin.isApproved) {
      return res.status(403).json({ message: "Admin account is not approved" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const data = admin.toObject();
    delete data.password;

    res.json({ token: generateToken(admin), user: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const [users, hotels, drivers, bookings] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments(),
      Driver.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.json({ users, hotels, drivers, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// APPROVE DRIVER
export const approveDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driver.isApproved) {
      return res.status(400).json({ message: "Driver already approved" });
    }

    driver.isApproved = true;
    await driver.save();

    res.json({ message: "Driver approved", driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE HOTEL
export const approveHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.isApproved) {
      return res.status(400).json({ message: "Hotel already approved" });
    }

    hotel.isApproved = true;
    await hotel.save();

    res.json({ message: "Hotel approved", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
